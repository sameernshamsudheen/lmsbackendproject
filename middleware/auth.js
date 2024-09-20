const CatchAsyncError = require("./catchasyncerror");
const ErrorHandler = require("../utils/errorHandler");
const { redis } = require("../redis/redisConnection");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const cookies = require("cookie-parser");

require("dotenv").config();
// authenticated user
const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;


  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }
  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }
  const user = await redis.get(decoded.id);

   
  if (!user) {
    return next(new ErrorHandler("please login to access this resource", 400));
  }
  req.user = JSON.parse(user);

  next();
});

//validate userRoles

const validateUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || " ")) {
      return next(
        new ErrorHandler(
          `Role:${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  validateUserRole,
};
