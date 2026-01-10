const multer = require("multer");
const cloudinary = require("../config/cloudinary");
// This line is the magic fix:
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// If { CloudinaryStorage } is undefined, use the requirement directly
const ActualStorageClass = CloudinaryStorage || require("multer-storage-cloudinary");

const storage = new ActualStorageClass({
  cloudinary: cloudinary,
  params: {
    folder: "foundit/items", // or "foundit/profiles" for your other file
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;