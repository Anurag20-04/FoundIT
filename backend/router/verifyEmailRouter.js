const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

/* =========================
   EMAIL VERIFICATION ROUTE
========================= */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid verification link");
    }

    // hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Verification link is invalid or expired");
    }

    // verify user
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    // redirect to frontend
    return res.redirect(`${process.env.FRONTEND_URL}/login`);

  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    res.status(500).send("Email verification failed");
  }
});

module.exports = router;
