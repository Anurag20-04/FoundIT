const User = require("../models/User");
const Item = require("../models/Item"); // 🔥 REQUIRED for reported items

/* ======================================================
   UPDATE MY PROFILE
   PUT /api/users/me
====================================================== */
exports.updateMyProfile = async (req, res) => {
  try {
    /* =========================
       1️⃣ AUTH CHECK
    ========================= */
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    /* =========================
       2️⃣ FETCH USER
    ========================= */
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    /* =========================
       3️⃣ SAFE FIELD UPDATES
       (PARTIAL UPDATE SYSTEM)
    ========================= */
    if (req.body.name !== undefined) {
      user.name = req.body.name.trim();
    }

    if (req.body.address !== undefined) {
      user.address = req.body.address.trim();
    }

    if (req.body.phoneNumber !== undefined) {
      const phone = req.body.phoneNumber.trim();

      if (phone === "") {
        user.phoneNumber = null;
        user.isPhoneVerified = false;
      } else {
        // ✅ strict Indian mobile validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid 10-digit Indian mobile number",
          });
        }

        user.phoneNumber = phone;
        user.isPhoneVerified = false; // reset if changed
      }
    }

    /* =========================
       4️⃣ PROFILE IMAGE
    ========================= */
    if (req.file && req.file.secure_url) {
      user.profileImage = req.file.secure_url;
    }

    /* =========================
       5️⃣ SAVE
    ========================= */
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)[0].message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate value detected.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


/* ======================================================
   GET MY REPORTED ITEMS
   GET /api/users/me/items
====================================================== */
exports.getMyReportedItems = async (req, res) => {
  try {
    const items = await Item.find({ reporter: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: items });

  } catch (err) {
    console.error("FETCH MY ITEMS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ======================================================
   DELETE MY REPORTED ITEM
   DELETE /api/users/me/items/:id
====================================================== */
exports.deleteMyReportedItem = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      reporter: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found or unauthorized",
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item removed successfully",
    });

  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
