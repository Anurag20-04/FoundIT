const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).any();
