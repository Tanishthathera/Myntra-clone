const mongoose = require('mongoose');
const redis = require('redis');
const Item = require('./api/models/Item');
require('dotenv').config();

const redisClient = redis.createClient();

async function syncStock() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await redisClient.connect();
        console.log(" Connected to DB and Redis for Sync...");

        const items = await Item.find();
        
        for (const item of items) {
            const stockKey = `stock_${item._id}`;
            // Sab products ka stock 50 set kar rahe hain
            await redisClient.set(stockKey, 50); 
            console.log(` Redis Synced: ${item.item_name} -> 50`);
        }

        console.log(" All items synced to Redis! Now you can start the sale.");
        process.exit();
    } catch (err) {
        console.error(" Sync Failed:", err);
        process.exit(1);
    }
}

syncStock();