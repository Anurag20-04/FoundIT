const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    idProof: {
      type: String,
      required: true
    },

    aadharNumber: {
      type: String,
      required: true
    },

    profileImage: {
      type: String,
      default: null
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    // === Email Verification Fields ===
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifyToken: String,
    emailVerifyExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
