const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    // Optional user (anonymous feedback allowed)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Optional message
    message: {
      type: String,
      trim: true,
      minlength: 3,
      default: null,
    },

    // Optional rating
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Optional page/source
    page: {
      type: String,
      default: null,
    },

    // Metadata
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

/**
 * SCHEMA-LEVEL GUARANTEE
 * At least one of message or rating must exist
 */
feedbackSchema.pre("validate", function () {
  if (!this.message && this.rating === null) {
    this.invalidate(
      "message",
      "Either message or rating must be provided"
    );
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
