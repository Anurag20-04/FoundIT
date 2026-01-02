const User = require("../models/User");
const crypto = require("crypto");

const Newuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* =========================
       1️⃣ REQUIRED FIELDS
    ========================= */
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    /* =========================
       2️⃣ EMAIL FORMAT
    ========================= */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    /* =========================
       3️⃣ PASSWORD STRENGTH
    ========================= */
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    /* =========================
       4️⃣ DUPLICATE USER CHECK
    ========================= */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    /* =========================
       5️⃣ EMAIL VERIFY TOKEN
    ========================= */
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    /* =========================
       6️⃣ CREATE USER
    ========================= */
    await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    /* =========================
       7️⃣ VERIFICATION LINK
       (ENV-BASED — WORKS LOCAL & PROD)
    ========================= */
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerifyToken}`;
    console.log("📧 EMAIL VERIFY LINK:", verifyUrl);

    /* =========================
       8️⃣ RESPONSE
    ========================= */
    res.status(201).json({
      message:
        "Signup successful. Please verify your email before logging in.",
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Newuser };
