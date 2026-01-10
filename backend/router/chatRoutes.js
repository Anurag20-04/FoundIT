const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const auth = require("../middleware/auth");

/* =========================
   GET MY CHATS (INBOX)
   GET /api/chats/my
========================= */
router.get("/my", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate("participants", "name profileImage")
      .populate("lastMessage")
      .sort({ lastActivity: -1 });

    const results = await Promise.all(
      chats.map(async (chat) => {
        const unread = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user.id },
          isRead: false
        });

        return {
          ...chat.toObject(),
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
   SEND MESSAGE
   POST /api/chats/:id/message
========================= */
router.post("/:id/message", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ success: false });

    if (!chat.participants.some(p => String(p) === req.user.id)) {
      return res.status(403).json({ success: false });
    }

    let message = await Message.create({
      chat: chat._id,
      sender: req.user.id,
      text,
      isRead: false
    });

    message = await message.populate("sender", "name profileImage");

    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    // 🔥 SOCKET PUSH
    const io = req.app.get("io");

    io.to(chat._id.toString()).emit("message:new", {
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
      { isRead: true }
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
