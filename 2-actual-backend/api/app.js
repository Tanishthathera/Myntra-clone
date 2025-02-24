const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ✅ CORS Configuration - Fix for Vercel & Deployment
const allowedOrigins = [
  "https://myntra--frontend.vercel.app", // ✅ Frontend URL
  "https://myntra--backend.vercel.app", // ✅ Backend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin!"));
      }
    },
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // ✅ Required for authentication-related requests
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// ✅ Connect Database
connectDB();

// ✅ Debug Route - Backend is Live
app.get("/", (req, res) => {
  res.send("Myntra Backend is Live 🚀");
});

// ✅ API Routes
app.use("/api/items", require("./routes/items"));

// ✅ 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
