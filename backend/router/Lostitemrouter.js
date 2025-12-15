const express = require("express");
const router = express.Router();

const { Addlostitem,GetLostItem,GetLostItemById,UpdateLostitem,DeleteLostitem} = require("../controller/Lostitemcontroller");

//Create
router.post("/add", Addlostitem); 

//Read
router.get("/getall",GetLostItem);

//Read ById
router.get("/get/:id",GetLostItemById);

//UPDATE
router.put("/update/:id",UpdateLostitem);

// DELETE 
router.delete("/delete/:id",DeleteLostitem);

module.exports = router;
