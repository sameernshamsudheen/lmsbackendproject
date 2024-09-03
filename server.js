const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./database/connectDB");
const errorMiddleware = require("./middleware/error");
const userRoutes = require("./routes/userRoutes/userRoutes");

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
  connectDb();
});
//
app.use(express.json({ limit: "50mb" }));

//cookie-parser
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN }));

app.use("/api/v1",userRoutes )


app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is Working",
  });
});
app.all("*", (req, res, next) => {
  const err = new Error(`Route${req.originalUrl} not found`);

  err.statusCode = 404;
  next(err);
});

// app.use(errorMiddleware);
