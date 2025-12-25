const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for logged-in user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .populate("lostItem")
      .populate("foundItem")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
