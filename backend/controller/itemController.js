const Item = require("../models/Item");
const Notification = require("../models/Notification");
const matchItems = require("../utils/matcher");

/* =========================================================
   CREATE: Add Lost / Found Item
========================================================= */
const addItem = async (req, res) => {
  try {
    const {
      itemType,
      title,
      description,
      category,
      location,
      landmark,
      date,
      reward,
      contactPhone,
      contactEmail,
      displayEmail,
      reporter,
    } = req.body;

    if (
      !itemType ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date ||
      !reporter
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const normalizedType = itemType.toLowerCase();

    // ✅ STORE RELATIVE PATHS ONLY (REQUIRED FOR STATIC SERVING)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `uploads/${file.filename}`
      );
    }

    const safeReward =
      normalizedType === "lost" ? Number(reward) || 0 : 0;

    const newItem = new Item({
      itemType: normalizedType,
      title,
      description,
      category,
      location,
      landmark,
      date,
      images,
      reward: safeReward,
      contactPhone,
      contactEmail,
      displayEmail: Boolean(displayEmail),
      reporter,
    });

    const savedItem = await newItem.save();

    const oppositeType = normalizedType === "found" ? "lost" : "found";

    const potentialMatches = await Item.find({
      itemType: oppositeType,
      status: "active",
    });

    for (const potential of potentialMatches) {
      if (matchItems(potential, savedItem)) {
        potential.matchedItem = savedItem._id;
        potential.status = "matched";
        await potential.save();

        savedItem.matchedItem = potential._id;
        savedItem.status = "matched";
        await savedItem.save();

        const users = [potential.reporter, savedItem.reporter];
        for (const userId of users) {
          await Notification.create({
            user: userId,
            item: savedItem._id,
            message: `Possible match found for your ${
              normalizedType === "found" ? "lost" : "found"
            } item: "${savedItem.title}"`,
          });
        }
        break;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Item reported successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while creating item",
    });
  }
};

/* =========================================================
   READ: Get All Items
========================================================= */
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================================
   READ: Get Item By ID
========================================================= */
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================================
   UPDATE: Update Item
========================================================= */
const updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================================
   DELETE: Delete Item
========================================================= */
const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* =========================================================
   EXPORTS
========================================================= */
module.exports = {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
