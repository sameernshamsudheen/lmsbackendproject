const express = require("express");
const {
  getUserAnalytics,
  getCourseAnalytics,
  getNotificationAnalytics,
  getOrderAnalytics,
} = require("../../controllers/analytics/analytics.controller");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");
const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-user-analytics",
  isAuthenticated,
  validateUserRole("admin"),
  getUserAnalytics
);

analyticsRouter.get(
  "/get-course-analytics",
  isAuthenticated,
  validateUserRole("admin"),
  getCourseAnalytics
);

analyticsRouter.get(
  "/get-notification-analytics",
  isAuthenticated,
  validateUserRole("admin"),
  getNotificationAnalytics
);
analyticsRouter.get(
  "/get-order-analytics",
  isAuthenticated,
  validateUserRole("admin"),
  getOrderAnalytics
);
module.exports = analyticsRouter;
