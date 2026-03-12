require('dotenv').config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URI; 
const client = new MongoClient(url);

async function fixDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to Atlas for Data Repair...");
    const db = client.db("myDatabase"); // Apne DB ka naam yahan likhein
    const collection = db.collection("items");

    // Aaj se 7 din baad ki dynamic date nikalna
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const newDeliveryDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Saare items ko update karna (Jinme field nahi hai unme add ho jayegi)
    const result = await collection.updateMany(
      {}, // Saare documents select karein
      { 
        $set: { 
          delivery_date: newDeliveryDate, 
          return_period: 14 
        } 
      }
    );

    console.log(`🚀 Success! Updated ${result.modifiedCount} items with date: ${newDeliveryDate}`);

  } catch (err) {
    console.error("❌ Repair Error:", err.message);
  } finally {
    await client.close();
    process.exit();
  }
}

fixDatabase();