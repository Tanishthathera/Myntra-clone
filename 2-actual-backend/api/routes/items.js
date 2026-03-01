const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const redis = require("redis"); 

// 2. Redis Client Setup
const redisClient = redis.createClient();
redisClient.connect()
  .then(() => console.log(" Items Route connected to Redis"))
  .catch(err => console.error(" Redis Connection Error in Items Route:", err));

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    
    // Har item ke liye Redis se current stock fetch karein
    const itemsWithStock = await Promise.all(items.map(async (item) => {
      try {
        const stock = await redisClient.get(`stock_${item._id}`);
        return { 
          ...item._doc, 
          // Agar Redis mein data nahi hai, toh default 50 dikhao (testing ke liye)
          currentStock: stock !== null ? parseInt(stock) : 50 
        };
      } catch (redisErr) {
        console.error(`Error fetching stock for ${item._id}:`, redisErr);
        return { ...item._doc, currentStock: 0 };
      }
    }));

    res.json(itemsWithStock);
  } catch (error) {
    console.error("GET /api/items Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new item
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item" });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;