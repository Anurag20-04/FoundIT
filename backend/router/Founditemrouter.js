const express = require("express");
const router = express();

const FounditemController = require("../controller/Founditemcontroller");
router.post("/",FounditemController.Additemfound);

module.exports =  router;