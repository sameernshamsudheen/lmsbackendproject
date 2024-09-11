const ErrorHandler = require("../utils/errorHandler");
const userModal = require("../models/user/userModel");
const { redis } = require("../redis/redisConnection");

const getUserById = async (id, res, next) => {
  try {
    const user = await redis.get(id);
    if (user) {
      const user = JSON.parse(userJson);
      res.status(201).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

module.exports = getUserById;
