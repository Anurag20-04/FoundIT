const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const auth = require("../middleware/auth");


/* =========================
   CLOUDINARY + MULTER
========================= */
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "foundit/chat",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  
});


/* =========================
   GET MY CHATS (INBOX)
   GET /api/chats/my
========================= */
router.get("/my", auth, async (req, res) => {
  try {
    let chats = await Chat.find({
      participants: req.user.id
    })
      .populate("participants", "name profileImage")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name profileImage"
        }
      })
      .sort({ lastActivity: -1 });

    const results = await Promise.all(
      chats.map(async (chat) => {
        const unread = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user.id },
          status: { $ne: "read" }
        });

        const otherUser = chat.participants.find(
          p => String(p._id) !== req.user.id
        );

        return {
          ...chat.toObject(),
          otherUser,
          unreadCount: unread
        };
      })
    );

    res.json({ success: true, data: results });

  } catch (err) {
    console.error("Inbox fetch error:", err);
    res.status(500).json({ success: false });
  }
});


/* =========================
   GET CHAT + MESSAGES
   GET /api/chats/:id
========================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("participants", "name profileImage");

    if (!chat) return res.status(404).json({ success: false });

    if (!chat.participants.some(p => String(p._id) === req.user.id)) {
      return res.status(403).json({ success: false });
    }

    const messages = await Message.find({ chat: chat._id })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { chat, messages }
    });

  } catch (err) {
    console.error("Chat fetch error:", err);
    res.status(500).json({ success: false });
  }
});


/* =========================
   SEND MESSAGE (TEXT + IMAGE)
   POST /api/chats/:id/message
========================= */
router.post("/:id/message", auth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text?.trim() && !file) {
      return res.status(400).json({ success: false, message: "Empty message" });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ success: false });

    if (!chat.participants.some(p => String(p) === req.user.id)) {
      return res.status(403).json({ success: false });
    }

    const attachments = [];

    if (file) {
      attachments.push({
        type: "image",
        url: file.path, // cloudinary secure url
      });
    }

    let message = await Message.create({
      chat: chat._id,
      sender: req.user.id,
      text: text || "",
      attachments,
      status: "sent"
    });

    message = await message.populate("sender", "name profileImage");

    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    /* ================= SOCKET PUSH ================= */

    const io = req.app.get("io");

    io.to(chat._id.toString()).emit("message:new", {
      chatId: chat._id,
      message
    });

    io.emit("inbox:update", {
      chatId: chat._id,
      message
    });

    res.status(201).json({ success: true, data: message });

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false });
  }
});


/* =========================
   MARK CHAT READ
   PATCH /api/chats/:id/read
========================= */
router.patch("/:id/read", auth, async (req, res) => {
  try {
    await Message.updateMany(
      { chat: req.params.id, sender: { $ne: req.user.id } },
      { status: "read" }
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
