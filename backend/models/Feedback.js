const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // anonymous allowed
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null, // ❗ NEVER auto-5
    },

    message: {
      type: String,
      trim: true,
      default: null, // rating-only feedback allowed
    },

    page: {
      type: String, // e.g. "/profile", "/report"
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    ip: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
