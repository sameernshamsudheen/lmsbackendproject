const ErrorHandler = require("../../utils/errorHandler");
const userModal = require("../../models/user/userModel");
const sendToken = require("../../utils/jwt");
const { redis } = require("../../redis/redisConnection");
const Logout = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", " ", { maxAge: 1 });
    res.cookie("refresh_token", " ", { maxAge: 1 });
    const userId = req.user?._id || "";
        console.log(userId ,"userID");
        
    redis.del(userId);
    res.status(200).json({
      success: true,
      message: "user logout successFull",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = Logout;
