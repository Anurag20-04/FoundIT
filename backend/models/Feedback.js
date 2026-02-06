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

    /**
     * 🔑 SIGNAL WEIGHT
     * stars only      = 1
     * stars + text    = 2
     * text only       = 1.5
     * logged-in bonus = +0.5
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

/* =========================
   AUTO WEIGHT CALCULATION
========================= */
feedbackSchema.pre("save", function (next) {
  let weight = 1;

  if (this.rating && this.message) weight = 2;
  else if (this.message && !this.rating) weight = 1.5;

  if (this.user) weight += 0.5;

  this.weight = weight;
  next();
});

module.exports = mongoose.model("Feedback", feedbackSchema);
