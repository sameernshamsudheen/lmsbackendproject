const express = require("express");

const userRoutes = express.Router();

const {
  UserRegistration,
  userActivation,
} = require("../../controllers/userRegistraion/userRegistration");

userRoutes.post("/registration", UserRegistration);

userRoutes.post("/user-activation", userActivation);

module.exports = userRoutes;
