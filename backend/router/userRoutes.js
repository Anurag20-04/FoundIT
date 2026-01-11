const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const uploadProfileImage = require("../middleware/uploadProfileImage");
const { updateMyProfile } = require("../controller/userController");

router.put("/me", authMiddleware, (req, res, next) => {
  uploadProfileImage(req, res, function () {
    next();
  });
}, updateMyProfile);

module.exports = router;
