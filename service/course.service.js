const { CourseModel } = require("../models/course/course");
const catchAsyncError = require("../middleware/catchasyncerror");
const ErrorHandler = require("../utils/errorHandler");

// create course

const createCourse = catchAsyncError(async (data, res, next) => {


  const course = await CourseModel.create(data);
  res.status(201).json({
    success: true,
    course,
  });
});
const getCourseService = async (res) => {
  const course = await CourseModel.find().sort({ createdAt: -1 });
  // const user = await redis.get(id);

  res.status(201).json({
    success: true,
    course,
  });
};

module.exports = { createCourse, getCourseService };
