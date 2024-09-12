const { CourseModel } = require("../models/course/course");
const catchAsyncError = require("../middleware/catchasyncerror");
const ErrorHandler = require("../utils/errorHandler");

// create course

const createCourse = catchAsyncError(async (data, res, next) => {
  console.log(data, "======data=====");

  const course = await CourseModel.create(data);
  res.status(201).json({
    success: true,
    course,
  });
});


module.exports = createCourse;
