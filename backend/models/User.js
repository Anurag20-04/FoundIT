const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    /* =========================
       PHONE (OPTIONAL INITIALLY)
    ========================= */
    phoneNumber: {
      type: String,
      trim: true,
      sparse: true,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please provide a valid Indian mobile number",
      },
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    /* =========================
       ADDRESS & ID (KYC LATER)
    ========================= */
    address: {
      type: String,
      default: null,
    },

    idProof: {
      type: String,
      default: null,
    },

    aadharNumber: {
      type: String,
      sparse: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    /* =========================
       EMAIL VERIFICATION (FINAL)
    ========================= */
    isEmailVerified: {
      type: Boolean,
      default: true, // always true because only verified users are created
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   PASSWORD HASHING
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   PASSWORD COMPARE
========================= */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
