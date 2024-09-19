const catchAsyncError = require("../middleware/catchasyncerror");
const ErrorHandler = require("../utils/errorHandler");
const OrderModal = require("../models/order/order");

const newOrder = catchAsyncError(async (data, res, next) => {
  try {
    // Create the order in the database
    const order = await OrderModal.create(data);

    // Send the response back to the client once the order is created
    return res.status(201).json({
      success: true,
      order: data, // Return the actual created order
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getOrderService = async (res) => {
  const order = await OrderModal.find().sort({ createdAt: -1 });
  // const user = await redis.get(id);

  res.status(201).json({
    success: true,
    order,
  });
};

module.exports = { newOrder, getOrderService };
