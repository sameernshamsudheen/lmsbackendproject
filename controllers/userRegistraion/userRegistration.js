const UserModal = require("../../models/user/userModel");
const ErrorHandler = require("../../utils/errorHandler");
const { redis } = require("../../redis/redisConnection");
require("dotenv").config();
const { accessTokenOptions, refreshTokenOptions } = require("../../utils/jwt");
const ejs = require("ejs");
const path = require("path");
const sendMail = require("../../utils/sendMail");
const catchAsyncError = require("../../middleware/catchasyncerror");

const createActivationToken = require("./helper/createactivation");
const jwt = require("jsonwebtoken");
const getUserById = require("../../service/user.service");
const { sendToken } = require("../../utils/jwt");
const cloudinary = require("cloudinary");

//user Registraiotn

const UserRegistration = async (req, res, next) => {
  console.log("userRegistrasion====");

  try {
    const { name, email, password } = req.body;

    const emailExists = await UserModal.findOne({ email })

      
    console.log(emailExists, "email exist error");
     

    if (emailExists) {
      return next(new ErrorHandler("email already exists", 400));
    }

    const user = { name, email, password };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.ActivationCode;

    const data = { user: { name: user.name }, activationCode };
    const templatePath = path.join(
      __dirname,
      "../../emailTemplate/emailUserRegistraionTemplate.ejs"
    );
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err) {
        console.error("Error rendering EJS template:", err);
      } else {
        console.log("Rendered HTML:", str);
        // You can now use the `str` (the rendered HTML) as needed
      }
    });

    try {
      await sendMail({
        email: user.email,
        subject: "ActivationCode",
        template: "emailUserRegistraionTemplate.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `please  check your email:${user.email} to activate your account`,
        activationToken: activationToken.token,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {

    console.log(error.message);
    
    return next(new ErrorHandler(error.message, 400));
  }
};

//user Activation

const userActivation = async (req, res, next) => {
  console.log("userActivation function called");
  try {
    const { activation_code, activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    console.log(newUser, "newuser====");
    if (newUser.ActivationCode !== activation_code) {
      return next(new ErrorHandler("invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;
    const emailExists = await UserModal.findOne({ email });

    if (emailExists) {
      return next(new ErrorHandler("user already exist", 400));
    }

    const user = await UserModal.create({
      name,
      email,
      password,
    });
    res.status(201).json({
      success: true,
      message: "User registraion successfull",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//update json token
const updateAccessToken = catchAsyncError(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
    const message = "Could not refresh token";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }
    const session = await redis.get(decoded.id);
    if (!session) {
      return next(new ErrorHandler(message, 400));
    }
    const user = JSON.parse(session);
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
      expiresIn: "3d",
    });
    req.user = user;
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({
      success: true,
      accessToken,
      
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//get userinfo

const getuserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    getUserById(userId, res, next);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const socialAuth = catchAsyncError(async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;
    const user = await UserModal.findOne({ email });
    if (!user) {
      const newUser = await UserModal.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user?._id;
    const user = await UserModal.findById(userId);

    if (email && user) {
      const isEmailExist = await UserModal.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      user.email = email;
    }
    if (name && user) {
      user.name = name;
    }
    await user?.save();
    await redis.set(userId, JSON.stringify(user));
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
const passwordUpdate = catchAsyncError(async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;
    // const userId = req.user?._id;
    const user = await UserModal.findById(req.user?._id).select("password");
    console.log(user, "===user====my user");

    const isPasswordMatch = await user?.comparePassword(oldpassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("invalid old password", 400));
    }
    user.password = newpassword;
    await user.save();
    await redis.set(req.user?._id, JSON.stringify(user));
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const user = await UserModal.findById(userId);
    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        const mycloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      } else {
        const mycloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      }
    }
    await user?.save();
    await redis.set(userId, JSON.stringify(user));
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
module.exports = {
  UserRegistration,
  userActivation,
  updateAccessToken,
  getuserInfo,
  socialAuth,
  updateUserInfo,
  passwordUpdate,
  updateProfilePicture,
};
