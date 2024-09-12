const catchAsyncError = require("../../middleware/catchasyncerror");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../../utils/errorHandler");
const createCourse = require("../../service/course.service");
const { CourseModel } = require("../../models/course/course");

const uploadCourse = catchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }
    createCourse(data, res, next);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const editCourse = catchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }
    const courseId = req.params.id;
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      {
        $set: data,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const getSingleCourse = catchAsyncError(async (req, res, next) => {
  try {
    const course = await CourseModel.findById(req.params.id).select(
      "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
    );
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

module.exports = { uploadCourse, editCourse , getSingleCourse};
