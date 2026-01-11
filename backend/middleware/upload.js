const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/items",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload; // ⚠️ DO NOT .single or .any here
