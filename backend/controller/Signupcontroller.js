const User = require("../models/User");

const Newuser = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      address,
      idProof,
      aadharNumber,
      profileImage,
      password
    } = req.body;

    // 1. Check all required fields
    if (!name || !email || !phoneNumber || !address || !idProof || !aadharNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Validate email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ NOTE: Manual bcrypt hashing removed from here. 
    // The hashing now happens automatically in User.js inside the .pre('save') hook.

    // 4. Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      address,
      idProof,
      aadharNumber,
      profileImage: profileImage || null,
      password, // Pass plain text; the model hashes it for you
      isEmailVerified: true 
    });

    // 5. Send Response
    res.status(201).json({
      message: "Signup successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Newuser };