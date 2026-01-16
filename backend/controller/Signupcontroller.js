const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer");

/* =========================
   OTP GENERATOR
========================= */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Newuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    /* =========================
       CHECK REAL USERS
    ========================= */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    /* =========================
       REMOVE OLD PENDING USER
    ========================= */
    await PendingUser.deleteOne({ email });

    /* =========================
       GENERATE OTP
    ========================= */
    const otp = generateOTP();

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================
       CREATE PENDING USER (1 HR)
    ========================= */
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      emailOTP: hashedOTP,
      emailOTPExpires: Date.now() + 60 * 60 * 1000, // ✅ 1 hour
    });

    /* =========================
       SEND OTP EMAIL
    ========================= */
    sendMail({
      to: email,
      subject: "Your FoundIT verification code",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Welcome to FoundIT</h2>
          <p>Your email verification code is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code is valid for <b>1 hour</b>.</p>
          <p style="font-size:12px;color:#666">
            If you did not sign up, please ignore this email.
          </p>
        </div>
      `,
    }).catch(err => {
      console.error("❌ Email send failed:", err.message);
    });

    /* =========================
       RESPONSE
    ========================= */
    res.status(201).json({
      message: "OTP sent to your email.",
      email,
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Newuser };
