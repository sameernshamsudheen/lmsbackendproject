const mongoose = require("mongoose");
const { Document, Model, Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      validate: {
        validator: function (email) {
          return emailRegex.test(email);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,

      minlength: [6, "minimum 6 characters needed"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [{ courseId: String }],
  },
  { timestamps: true }
);

//used to hash password  before saving the  password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "",{expiresIn:"5m"});
};
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "",{expiresIn:"3d"});
};
//used to compare hash password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
