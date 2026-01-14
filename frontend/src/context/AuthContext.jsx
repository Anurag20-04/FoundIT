import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { connectSocket, disconnectSocket } from "../services/socket";

const API = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     RESTORE SESSION (SAFE)
  ======================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    // 🔥 verify token instead of trusting localStorage
    axios
      .get(`${API}/api/users/me`)
      .then((res) => {
        setUser(res.data.data);
        setToken(storedToken);
        localStorage.setItem("auth_user", JSON.stringify(res.data.data));
        connectSocket(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        delete axios.defaults.headers.common["Authorization"];
        disconnectSocket();
      })
      .finally(() => setLoading(false));
  }, []);

  /* =======================
     LOGIN (SAFE)
  ======================= */
  const login = async (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("auth_token", authToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

    connectSocket(authToken);
  };

  /* =======================
     UPDATE USER
  ======================= */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };

  /* =======================
     LOGOUT
  ======================= */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");

    delete axios.defaults.headers.common["Authorization"];

    disconnectSocket();
  };

  /* =======================
     GLOBAL 401 GUARD
  ======================= */
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          console.warn("🔐 Session expired. Logging out.");

          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
          delete axios.defaults.headers.common["Authorization"];

          setUser(null);
          setToken(null);
          disconnectSocket();
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        updateUser,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
