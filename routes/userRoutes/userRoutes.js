const express = require("express");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");

const userRoutes = express.Router();
const {
  UserRegistration,
  userActivation,
  updateAccessToken,
  socialAuth,
  getuserInfo,

  updateUserInfo,
  passwordUpdate,
  updateProfilePicture,
  getAllUsers,
  updateUserRoles,
  deleteUser,
} = require("../../controllers/userRegistraion/userRegistration");
const Login = require("../../controllers/login/login");
const Logout = require("../../controllers/logout/logout");

userRoutes.post("/registration", UserRegistration);

userRoutes.post("/user-activation", userActivation);
userRoutes.post("/login-user", Login);
userRoutes.get(
  "/logout-user",
  isAuthenticated,
  validateUserRole("admin"),
  Logout
);
userRoutes.get("/refreshtoken", updateAccessToken);
userRoutes.post("/social-auth", socialAuth);
userRoutes.get("/me", getuserInfo);
userRoutes.put("/update-user", isAuthenticated, updateUserInfo);
userRoutes.put("/update-user-password", isAuthenticated, passwordUpdate);
userRoutes.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRoutes.get(
  "/get-all-user",
  isAuthenticated,
  validateUserRole("user"),
  getAllUsers
);
userRoutes.post(
  "/update-user-roles",
  isAuthenticated,
  validateUserRole("admin"),
  updateUserRoles
);
userRoutes.delete(
  "/delete-user/:id",
  isAuthenticated,
  validateUserRole("admin"),
  deleteUser
);
userRoutes.delete(
  "/delete-user/:id",
  isAuthenticated,
  validateUserRole("admin"),
  deleteUser
);

module.exports = userRoutes;
