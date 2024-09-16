const catchAsyncError = require("../../middleware/catchasyncerror");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../../utils/errorHandler");
const createCourse = require("../../service/course.service");
const { CourseModel } = require("../../models/course/course");
const mongoose = require("mongoose");
const sendMail = require("../../utils/sendMail");
const path = require("path")
const ejs= require("ejs")

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
    console.log(req.user_id, "=====user====");
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

    console.log(course, "======course======");

    const content = course?.courseSchema;
    console.log(content, "======content");

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

const addQuestions = catchAsyncError(async (req, res, next) => {
  try {
    const { question, courseId, contentId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("invalid content id", 400));
    }

    const courseContent = course?.courseSchema.find((item) => {
      return item._id.equals(contentId);
    });
    if (!courseContent) {
      return next(new ErrorHandler("invalid content id", 400));
    }
    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    };
    console.log(newQuestion, "=====newQuestion======");

    courseContent.questions.push(newQuestion);

    // Save the updated course document to the database
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
// add answers in the  course section
const addReplies = catchAsyncError(async (req, res, next) => {
  try {
    const { questionId, answer, courseId, contentId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("invalid content id", 400));
    }

    const courseContent = course?.courseSchema.find((item) => {
      return item._id.equals(contentId);
    });
    if (!courseContent) {
      return next(new ErrorHandler("invalid content id", 400));
    }

    // // console.log(newQuestion, "=====newQuestion======");
    const questions = courseContent.questions.find((item) => {
      return item._id.equals(questionId);
    });
    // courseContent.questions.push(newQuestion);
    if (!questions) {
      return next(new ErrorHandler("invalid question", 400));
    }
    const newAnswer = {
      user: req.user,
      answer,
    };
    questions.questionReplies.push(newAnswer);
    // Save the updated course document to the database
    await course.save();
    if (req.user?._id === questions.user._id) {
      //create a  notification
    } else {
      const data = {
        name: questions.user.name,
        // title: courseSchema.title,
      };
      const templatePath = path.join(
        __dirname,
        "../../emailTemplate/questionReply.ejs"
      );
      ejs.renderFile(templatePath, data, (err, str) => {
        if (err) {
          console.error("Error rendering EJS template:", err);
        } else {
          console.log("Rendered HTML:", str);
          // You can now use the `str` (the rendered HTML) as needed
        }
      });

      try {
        await sendMail({
          email: questions.user.email,
          subject: "question  reply",
          template: "questionReply.ejs",
          data,
        });
      } catch (error) {
        next(new ErrorHandler(error.message, 400));
      }
    }
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

module.exports = {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourse,
  getCourseByUSer,
  addQuestions,
  addReplies,
};
