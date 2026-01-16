const express = require("express");
const crypto = require("crypto");

const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const sendMail = require("../utils/mailer");

const router = express.Router();

/* =========================
   VERIFY EMAIL OTP
   (Creates real User)
========================= */
router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    /* =========================
       FIND PENDING USER
    ========================= */
    const pendingUser = await PendingUser.findOne({
      email: email.toLowerCase(),
      emailOTP: hashedOTP,
      emailOTPExpires: { $gt: Date.now() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    /* =========================
       CREATE REAL USER
    ========================= */
    await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isEmailVerified: true,
    });

    /* =========================
       DELETE PENDING USER
    ========================= */
    await PendingUser.deleteOne({ email });

    res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });

  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

/* =========================
   RESEND OTP
========================= */
router.post("/resend-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const pendingUser = await PendingUser.findOne({
      email: email.toLowerCase(),
    });

    if (!pendingUser) {
      return res.status(400).json({
        message: "No pending signup found or it expired. Please sign up again.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    pendingUser.emailOTP = hashedOTP;
    pendingUser.emailOTPExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await pendingUser.save();

    await sendMail({
      to: email,
      subject: "Your new FoundIT verification code",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>FoundIT Email Verification</h2>
          <p>Your new OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code is valid for <b>1 hour</b>.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "New OTP sent to your email",
    });

  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Could not resend OTP" });
  }
});

module.exports = router;
