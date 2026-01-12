const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const uploadProfileImage = require("../middleware/uploadProfileImage");

const {
  updateMyProfile,
  getMyReportedItems,
  deleteMyReportedItem
} = require("../controller/userController");

/* =========================
   UPDATE PROFILE
   PUT /api/users/me
========================= */
router.put(
  "/me",
  authMiddleware,
  uploadProfileImage,
  updateMyProfile
);

/* =========================
   MY REPORTED ITEMS
   GET /api/users/me/items
========================= */
router.get(
  "/me/items",
  authMiddleware,
  getMyReportedItems
);

/* =========================
   DELETE MY ITEM
   DELETE /api/users/me/items/:id
========================= */
router.delete(
  "/me/items/:id",
  authMiddleware,
  deleteMyReportedItem
);

module.exports = router;
