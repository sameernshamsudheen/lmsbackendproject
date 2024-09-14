const express = require("express");
const courseRouter = express.Router();
const {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourse,
  getCourseByUSer,
} = require("../../controllers/Course/course.controller");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");

courseRouter.post("/create-course", isAuthenticated, uploadCourse);
courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);
courseRouter.get("/get-single-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-courses-content/:id", isAuthenticated, getCourseByUSer);

module.exports = courseRouter;
