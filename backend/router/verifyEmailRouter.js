const express = require("express");
const router = express.Router();
const { verifyEmail } = require("../controller/verifyEmailController");

router.get("/verify-email", verifyEmail);

module.exports = router;
