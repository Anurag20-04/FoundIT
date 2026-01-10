const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");

/* ======================================================
   CREATE CLAIM
   POST /api/claims
====================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const { itemId, ownerId } = req.body;
    const claimantId = req.user._id;

    if (!itemId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Missing itemId or ownerId",
      });
    }

    const exists = await Claim.findOne({
      item: itemId,
      claimant: claimantId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already submitted a claim for this item.",
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: claimantId,
      owner: ownerId,
      status: "pending",
    });

    await Notification.create({
  user: ownerId,
  message: "Someone has submitted a claim on your item.",
  type: "claim",              // 🔴 REQUIRED (THIS WAS MISSING)
  claim: claim._id,           // store properly
  item: itemId,
  isRead: false,
});


    res.status(201).json({ success: true, data: claim });

  } catch (err) {
    console.error("Create claim error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   GET MY CLAIM FOR ITEM
   GET /api/claims/item/:itemId/mine
====================================================== */
router.get("/item/:itemId/mine", auth, async (req, res) => {
  try {
    const claim = await Claim.findOne({
      item: req.params.itemId,
      claimant: req.user._id,
    });

    res.json({ success: true, data: claim });
  } catch (err) {
    console.error("Fetch claim error:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================================================
   APPROVE CLAIM → CREATE CHAT
   PATCH /api/claims/:id/approve
====================================================== */
router.patch("/:id/approve", auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    if (String(claim.owner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (claim.status === "approved" && claim.chat) {
      return res.json({ success: true, data: claim });
    }

    // 🔹 Create chat
    const chat = await Chat.create({
      participants: [claim.owner, claim.claimant],
      claim: claim._id,
    });

    // 🔹 Update claim
    claim.status = "approved";
    claim.chat = chat._id;
    await claim.save();

    // 🔔 Notify claimant
   await Notification.create({
  user: claim.claimant,
  message: "Your claim has been approved. You can now chat.",
  type: "claim-approved",     // 🔴 REQUIRED
  claim: claim._id,
  item: claim.item,
  isRead: false,
});


    res.json({ success: true, data: claim });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
});

/* ======================================================
   REJECT CLAIM
   PATCH /api/claims/:id/reject
====================================================== */
router.patch("/:id/reject", auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: "Claim not found" });
    }

    if (String(claim.owner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    claim.status = "rejected";
    await claim.save();

   await Notification.create({
  user: claim.claimant,
  message: "Your claim was rejected.",
  type: "claim-rejected",
  claim: claim._id,
  item: claim.item,
  isRead: false,
});


    res.json({ success: true, data: claim });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ success: false });
  }
});
/* ======================================================
   GET CLAIMS FOR ITEMS I OWN (OWNER DASHBOARD)
   GET /api/claims/received
====================================================== */
router.get("/received", auth, async (req, res) => {
  try {
    const claims = await Claim.find({ owner: req.user.id })
      .populate("claimant", "name email profileImage")
      .populate("item")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: claims });
  } catch (err) {
    console.error("Fetch received claims error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
