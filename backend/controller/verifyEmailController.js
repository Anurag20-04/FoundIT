const User = require("../models/User");
const crypto = require("crypto");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token missing" });
    }

    /* =========================
       HASH TOKEN (SECURITY)
    ========================= */
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    /* =========================
       FIND VALID USER
    ========================= */
    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or expired",
      });
    }

    /* =========================
        MARK VERIFIED
    ========================= */
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyEmail };
