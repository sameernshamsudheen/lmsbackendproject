const CatchAsyncError = require("./catchasyncerror");
const ErrorHandler = require("../utils/errorHandler");
const { redis } = require("../redis/redisConnection");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const cookies =require("cookie-parser")

require("dotenv").config();
// authenticated user
const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;
  console.log(access_token, "=====sameer====");

  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }
  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
  if (!decoded) {
    return next(new ErrorHandler("access token is not valid", 400));
  }
  const user = await redis.get(decoded.id);
  if (!user) {
    return next(new ErrorHandler("user not found", 400));
  }
  req.user = JSON.parse(user);
  next();
});

module.exports = isAuthenticated;
