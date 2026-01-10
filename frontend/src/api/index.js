import axios from "axios";

const API = axios.create({
  // This is the BASE URL. 
  // All other requests will be added to the end of this.
  baseURL: "https://foundit-8o0r.onrender.com/api", 
  withCredentials: true
});

// Example of how you use it in this file:
export const fetchItems = () => API.get("/items"); 
// This automatically sends the request to:
// https://foundit-8o0r.onrender.com/api/items

export const fetchMyChats = () => API.get("/chats/my");
// This sends to: 
// https://foundit-8o0r.onrender.com/api/chats/my