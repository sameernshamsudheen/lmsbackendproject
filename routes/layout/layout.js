const express = require("express");
const layoutRouter = express.Router();

const { isAuthenticated, validateUserRole } = require("../../middleware/auth");
const { Layout } = require("../../controllers/layout/layout");

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  validateUserRole("admin"),
  Layout
);

module.exports = layoutRouter;
