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
  upload.array("images", 5), // accepts up to 5 images
  addItem
);

/* =========================================================
   READ
========================================================= */

// Get all items
router.get("/", getAllItems);

// Get single item by ID
router.get("/:id", getItemById);

/* =========================================================
   UPDATE
========================================================= */

// Update item by ID (no image update here)
router.put("/:id", updateItem);

/* =========================================================
   DELETE
========================================================= */

// Delete item by ID
router.delete("/:id", deleteItem);

module.exports = router;
