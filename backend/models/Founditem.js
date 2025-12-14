const mongoose = require("mongoose");
const FounditemSchema = new mongoose.Schema({
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

  foundLocation: {
    type: String,
    required: true
  },

  foundDate: {
    type: Date,
    required: true
  },

  handedToAuthority: {
    type: Boolean,
    default: false
  },

  finder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["active", "claimed", "resolved"],
    default: "active"
  }
}, { timestamps: true });
const Founditem = mongoose.model("Founditem",FounditemSchema);
module.exports = Founditem;