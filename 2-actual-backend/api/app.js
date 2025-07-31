const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
 
 // ✅ Allow all requests temporarily to debug CORS issue
const allowedOrigins = ["http://localhost:5173", "https://myntra-clone--frontend.vercel.app"];

 app.use(
   cors({
    origin: "http://localhost:5173", // Allow only frontend origin
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
     methods: ["GET", "POST", "DELETE", "OPTIONS"], // ✅ OPTIONS request bhi allow karein
     credentials: true,
     allowedHeaders: ["Content-Type", "Authorization"],
   }));

// ✅ Allow preflight requests for CORS
app.options("*", cors());

app.use(bodyParser.json());

// ✅ Connect Database
connectDB();

// Import routes
const itemsRouter = require("./routes/items");
const ordersRouter = require("./routes/orders");

// ✅ API Routes
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);

// ✅ Debug Route
app.get("/", (req, res) => {
  res.send("Myntra Backend is Live 🚀");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));