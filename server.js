const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./database/connectDB");
const errorMiddleware = require("./middleware/error");
const userRoutes = require("./routes/userRoutes/userRoutes");
const courseRoutes = require("./routes/course/course.routes");
const cloudinary = require("cloudinary");
const orderRoutes = require("./routes/order/order");
const notificationRoutes = require("./routes/notifications/notifications");
const cron = require("node-cron");
const analyticsRouter = require("./routes/analytics/analytics");
const layoutRouter = require("./routes/layout/layout");

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
  connectDb();
});
cloudinary.config({
  CLOUD_NAME: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  secret_key: process.env.CLOUD_SECRET_KEY,
});
//
app.use(express.json({ limit: "50mb" }));

//cookie-parser
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN }));

app.use(
  "/api/v1",
  userRoutes,
  orderRoutes,
  courseRoutes,
  notificationRoutes,
  analyticsRouter,
  layoutRouter
);

app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is Working",
  });
});

app.get("/check-cookies", (req, res) => {
 // This logs the cookies sent by the client
  res.json({ cookies: req.cookies });
});
app.all("*", (req, res, next) => {
  const err = new Error(`Route${req.originalUrl} not found`);

  err.statusCode = 404;
  next(err);
});

app.use(errorMiddleware);
