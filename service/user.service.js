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

const getAllUsersService = async (res) => {
  const user = await userModal.find().sort({ createdAt: -1 });
  // const user = await redis.get(id);

  res.status(201).json({
    success: true,
    user,
  });
};

module.exports = { getUserById, getAllUsersService };
