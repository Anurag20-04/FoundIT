const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  // CORE FIELDS (Common to both)
  itemType: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: { type: [String] },
  location: { type: String, required: true },
  landmark: { type: String },
  date: { type: Date, required: true },

  // USER REFERENCE
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // CONTACT PREFERENCES
  contactPhone: { type: String },
  contactEmail: { type: String },
  displayEmail: { type: Boolean, default: false },

  // SPECIFIC FIELDS
  reward: { type: Number, default: 0 },
  handedToAuthority: { type: Boolean, default: false },

  // STATUS MANAGEMENT
  status: {
    type: String,
    enum: ["active", "matched", "resolved"],
    default: "active"
  },
  matchedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    default: null
  }
}, { timestamps: true });

// Indexing for Browse Page search
ItemSchema.index({
  title: "text",
  description: "text",
  location: "text"
});

module.exports = mongoose.model("Item", ItemSchema);
