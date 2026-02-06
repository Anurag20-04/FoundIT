const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    message: {
      type: String,
      trim: true,
      default: null,
    },

    page: {
      type: String,
      index: true,
    },

    /*
      Weight calculation:
      - stars only      → 1
      - text only       → 1.5
      - stars + text    → 2
      - logged-in user  → +0.5
    */
    weight: {
      type: Number,
      default: 1,
    },

    userAgent: String,
    ip: String,
  },
  {
    timestamps: true,
  }
);

/*
  Pre-save hook (callback style — DO NOT make async)
*/
feedbackSchema.pre("save", function (next) {
  let weight = 1;

  const hasRating = typeof this.rating === "number";
  const hasMessage =
    typeof this.message === "string" &&
    this.message.trim().length > 0;

  if (hasRating && hasMessage) {
    weight = 2;
  } else if (hasMessage && !hasRating) {
    weight = 1.5;
  }

  if (this.user) {
    weight += 0.5;
  }

  this.weight = weight;
  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);
