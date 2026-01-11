const User = require("../models/User");

exports.updateMyProfile = async (req, res) => {
  try {
    // 1. Check Auth
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2. Fetch the user document
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Update text fields manually
    if (req.body.name !== undefined) user.name = req.body.name.trim();
    if (req.body.address !== undefined) user.address = req.body.address.trim();
    
    // Handle phone specifically to allow null/empty
    if (req.body.phoneNumber !== undefined) {
      user.phoneNumber = req.body.phoneNumber === "" ? null : req.body.phoneNumber;
    }

   // 4. Handle Profile Image (Singular)
console.log("🔥 FILE RECEIVED:", req.file);

if (req.file && req.file.path) {
  console.log("🔥 FILE PATH:", req.file.path);
  user.profileImage = req.file.path;
} else {
  console.log("❌ NO FILE OR NO PATH");
}


    // 5. Save the document
    // This runs your schema validators and password middleware correctly
    await user.save();

    // Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);

    // If it's a validation error (like bad phone format), send 400 instead of 500
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(val => val.message)[0],
      });
    }

    // Handle Duplicate Key Error (Aadhar or Email)
    if (error.code === 11000) {
       return res.status(400).json({
        success: false,
        message: "Duplicate value detected (Email or Aadhar already exists).",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};