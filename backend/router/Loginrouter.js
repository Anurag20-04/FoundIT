const express = require("express");
const router = express.Router();

const Logincontroller = require("../controller/Logincontroller");

router.post("/login",Logincontroller.Login);

module.exports = router;
