const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      validate: [arr => arr.length === 2, "Chat must have exactly 2 participants"],
    },

    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    unreadCounts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ChatSchema.index({ claim: 1 }, { unique: true });
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastActivity: -1 });

module.exports = mongoose.model("Chat", ChatSchema);
