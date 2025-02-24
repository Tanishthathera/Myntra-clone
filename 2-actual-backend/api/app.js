const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ✅ Allow Multiple Origins for Frontend & Backend
const allowedOrigins = [
  "https://myntra--frontend.vercel.app",
  "https://myntra--backend.vercel.app/api/items",
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
    credentials: true, // 🔥 Important for authentication-related requests
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
