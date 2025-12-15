const User = require("../models/User");
const bcrypt = require("bcrypt");

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
    if (
      !name || !email ||!phoneNumber || !address || !idProof || !aadharNumber || !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,email, phoneNumber,address,idProof,aadharNumber,profileImage: profileImage || null,password: hashedPassword
    });

    res.status(201).json({
      message: "Signup successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Newuser };
