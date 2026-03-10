const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const redis = require("redis"); 

// 1. Redis Client Setup
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
    .then(() => console.log(isRediss ? "Items Route: Upstash Connected" : "Items Route: Local Connected"))
    .catch(err => console.error("Redis Connection Error in Items Route:", err));
}

// --- 2. SEARCH ROUTE (Hamesha generic routes se upar rakhein) ---
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    // MongoDB search using Regex
    const items = await Item.find({
      $or: [
        { item_name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } }
      ]
    });

    // Redis stock logic for searched items
    const itemsWithStock = await Promise.all(items.map(async (item) => {
      try {
        const stock = redisClient.isOpen ? await redisClient.get(`stock_${item._id}`) : null;
        return { 
          ...item._doc, 
          currentStock: stock !== null ? parseInt(stock) : 50 
        };
      } catch (redisErr) {
        return { ...item._doc, currentStock: 50 };
      }
    }));

    res.json(itemsWithStock);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 3. GET ALL ITEMS (Filtered by Category) ---
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; 
    let filter = {};
    
    if (category && category !== "undefined") {
      filter = { category: category }; 
    }

    const items = await Item.find(filter); 
    
    const itemsWithStock = await Promise.all(items.map(async (item) => {
      try {
        const stock = redisClient.isOpen ? await redisClient.get(`stock_${item._id}`) : null;
        return { 
          ...item._doc, 
          currentStock: stock !== null ? parseInt(stock) : 50 
        };
      } catch (redisErr) {
        return { ...item._doc, currentStock: 50 };
      }
    }));

    res.json(itemsWithStock);
  } catch (error) {
    console.error("GET /api/items Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 4. ADD NEW ITEM ---
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

// --- 5. DELETE ITEM ---
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    // Optional: Redis se bhi stock delete kar sakte hain
    if (redisClient.isOpen) await redisClient.del(`stock_${req.params.id}`);
    res.json({ message: "Item Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

module.exports = router;