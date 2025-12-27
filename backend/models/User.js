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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    idProof: {
      type: String,
      required: [true, "ID Proof type is required"],
    },
    aadharNumber: {
      type: String,
      required: [true, "Aadhar number is required"],
      unique: true, // Aadhar should typically be unique
    },
    profileImage: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // Security: Prevents password from being returned in GET requests
    },
    // === Email Verification Fields ===
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: String,
    emailVerifyExpires: Date,
  },
  { 
    timestamps: true,
    // Industry Tip: Ensure virtuals are included if you convert to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* =========================================================
    🔐 PASSWORD HASHING MIDDLEWARE
========================================================= */
/**
 * Using 'save' middleware to hash password. 
 * Note: We avoid 'next' in async functions to prevent "next is not a function" errors 
 * in newer Mongoose versions.
 */
userSchema.pre("save", async function () {
  // Only run this function if the password was actually modified (or is new)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error(err); // This will stop the save process and pass error to the controller
  }
});

/* =========================================================
    🛠️ HELPER METHODS (Instance Methods)
========================================================= */
/**
 * Industry Standard: Add a method to the user object to compare passwords.
 * This keeps your LoginController even cleaner.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);