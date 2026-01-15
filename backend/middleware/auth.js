const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    /* =========================
       READ AUTH HEADER
    ========================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    /* =========================
        VERIFY TOKEN
    ========================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       EXTRACT USER ID
    ========================= */
    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    /* =========================
       FETCH USER FROM DB
    ========================= */
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    /* =========================
       ATTACH USER
    ========================= */
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
