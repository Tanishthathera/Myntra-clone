require('dotenv').config();
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URI; 
const client = new MongoClient(url);

async function runUpdate() {
  try {
    if (!url) {
      console.error(" Error: MONGO_URI .env file is missing!");
      return;
    }

    // --- YE LINE ADD KI HAI ---
    await client.connect(); 
    console.log(" Connected To Atlas Cloud...");

    const db = client.db("myDatabase"); 
    const collection = db.collection("items"); 

    const items = await collection.find({}).toArray();
    console.log(`Found ${items.length} items on Atlas.`);

    if (items.length === 0) {
      console.log("No Ishue Detected");
      return;
    }

    for (let item of items) {
      let cat = "Men"; 
      const name = (item.item_name || "").toLowerCase();

      if (name.includes("women") || name.includes("dress") || name.includes("studs") || name.includes("earrings")) {
        cat = "Women";
      } else if (name.includes("kids") || name.includes("boy") || name.includes("girl") || name.includes("toy") || name.includes("toddler")) {
        cat = "Kids";
      } else if (name.includes("deodrant") || name.includes("perfume") || name.includes("lipstick") || name.includes("makeup")|| name.includes("cream")) {
        cat = "Beauty";
      } else if (name.includes("curtain") || name.includes("bedsheet") || name.includes("towel") || name.includes("cushion") || name.includes("storage") || name.includes("lamp") || name.includes("bottle")) {
        cat = "Home & living";
      } else if (name.includes("trending")) {
        cat = "Studio"; 
      }

      await collection.updateOne(
        { _id: item._id },
        { $set: { category: cat } }
      );
      console.log(`Updated: ${item.item_name} -> ${cat}`);
    }

    console.error(" Error:", err.message);
  } finally {
    await client.close();
    process.exit();
  }
}

runUpdate();