const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const Item = require('./api/models/Item'); 
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Worker connected to MongoDB"))
    .catch(err => console.error(" Worker DB Connection Error:", err));

// Worker Logic: Queue se utha kar DB update karna
const worker = new Worker('myntraOrderQueue', async (job) => {
    console.log(` Processing Order: ${job.data.orderId}`);

    try {
        for (const item of job.data.items) {
            // MongoDB mein stock kam karna (Atomic decrement)
            await Item.findByIdAndUpdate(item.id, { $inc: { stock: -1 } });
            console.log(` DB Stock reduced for: ${item.item_name}`);
        }
    } catch (error) {
        console.error(` DB Update Error:`, error);
    }
}, { connection: { host: '127.0.0.1', port: 6379 } });

console.log(" Worker is watching the Myntra Queue...");