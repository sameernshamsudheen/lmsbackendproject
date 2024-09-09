const express = require("express");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");

const userRoutes = express.Router();
const {
  UserRegistration,
  userActivation,
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

module.exports = userRoutes;
