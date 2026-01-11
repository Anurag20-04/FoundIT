const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Safe loader for all multer-storage-cloudinary export types
const cloudinaryModule = require("multer-storage-cloudinary");
const CloudinaryStorage =
  cloudinaryModule.CloudinaryStorage ||
  cloudinaryModule.default ||
  cloudinaryModule;

if (!CloudinaryStorage) {
  throw new Error("❌ CloudinaryStorage not found in multer-storage-cloudinary");
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/items",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
