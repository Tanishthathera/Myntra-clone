const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// ✅ Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
});

// ✅ Add a new item
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to add item" });
  }
});

// ✅ Delete an item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Item Deleted" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete item" });
  }
});

module.exports = router;
