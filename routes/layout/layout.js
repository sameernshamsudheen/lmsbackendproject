const express = require("express");
const layoutRouter = express.Router();

const { isAuthenticated, validateUserRole } = require("../../middleware/auth");
const {
  Layout,
  editLayout,
  getLayoutType,
} = require("../../controllers/layout/layout.controller");

layoutRouter.post(
  "/create-layout",
  isAuthenticated,
  validateUserRole("admin"),
  Layout
);

layoutRouter.put(
  "/update-layout",
  isAuthenticated,
  validateUserRole("admin"),
  editLayout
);
layoutRouter.get(
  "/get-layout",
  isAuthenticated,

  getLayoutType
);
module.exports = layoutRouter;
