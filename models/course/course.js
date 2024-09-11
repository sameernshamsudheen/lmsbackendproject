const mongoose = require("mongoose");
const { Document, Model, Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
});

const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const commentSchema = new mongoose.Schema({
  user: object,
  comment: String,
  commentReplies: [object],
});

const courseDataSchema = new mongoose.Schema({
  videoUrl: object,
  videoThumbnail: object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      required: true,
      type: String,
    },
    url: { required: true, type: String },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [{ title: String }],
  prerequisite: [{ title: String }],
  reviews: [reviewSchema],
  courseSchema: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased:{

    type:Number,
    default:0,
  }
});

const reviewModal = mongoose.model("Review", reviewSchema);
const CourseDataModal = mongoose.model("CourseData", courseDataSchema);
const CommentModal = mongoose.model("comment", commentSchema);
const linkModal = mongoose.model("link", linkSchema);
const courseModal=mongoose.modelNames("course",courseSchema)

module.exports = {
  reviewModal,
  CourseDataModal,
  CommentModal,
  linkModal,
  courseModal
};
