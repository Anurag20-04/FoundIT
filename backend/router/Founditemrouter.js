const express = require("express");
const router = express.Router();

const {Additemfound,
    GetAllFoundItems,
    GetItemsById,
    UpdateFoundItem,
    DeleteFounditem
} = require("../controller/Founditemcontroller");

//Create
router.post("/add",Additemfound);

//Read
router.get("/getall",GetAllFoundItems);
router.get("/get/:id",GetItemsById);

//Update
router.put("/update/:id",UpdateFoundItem)

//delete
router.delete("/delete/:id",DeleteFounditem);
module.exports =  router;