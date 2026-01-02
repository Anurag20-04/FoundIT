const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    /* =========================
       1️⃣ READ AUTH HEADER
    ========================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    /* =========================
       2️⃣ VERIFY TOKEN
    ========================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       3️⃣ EXTRACT USER ID
       (SUPPORT ALL PAYLOAD TYPES)
    ========================= */
    const userId =
      decoded.id ||          // preferred
      decoded.userId ||      // common alternative
      decoded._id;           // fallback

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Invalid token payload" });
    }

    /* =========================
       4️⃣ FETCH USER FROM DB
    ========================= */
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    /* =========================
       5️⃣ ATTACH USER
    ========================= */
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
