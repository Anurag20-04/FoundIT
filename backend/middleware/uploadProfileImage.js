const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Safe loader for all multer-storage-cloudinary export styles
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
    folder: "foundit/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = (req, res, next) => {
  const handler = upload.any();

  handler(req, res, (err) => {
    if (err) {
      console.error("❌ Profile upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Profile image upload failed",
      });
    }
    next();
  });
};
