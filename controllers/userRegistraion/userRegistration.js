const UserModal = require("../../models/user/userModel");
const ErrorHandler = require("../../utils/errorHandler");
const ejs = require("ejs");
import path from "path";
const sendMail = require("../../utils/sendMail");

const createActivationToken = require("./helper/createactivation");

const UserRegistraion = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = UserModal.findOne({ email });

    if (emailExists) {
      return next(new ErrorHandler("email already exists", 400));
    }

    const user = { name, email, password };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.ActivationCode;

    const data = { user: { name: user.name }, activationCode };
    const html = ejs.renderFile(
      path.join(
        __dirname,
        "../../emailTemplate/emailUserRegistraionTemplate.ejs",
        data
      )
    );

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
    return next(new ErrorHandler(error.message, 400));
  }
};
