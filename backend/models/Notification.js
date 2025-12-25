const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lostitem",
    required: true
  },
  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Founditem",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
