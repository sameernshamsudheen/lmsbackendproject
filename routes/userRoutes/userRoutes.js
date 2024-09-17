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
} = require("../../controllers/userRegistraion/userRegistration");
const Login = require("../../controllers/login/login");
const Logout = require("../../controllers/logout/logout");

userRoutes.post("/registration", UserRegistration);

userRoutes.post("/user-activation", userActivation);
userRoutes.post("/login-user", Login);
userRoutes.get(
  "/logout-user",
  isAuthenticated,
  validateUserRole("user"),
  Logout
);
userRoutes.get("/refreshtoken", updateAccessToken);
userRoutes.post("/social-auth", socialAuth);
userRoutes.get("/me", getuserInfo);
userRoutes.put("/update-user", isAuthenticated, updateUserInfo);
userRoutes.put("/update-user-password", isAuthenticated, passwordUpdate);
userRoutes.put("/update-user-avatar", isAuthenticated, updateProfilePicture);


module.exports = userRoutes;
