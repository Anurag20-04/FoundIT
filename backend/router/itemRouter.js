const express = require("express");
const router = express.Router();

// Multer middleware
const upload = require("../middleware/upload");

// Item controller functions
const {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controller/itemController");

/* =========================================================
   CREATE ITEM (Lost / Found) — WITH IMAGES
   Expects FormData with key: "images"
========================================================= */
router.post(
  "/report",
  upload.array("images", 5),  
  addItem
);

/* =========================================================
   READ
========================================================= */
router.get("/", getAllItems);
router.get("/:id", getItemById);

/* =========================================================
   UPDATE
========================================================= */
router.put("/:id", updateItem);

/* =========================================================
   DELETE
========================================================= */
router.delete("/:id", deleteItem);

module.exports = router;
