const express = require("express");
const courseRouter = express.Router();
const {
  uploadCourse,
  editCourse,
  getSingleCourse,
} = require("../../controllers/Course/course.controller");
const { isAuthenticated, validateUserRole } = require("../../middleware/auth");

courseRouter.post("/create-course", isAuthenticated, uploadCourse);
courseRouter.put("/edit-course/:id", isAuthenticated, editCourse);
courseRouter.get("/get-single-course/:id", getSingleCourse);

module.exports = courseRouter;
