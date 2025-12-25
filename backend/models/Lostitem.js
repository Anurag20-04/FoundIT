const mongoose = require("mongoose");
const LostitemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  images: {
    type: [String]
  },

  lostLocation: {
    type: String,
    required: true
  },

  lostDate: {
    type: Date,
    required: true
  },

  reward: {
    type: Number,
    default: 0
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  matchedFoundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Founditem",
    default: null
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["active", "matched", "resolved"],
    default: "active"
  }
}, { timestamps: true });

const Lostitem = mongoose.model("Lostitem", LostitemSchema);
module.exports = Lostitem;