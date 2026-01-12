const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const uploadProfileImage = require("../middleware/uploadProfileImage");
const { updateMyProfile } = require("../controller/userController");

router.put(
  "/me",
  authMiddleware,
  uploadProfileImage,   // ✅ handles multipart + profileImage
  updateMyProfile
);
router.get("/mail-test", async (req, res) => {
  const sendMail = require("../utils/mailer");

  await sendMail({
    to: "YOURPERSONALEMAIL@gmail.com",
    subject: "FoundIT mail test",
    html: "<h1>If you see this, Resend is working.</h1>",
  });

  res.send("Mail attempted");
});

module.exports = router;
