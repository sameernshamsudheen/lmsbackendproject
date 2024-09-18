const catchAsyncError = require("../../middleware/catchasyncerror");
const { CourseModel } = require("../../models/course/course");
const UserModal = require("../../models/user/userModel");
const sendMail = require("../../utils/sendMail");
const ErrorHandler = require("../../utils/errorHandler");
const path = require("path");
const ejs = require("ejs");
const notificationModal = require("../../models/notifications/notifications");
const newOrder = require("../../service/order.service");

const createOrder = catchAsyncError(async (req, res, next) => {
  try {
    const { courseId, payment_info } = req.body;
    const user = await UserModal.findById(req.user?._id);
    const courseExistsInUser = user?.courses.some((item) => {
      return item._id.toString() === courseId;
    });

    if (courseExistsInUser) {
      return next(
        new ErrorHandler("You have already purchased this course", 400)
      );
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 400));
    }

    const data = {
      courseId: course._id,
      userId: user?._id,
      payment_info,
    };

    const maildata = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const templatePath = path.join(
      __dirname,
      "../../emailTemplate/createOrderTemplate.ejs"
    );
    ejs.renderFile(templatePath, { order: maildata }, async (err, str) => {
      if (err) {
        console.error("Error rendering EJS template:", err);
      } else {
        // Send the email with the rendered HTML
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "createOrderTemplate.ejs",
            data: maildata,
          }).catch((error) => next(new ErrorHandler(error.message, 400)));
        }
      }
    });

    // Add course to user's purchased courses
    user?.courses.push(course?._id);
    await user?.save();

    // Create a notification
    await notificationModal.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order for the course: ${course?.name}`,
    });

    console.log(course, "===purchased====");
    
    course.purchased = course.purchased != null ? course.purchased + 1 : 0;

    // Save the updated course to the database
    await course.save();
    // Create the order using the newOrder service
    newOrder(data, res, next); // Pass the res and next so that newOrder handles the response
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
module.exports = createOrder;
