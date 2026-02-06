const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const {
  createFeedback,
  getAllFeedback,
} = require("../controller/feedbackController");

/*
   SOFT AUTH MIDDLEWARE
   - Attach user if token is valid
   - Ignore invalid/missing token
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    await authMiddleware(req, res, next);
  } catch {
    return next();
  }
};

/*
   SUBMIT FEEDBACK
   - Anonymous allowed
   - Logged-in users linked
 */
router.post("/", optionalAuth, createFeedback);

/*
   GET ALL FEEDBACK
   - Protected (admin/internal)
 */
router.get("/", authMiddleware, getAllFeedback);

module.exports = router;
