const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =========================
       1️⃣ Validation
    ========================= */
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    /* =========================
       2️⃣ Find user (include password)
    ========================= */
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* =========================
       🔒 EMAIL VERIFICATION CHECK (NEW - CRITICAL)
    ========================= */
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED"
      });
    }

    /* =========================
       3️⃣ Compare password
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* =========================
       4️⃣ Create JWT
    ========================= */
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* =========================
       5️⃣ Remove password
    ========================= */
    user.password = undefined;

    /* =========================
       6️⃣ Response
    ========================= */
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { Login };
