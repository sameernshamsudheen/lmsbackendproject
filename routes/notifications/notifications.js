const express = require("express");

const {
  getAllNotifications,
  updateNotifications,
} = require("../../controllers/notification/notification.controller");
const { isAuthenticated } = require("../../middleware/auth");

const notificationRoutes = express.Router();

notificationRoutes.get(
  "/get-all-notifications",
  isAuthenticated,
  getAllNotifications
);
notificationRoutes.put(
  "/update-notifications/:id",
  isAuthenticated,
  updateNotifications
);

module.exports = notificationRoutes;
