import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: `${import.meta.env.VITE_API_URL}/api`,

  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // 🔑 MUST match AuthContext key
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
