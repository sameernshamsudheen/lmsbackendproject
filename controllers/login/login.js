const ErrorHandler = require("../../utils/errorHandler");
const userModal = require("../../models/user/userModel");
const { sendToken } = require("../../utils/jwt");
const  Login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorHandler("please enter a  valid email or  password", 400)
      );
    }
    const user = await userModal.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("user does not exist", 400));
    }
    const checkPassword = await user.comparePassword(password);

    if (!checkPassword) {
      return next(new ErrorHandler("invalid password", 400));
    }

 
    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = Login;
