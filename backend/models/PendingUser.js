const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true, // already hashed before saving
    },

    emailOTP: {
      type: String, // hashed OTP
      required: true,
      index: true,
    },

    emailOTPExpires: {
      type: Date,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60, // ✅ AUTO DELETE after 1 hour
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingUser", pendingUserSchema);
