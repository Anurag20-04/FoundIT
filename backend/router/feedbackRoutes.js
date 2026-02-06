const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const {
  createFeedback,
  getAllFeedback,
} = require("../controller/feedbackController");

/* 
   SOFT AUTH MIDDLEWARE
   (Attach user if token exists, else continue)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authMiddleware(req, res, next);
  }

  next();
};

/*
   SUBMIT FEEDBACK
   - Anonymous allowed
   - Logged-in users linked
 */
router.post("/", optionalAuth, createFeedback);

/* 
   GET ALL FEEDBACK
   - Protected (admin/internal use)
 */
router.get("/", authMiddleware, getAllFeedback);

module.exports = router;
