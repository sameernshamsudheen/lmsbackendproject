const UserModal = require("../../models/user/userModel");
const ErrorHandler = require("../../utils/errorHandler");

const createActivationToken = require("./helper/createactivation");

const UserRegistraion = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = UserModal.findOne({ email });

    if (emailExists) {
      return next(new ErrorHandler("email already exists", 400));
    }

    const user = { name, email, password };

    const activationToken = createActivationToken(user);
    const  activationCode =activationToken.ActivationCode

      const  data = {user:{name:user.name},activationCode}

    // return res.status(200).json({
    //   success: true,
    //   status: 200,
    // });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
