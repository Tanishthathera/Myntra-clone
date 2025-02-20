const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();
const Item = require("./models/Item");

// ✅ MongoDB se connect hone ka function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// ✅ JSON file ka data MongoDB me migrate karna
const importData = async () => {
  try {
    await connectDB();

    // `items.json` ka data read karna
    const rawData = fs.readFileSync("items.json");
    const jsonData = JSON.parse(rawData);

    // MongoDB me save karna
    await Item.insertMany(jsonData.items[0]);

    console.log("✅ Data Successfully Imported to MongoDB!");
    process.exit();
  } catch (error) {
    console.error("❌ Data Import Failed:", error);
    process.exit(1);
  }
};

importData();