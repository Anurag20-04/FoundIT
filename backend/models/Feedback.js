const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware
 * IMPORTANT:
 * - async function
 * - NO next()
 */
feedbackSchema.pre("save", async function () {
  // Example safety logic (optional)
  if (this.message) {
    this.message = this.message.trim();
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
