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

const updateUsersRoleService = async (res, id, role) => {
  console.log(role,"===role====");
  
  try {
    const user = await userModal.findByIdAndUpdate(
      id,
      { $set: { role } }, // Explicitly setting the role field
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating role", error });
  }
};

module.exports = { getUserById, getAllUsersService, updateUsersRoleService };
