import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL;

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(API, {
    auth: { token },
    withCredentials: true,

    // 🔒 DO NOT force websocket on Render
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

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
