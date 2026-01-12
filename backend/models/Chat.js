const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
      unique: true,
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

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
