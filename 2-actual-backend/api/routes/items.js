const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const redis = require("redis"); 

// 2. Redis Client Setup
const redisUrl = process.env.REDIS_URL;
const isRediss = redisUrl && redisUrl.startsWith('rediss');

const redisClient = redis.createClient({
  url: redisUrl,
  socket: {
    tls: isRediss ? true : undefined,
    rejectUnauthorized: false,
    connectTimeout: 10000
  }
});

redisClient.on('error', (err) => console.log("Redis Error in Items Route:", err));

if (!redisClient.isOpen){
redisClient.connect()
  .then(() => console.log(isRediss ? " Items Route: Upstash Connected" : " Items Route: Local Connected"))
  .catch(err => console.error(" Redis Connection Error in Items Route:", err));
}
// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    
    if (!redisClient.isOpen) {
      return res.json(items.map(item => ({ ...item._doc, currentStock: 50 })));
    }
    // Har item ke liye Redis se current stock fetch karein
    const itemsWithStock = await Promise.all(items.map(async (item) => {
      try {
        const stock = await redisClient.get(`stock_${item._id}`);
        return { 
          ...item._doc, 
          // Agar Redis mein data nahi hai, toh default 50 dikhao (testing ke liye)
          currentStock: stock !== null ? parseInt(stock) : 0 
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
    if (redisClient.isOpen) {
      await redisClient.set(`stock_${newItem.id}`, 50);
    }
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