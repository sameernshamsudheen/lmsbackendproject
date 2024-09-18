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


module.exports = newOrder;
