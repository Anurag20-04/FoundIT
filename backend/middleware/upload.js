const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const cloudinaryModule = require("multer-storage-cloudinary");
const CloudinaryStorage =
  cloudinaryModule.CloudinaryStorage || cloudinaryModule;

if (!CloudinaryStorage) {
  throw new Error("CloudinaryStorage not found in multer-storage-cloudinary");
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
