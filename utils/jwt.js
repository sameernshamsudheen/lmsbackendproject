const { redis } = require("../redis/redisConnection");
require("dotenv").config();
// const client = redis.createClient();
const cookie = require("cookie-parser");

const sendToken = async (user, statusCode, res) => {
  console.log("function called", res);

  const accessToken = user.SignAccessToken();

  const refreshToken = user.SignRefreshToken();

  console.log(accessToken, refreshToken, "tokens");
  redis
    .set(user._id, JSON.stringify(user))
    .then(() => {
      console.log("User data stored in Redis");
      // Optionally, get the data back to verify
      return redis.get(user._id);
    })
    .then((data) => {
      console.log("Retrieved data from Redis:", data);
    })
    .catch((err) => {
      console.error("Redis operation error:", err);
    });

  const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "300",
    10
  );
  const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "1200",
    10
  );

  const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }
  console.log("before the cookie");

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

module.exports = sendToken;
