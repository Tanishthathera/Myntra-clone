const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "https://myntra-clone-vcuc.vercel.app/", // frontend ka exact URL do
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // Agar authentication use ho rahi hai to
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(bodyParser.json());

// ✅ Connect Database
connectDB();

// ✅ Routes
app.use("/api/items", require("./routes/items"));

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
