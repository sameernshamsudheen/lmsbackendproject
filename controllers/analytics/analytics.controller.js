const catchAsyncError = require("../../middleware/catchasyncerror");
const { generateLast12MonthsData } = require("../../utils/analytics.generator");

const ErrorHandler = require("../../utils/errorHandler");
const UserModal = require("../../models/user/userModel");
const { CourseModel } = require("../../models/course/course");
const notificationModal = require("../../models/notifications/notifications");
const OrderModal = require("../../models/order/order");
// user analytics

const getUserAnalytics = catchAsyncError(async (req, res, next) => {
  try {
    const users = await generateLast12MonthsData(UserModal);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getCourseAnalytics = catchAsyncError(async (req, res, next) => {
  try {
    const course = await generateLast12MonthsData(CourseModel);
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const getNotificationAnalytics = catchAsyncError(async (req, res, next) => {
  try {
    const notifications = await generateLast12MonthsData(notificationModal);
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const getOrderAnalytics = catchAsyncError(async (req, res, next) => {
  try {
    const order = await generateLast12MonthsData(OrderModal);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  getUserAnalytics,
  getCourseAnalytics,
  getNotificationAnalytics,
  getOrderAnalytics
};
