const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");


const cloudinary = require("../config/cloudinary");

/* =========================
   CLOUDINARY STORAGE
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId =
      req.user && req.user._id ? req.user._id.toString() : "temp";

    return {
      folder: "foundit/profile-images",
      public_id: `${userId}-${Date.now()}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"]
    };
  }
});

/* =========================
   ONLY IMAGES
========================= */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB (same as your old file)
  }
});

/* =========================
   EXPORT SINGLE UPLOAD
========================= */
module.exports = upload.single("profileImage");
