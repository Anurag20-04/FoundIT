const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ text is no longer mandatory (so image-only messages work)
    text: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // ✅ Cloudinary attachments (image now, expandable later)
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

MessageSchema.index({ chat: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
