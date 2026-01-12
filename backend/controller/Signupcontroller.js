const User = require("../models/User");
const crypto = require("crypto");
const sendMail = require("../utils/mailer");

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
       5️⃣ EMAIL VERIFY TOKEN (SECURE)
    ========================= */
    const rawToken = crypto.randomBytes(32).toString("hex");

    const emailVerifyToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    /* =========================
       6️⃣ CREATE USER
    ========================= */
    await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    /* =========================
       7️⃣ VERIFICATION LINK
    ========================= */
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    /* =========================
       8️⃣ SEND EMAIL
    ========================= */
    await sendMail({
      to: email,
      subject: "Verify your FoundIT account",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px">
          <h2>Welcome to FoundIT</h2>
          <p>Please verify your email to activate your account.</p>
          <a href="${verifyUrl}" 
             style="display:inline-block;padding:12px 22px;background:#2563eb;color:white;
                    border-radius:6px;text-decoration:none;font-weight:600">
             Verify Email
          </a>
          <p style="margin-top:16px;font-size:12px;color:#666">
            This link expires in 24 hours. If you did not sign up, ignore this email.
          </p>
        </div>
      `,
    });

    /* =========================
       9️⃣ RESPONSE
    ========================= */
    res.status(201).json({
      message: "Signup successful. Please verify your email before logging in.",
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { Newuser };
