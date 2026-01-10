const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/dbconn.js");

const Loginrouter = require("./router/Loginrouter");
const Signuprouter = require("./router/Signuprouter");
const itemRouter = require("./router/itemRouter");
const notificationRoutes = require("./router/notificationRouters");
const claimRoutes = require("./router/claimRoutes");
const authMiddleware = require("./middleware/auth");

const userRoutes = require("./router/userRoutes");
const chatRoutes = require("./router/chatRoutes");

dotenv.config();
connectDB();

const app = express();

/* =======================
   ENSURE UPLOAD FOLDERS
======================= */
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/profile-images"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* =======================
   ALLOWED ORIGINS
======================= */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

/* =======================
   CORS (FIXED)
======================= */

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps, curl, postman

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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
app.use("/api/notifications", authMiddleware, notificationRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", authMiddleware, chatRoutes);

/* =======================
   HEALTH CHECK
======================= */

app.get("/", (req, res) => res.send("🚀 Lost & Found API running"));

/* =========================================================
   SOCKET SERVER
========================================================= */

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const jwt = require("jsonwebtoken");

/* ============================
   SOCKET AUTH
============================ */

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId || decoded._id;
    socket.userId = String(userId);

    next();
  } catch {
    next(new Error("Authentication error"));
  }
});

/* ============================
   SOCKET CORE
============================ */

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("🟢 User online:", userId);

  socket.on("message:send", (message) => {
    socket.to(message.chat).emit("message:new", message);
  });

  socket.on("unread:update", ({ targetUserId }) => {
    io.emit("unread:update", { userId: targetUserId });
  });

  socket.on("typing:start", ({ chatId }) => {
    socket.to(chatId).emit("typing:start", { userId, chatId });
  });

  socket.on("typing:stop", ({ chatId }) => {
    socket.to(chatId).emit("typing:stop", { userId, chatId });
  });

  socket.on("chat:join", ({ chatId }) => socket.join(chatId));
  socket.on("chat:leave", ({ chatId }) => socket.leave(chatId));

  socket.on("disconnect", () => {
    console.log("🔴 User offline:", userId);
  });
});

app.set("io", io);

/* =======================
   START
======================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
