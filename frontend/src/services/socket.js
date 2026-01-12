import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL;

let socket = null;

/* =========================
   CONNECT SOCKET
========================= */
export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(API, {
    auth: { token },
    withCredentials: true,

    // Keep both for Render stability
    transports: ["polling", "websocket"],

    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connect error:", err.message);
  });

  return socket;
};

/* =========================
   SAFE GETTER
========================= */
export const getSocket = () => {
  if (!socket) {
    console.warn("⚠️ Socket not connected yet");
  }
  return socket;
};

/* =========================
   CLEAN DISCONNECT
========================= */
export const disconnectSocket = () => {
  if (socket) {
    console.log("🟠 Socket disconnected manually");
    socket.disconnect();
    socket = null;
  }
};
