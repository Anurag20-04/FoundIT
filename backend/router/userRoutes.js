const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const uploadProfileImage = require("../middleware/uploadProfileImage");
const { updateMyProfile } = require("../controller/userController");

router.put(
  "/me",
  authMiddleware,
  uploadProfileImage,
  updateMyProfile
);

module.exports = router;
