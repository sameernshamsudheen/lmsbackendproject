const express = require("express");
const courseRouter = express.Router();
const {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourse,
  getCourseByUSer,
  addQuestions,
  addReplies,
  addReview,
  addReviewReply,
  getCourse,
} = require("../../controllers/Course/course.controller");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");

courseRouter.post("/create-course", isAuthenticated, uploadCourse);
courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);
courseRouter.get("/get-single-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-courses-content/:id", isAuthenticated, getCourseByUSer);
courseRouter.put("/add-question", isAuthenticated, addQuestions);
courseRouter.put("/add-question-answer", isAuthenticated, addReplies);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put(
  "/add-reply-review",
  isAuthenticated,
  validateUserRole("user"),
  addReviewReply
);
courseRouter.get(
  "/get-course-all",
  isAuthenticated,
  validateUserRole("user"),
  getCourse
);

module.exports = courseRouter;
