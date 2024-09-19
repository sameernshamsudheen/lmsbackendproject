const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncError = require("../../middleware/catchasyncerror");
const notificationModal = require("../../models/notifications/notifications");
const cron = require("node-cron");

const getAllNotifications = catchAsyncError(async (req, res, next) => {
  try {
    const notifications = await notificationModal
      .find()
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateNotifications = catchAsyncError(async (req, res, next) => {
  try {
    const notification = await notificationModal.findById(req.params.id);

    if (!notification) {
      return next(new ErrorHandler(" notification  not found", 500));
    } else {
      notification.status
        ? (notification.status = "read")
        : notification.status;
    }
    await notification.save();
    const notifications = await notificationModal
      .find()
      .sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
cron.schedule("0 0 0 * * * ", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificationModal.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Delete read Notifications");
});
module.exports = { getAllNotifications, updateNotifications };
