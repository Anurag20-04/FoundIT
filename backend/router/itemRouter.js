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
router.post("/report", (req, res, next) => {
  upload.array("images", 5)(req, res, function (err) {
    if (err) {
      console.error("❌ Item upload error:", err);
      return res.status(400).json({
        success: false,
        error: err.message || "Item image upload failed",
      });
    }
    next();
  });
}, addItem);

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
