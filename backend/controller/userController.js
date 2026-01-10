const User = require("../models/User");

exports.updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    /* =========================
       NORMALIZE TEXT FIELDS
    ========================= */
    if ("name" in req.body) {
      updates.name = req.body.name.trim() || null;
    }

    if ("phoneNumber" in req.body) {
      updates.phoneNumber =
        req.body.phoneNumber === "" ? null : req.body.phoneNumber;
    }

    if ("address" in req.body) {
      updates.address = req.body.address.trim() || null;
    }

    /* =========================
       PROFILE IMAGE
    ========================= */
    if (req.files && req.files.length > 0) {
  updates.profileImage = req.files[0].path;
}

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
        context: "query", // 🔑 REQUIRED for validators
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};
