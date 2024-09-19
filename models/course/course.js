const mongoose = require("mongoose");

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: Object,
  rating: { type: Number, default: 0 },
  comment: String,
  commentReplies: [Object],
});

// Link Schema
const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  user: Object,
  question: String,
  questionReplies: [Object], // Keeping comment replies as an array of objects
});

// Course Data Schema
const courseDataSchema = new mongoose.Schema({
  videoUrl: Object,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema], // Linking questions to commentSchema
});

// Main Course Schema
const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: { type: Number },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    tags: { type: String, required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: String }],
    prerequisite: [{ title: String }],
    reviews: [reviewSchema], // Array of reviews
    courseSchema: [courseDataSchema], // Array of course data
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Creating and exporting models
const ReviewModel = mongoose.model("Review", reviewSchema);
const CourseDataModel = mongoose.model("CourseData", courseDataSchema);
const CommentModel = mongoose.model("Comment", commentSchema);
const LinkModel = mongoose.model("Link", linkSchema);
const CourseModel = mongoose.model("Course", courseSchema);

module.exports = {
  ReviewModel,
  CourseDataModel,
  CommentModel,
  LinkModel,
  CourseModel,
};
