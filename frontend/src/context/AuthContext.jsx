import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     RESTORE SESSION
  ======================= */
  useEffect(() => {
  const storedUser = localStorage.getItem("auth_user");
  const storedToken = localStorage.getItem("auth_token");

  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    connectSocket(storedToken);
  }

  setLoading(false);
}, []);

  /* =======================
     LOGIN
  ======================= */
  const login = (userData, authToken) => {
  setUser(userData);
  setToken(authToken);

  localStorage.setItem("auth_user", JSON.stringify(userData));
  localStorage.setItem("auth_token", authToken);

  connectSocket(authToken);
};


  /* =======================
     🔑 UPDATE USER (NEW)
     Used by Profile page
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

  disconnectSocket();
};


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        updateUser, // 🔑 exposed
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
