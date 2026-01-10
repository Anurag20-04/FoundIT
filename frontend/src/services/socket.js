import { io } from "socket.io-client";

const API = "http://localhost:5000";

let socket = null;

export const connectSocket = (token) => {
  socket = io(API, {
    auth: {
      token
    },
    autoConnect: true,
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
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
