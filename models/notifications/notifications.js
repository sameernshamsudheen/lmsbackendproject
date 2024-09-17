const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    message: { type: String, required: true },
    status: { type: String,required:true,default:"unread" },
    userId: { type: String },
  },
  { timestamps: true }
);

const notificationModal = mongoose.model("Notifications",notificationSchema);

module.exports = notificationModal;
