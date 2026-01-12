const User = require("../models/User");
const crypto = require("crypto");
const sendMail = require("../utils/mailer");

const Newuser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    /* =========================
       EMAIL VERIFY TOKEN (SECURE)
    ========================= */
    const rawToken = crypto.randomBytes(32).toString("hex");

    const emailVerifyToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    /* =========================
       SEND EMAIL (NON-BLOCKING)
    ========================= */
    sendMail({
      to: email,
      subject: "Verify your FoundIT account",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Welcome to FoundIT</h2>
          <p>Click below to verify your email:</p>
          <a href="${verifyUrl}"
             style="display:inline-block;padding:12px 18px;
                    background:#2563eb;color:white;
                    text-decoration:none;border-radius:6px">
             Verify Email
          </a>
          <p style="font-size:12px;color:#666;margin-top:10px">
            Link valid for 24 hours.
          </p>
        </div>
      `,
    }).catch(err => {
      console.error("❌ Email send failed:", err.message);
    });

    /* =========================
       RESPONSE (ALWAYS FIRES)
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
