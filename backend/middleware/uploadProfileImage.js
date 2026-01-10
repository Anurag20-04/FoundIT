const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const cloudinaryModule = require("multer-storage-cloudinary");
const CloudinaryStorage =
  cloudinaryModule.CloudinaryStorage || cloudinaryModule;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload.any(); // ✅ accepts any file field
