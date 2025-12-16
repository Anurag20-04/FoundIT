const express = require("express");
const router = express.Router();

const UserController = require("../controller/Signupcontroller");

router.post("/signup",UserController.Newuser);

module.exports = router;
