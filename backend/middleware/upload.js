const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/items",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
