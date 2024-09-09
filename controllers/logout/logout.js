const ErrorHandler = require("../../utils/errorHandler");
const userModal = require("../../models/user/userModel");
const sendToken = require("../../utils/jwt");
const Logout = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", " ", { maxAge: 1 });
    res.cookie("refresh_token"," ", { maxAge: 1 });
    res.status(200).json({
      success: true,
      message: "user logout successFull",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = Logout;
