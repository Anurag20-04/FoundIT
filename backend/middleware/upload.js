const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary").default;

const cloudinary = require("../config/cloudinary");

// Cloudinary storage (replaces local disk)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit",                // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

// Only images allowed (same logic you had)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (same as before)
  }
});

module.exports = upload;
