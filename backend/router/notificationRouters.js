const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Claim = require("../models/Claim");
const Chat = require("../models/Chat");

/* ======================================================
   GET MY NOTIFICATIONS
====================================================== */
router.get("/my", async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user.id })
      .populate({
        path: "claim",
        populate: { path: "item claimant owner chat" },
      })
      .populate("item")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifs });

  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
});

/* ======================================================
   MARK READ
====================================================== */
router.patch("/:id/read", async (req, res) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id, user: req.user.id },
      { isRead: true }
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   ACCEPT CLAIM → CREATE CHAT
====================================================== */
router.patch("/:id/accept", async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
      type: "claim",
    }).populate("claim");

    if (!notif || !notif.claim) {
      return res.status(404).json({
        success: false,
        message: "Notification expired",
      });
    }

    const claim = await Claim.findById(notif.claim._id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (String(claim.owner) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ✅ Already approved
    if (claim.status === "approved" && claim.chat) {
      notif.isRead = true;
      notif.type = "claim-approved";
      await notif.save();

      return res.json({
        success: true,
        chatId: claim.chat,
        reused: true,
      });
    }

    // 🧠 Create chat
    const chat = await Chat.create({
      participants: [claim.owner, claim.claimant],
      claim: claim._id,
      lastActivity: new Date(),
    });

    // 🧠 Update claim
    claim.status = "approved";
    claim.chat = chat._id;
    await claim.save();

    // 🧠 Close owner notif
    notif.isRead = true;
    notif.type = "claim-approved";
    await notif.save();

    // 🔔 Notify claimant
    await Notification.create({
      user: claim.claimant,
      message: "Your claim was approved. You can now chat.",
      type: "claim-approved",
      claim: claim._id,
      item: claim.item,
      isRead: false,
    });

    res.json({
      success: true,
      chatId: chat._id,
    });

  } catch (err) {
    console.error("Accept claim fatal error:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
});

/* ======================================================
   REJECT CLAIM
====================================================== */
router.patch("/:id/reject", async (req, res) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
      type: "claim",
    }).populate("claim");

    if (!notif || !notif.claim) {
      return res.status(404).json({
        success: false,
        message: "Notification expired",
      });
    }

    const claim = await Claim.findById(notif.claim._id);

    if (!claim) {
      return res.status(404).json({ success: false });
    }

    if (String(claim.owner) !== req.user.id) {
      return res.status(403).json({ success: false });
    }

    claim.status = "rejected";
    await claim.save();

    notif.isRead = true;
    notif.type = "claim-rejected";
    await notif.save();

    await Notification.create({
      user: claim.claimant,
      message: "Your claim was rejected.",
      type: "claim-rejected",
      claim: claim._id,
      item: claim.item,
      isRead: false,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Reject claim fatal error:", err);
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
});

module.exports = router;
