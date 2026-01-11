const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/dbconn.js");

// Routers
const Loginrouter = require("./router/Loginrouter");
const Signuprouter = require("./router/Signuprouter");
const itemRouter = require("./router/itemRouter"); 
const notificationRoutes = require("./router/notificationRouters");
const claimRoutes = require("./router/claimRoutes");
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
  "https://found-it-git-main-anurags-projects-2a89023f.vercel.app",
  "https://found-it-rho.vercel.app",
  "https://found-8vvp0abdy-anurags-projects-2a89023f.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

/* =======================
   CORS (API)
======================= */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED
app.options("/*", cors());

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
app.use("/api/claims", claimRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/chats", chatRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => res.send("🚀 Lost & Found API running"));

/* =======================
   SOCKET SERVER
======================= */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"],
});

const jwt = require("jsonwebtoken");

/* ============================
   SOCKET AUTH
============================ */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = String(
      decoded.id || decoded.userId || decoded._id
    );
    next();
  } catch (err) {
    next(new Error("Auth failed"));
  }
});

/* ============================
   SOCKET CORE
============================ */
io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("🟢 User online:", userId);

  socket.on("chat:join", ({ chatId }) => {
    if (chatId) socket.join(chatId);
  });

  socket.on("chat:leave", ({ chatId }) => {
    if (chatId) socket.leave(chatId);
  });

  socket.on("message:send", (message) => {
    if (message?.chat) {
      socket.to(message.chat).emit("message:new", message);
    }
  });

  socket.on("unread:update", ({ targetUserId }) => {
    if (targetUserId) {
      io.emit("unread:update", { userId: targetUserId });
    }
  });

  socket.on("typing:start", ({ chatId }) => {
    if (chatId) {
      socket.to(chatId).emit("typing:start", { userId, chatId });
    }
  });

  socket.on("typing:stop", ({ chatId }) => {
    if (chatId) {
      socket.to(chatId).emit("typing:stop", { userId, chatId });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 User offline:", userId, "|", reason);
  });
});

app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
