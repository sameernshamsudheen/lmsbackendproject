const { redis } = require("../redis/redisConnection");
require("dotenv").config();
// const client = redis.createClient();
const cookie = require("cookie-parser");

const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);
const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const sendToken = async (user, statusCode, res) => {
  const accessToken = user.SignAccessToken();

  const refreshToken = user.SignRefreshToken();

  redis
    .set(user._id, JSON.stringify(user))
    .then(() => {
      // Optionally, get the data back to verify
      return redis.get(user._id);
    })
    .then((data) => {
      console.log("Retrieved data from Redis:", data);
    })
    .catch((err) => {
      console.error("Redis operation error:", err);
    });

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

module.exports = { sendToken, accessTokenOptions, refreshTokenOptions };
