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
const getAllCourse = catchAsyncError(async (req, res, next) => {
  try {
    const course = await CourseModel.find().select(
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
const getCourseByUSer = catchAsyncError(async (req, res, next) => {
  try {
    console.log(req.user_id,"=====user====")
    const userCourseList = req.user?.courses;

      
    const courseId = req.params.id;

    

    const courseExists = await userCourseList.find((course) => {
      return course._id.toString() === courseId;
    });

    if (!courseExists) {
      next(
        new ErrorHandler("Your are not eligible to access this course", 400)
      );
    }
    const course = await CourseModel.findById(courseId);

         console.log(course,"======course======");
         
    const content = course?.courseSchema;
      console.log(content,"======content");
      
    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

module.exports = { uploadCourse, editCourse, getSingleCourse, getAllCourse,getCourseByUSer };
