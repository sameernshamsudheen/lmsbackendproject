const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
//
app.use(express.json({ limit: "50mb" }));

//cookie-parser
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

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
