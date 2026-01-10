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
    folder: "foundit/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadProfileImage.single("image");
