const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
  if (err.name === "CastError") {
    const message = `invalid  error  ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //duplicate keys Error
  if (err.code === "11000") {
    const message = `Duplicate keys ${Object.keys(err.keyValue)}entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt Error
  if (err.name === "jsonwebTokenError") {
    const message = `json web token is invalid  please try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired error
  if (err.name === "json web token expired") {
    const message = `json web token expired , try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
