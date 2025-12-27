const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/dbconn.js");

const Loginrouter = require("./router/Loginrouter");
const Signuprouter = require("./router/Signuprouter");
const itemRouter = require("./router/itemRouter"); 
const notificationRoutes = require("./router/notificationRouters");

dotenv.config();
connectDB();

const app = express();

/* =======================
   CORS (FIXED & SAFE)
======================= */
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ frontend origin (change if needed)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* =======================
   STATIC FILES (IMAGES)
======================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);


/* =======================
   BODY PARSERS
======================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =======================
   ROUTES
======================= */
app.use("/api/login", Loginrouter);
app.use("/api/signup", Signuprouter);
app.use("/api/items", itemRouter);
app.use("/api/notifications", notificationRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("🚀 Lost & Found API is running...");
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Static Assets: http://localhost:${PORT}/uploads`);
  console.log(`📁 Items endpoint: http://localhost:${PORT}/api/items`);
  console.log(`=========================================`);
});
