// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// require("dotenv").config();

// const app = express();

// const allowedOrigins = ["http://localhost:5173", "https://myntra-clone--frontend.vercel.app", "https://myntra--backend.vercel.app"];

// // Apply whitelist CORS only to /api/orders routes
// app.use('/api/orders', cors({
//   origin: function(origin, callback) {
//     console.log("CORS Origin:", origin);
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       console.error("CORS Rejected Origin:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "DELETE", "OPTIONS"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// // Apply permissive CORS to /api/items routes
// app.use('/api/items', cors({
//   origin: true,
//   methods: ["GET", "POST", "DELETE", "OPTIONS"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// //  Allow preflight requests for CORS
// app.options("*", cors());

// app.use(bodyParser.json());

// //  Connect Database
// connectDB();

// // Import routes
// const itemsRouter = require("./routes/items");
// const ordersRouter = require("./routes/orders");

// //  API Routes
// console.log("Routes Loading...");
// app.use("/api/items", itemsRouter);
// app.use("/api/orders", ordersRouter);
// console.log("Routes Loaded Successfully!");

// //  Debug Route
// app.get("/", (req, res) => {
//   res.send("Myntra Backend is Live ");
// });

// //  404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: "404 - Not Found" });
// });

// //  Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const cors = require('cors');

const allowedOrigins = [
  'https://myntra-clone--frontend.vercel.app',
  'http://localhost:5173', // Local testing ke liye
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar origin list mein hai ya fir origin null hai (jaise mobile apps/server calls)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// Connect Database
connectDB();

// Import routes
const itemsRouter = require("./routes/items");
const ordersRouter = require("./routes/orders");

// API Routes
console.log("Routes Loading...");
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);
console.log("Routes Loaded Successfully!");

app.get("/", (req, res) => {
  res.send("Myntra Backend is Live ");
});

app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));