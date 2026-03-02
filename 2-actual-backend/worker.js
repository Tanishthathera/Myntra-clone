const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const Item = require('./api/models/Item'); 
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Worker connected to MongoDB"))
    .catch(err => console.error(" Worker DB Connection Error:", err));

   // Redis Connection Setup 
const redisUrl = process.env.REDIS_URL;
const isRediss = redisUrl && redisUrl.startsWith('rediss');

const connectionOptions = isRediss
  ? { url: redisUrl, socket: { tls: true, rejectUnauthorized: false } }
  : { host: '127.0.0.1', port: 6379 };

// Worker Logic: Queue se collect kar DB update karna
const worker = new Worker('myntraOrderQueue', async (job) => {
    console.log(` Processing Order: ${job.data.orderId}`);

    try {
        for (const item of job.data.items) {
            // MongoDB mein stock kam karna (Atomic decrement)
            await Item.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
            console.log(` DB Stock reduced for: ${item.item_name}`);
        }
    } catch (error) {
        console.error(` DB Update Error:`, error);
    }
}, { connection: connectionOptions });

console.log(" Worker is watching the Myntra Queue...");