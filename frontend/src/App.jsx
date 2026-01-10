import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Landing from "./components/Landing";
import BrowseItems from "./pages/BrowseItems";
import ItemDetail from "./pages/ItemDetail";
import ReportItem from "./pages/ReportItem/ReportItem";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ChatInbox from "./pages/ChatInbox";
import ClaimRequests from "./pages/ClaimRequests";
import ChatRoom from "./pages/ChatRoom";



import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= AUTH MODALS ================= */
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const closeAuthModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleCloseAuth = () => {
    closeAuthModals();
    if (location.pathname === "/report") {
      navigate("/");
    }
  };

  return (
    <AuthProvider>
      <div className={`app ${theme}`}>
        <div className="app-content">
          {/* ================= NAVBAR ================= */}
          <Navbar
            theme={theme}
            onToggleTheme={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            onLogin={openLogin}
            onSignup={openSignup}
          />

          {/* ================= ROUTES ================= */}
          <Routes>
            <Route path="/" element={<Landing theme={theme} />} />

            <Route
              path="/browse"
              element={<BrowseItems theme={theme} />}
            />
            <Route path="/about"
             element={<About theme={theme} />} />


            <Route
              path="/item/:id"
              element={
                <ItemDetail
                  theme={theme}
                  requireLogin={openLogin}
                />
              }
            />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route
              path="/report"
              element={
                <ReportItem
                  theme={theme}
                  requireLogin={openLogin}
                />
              }
            />

            {/* 🔐 PROTECTED PROFILE ROUTE */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/messages" element={<ChatInbox theme={theme} />} />
            <Route path="/claims/requests" element={<ClaimRequests />} />
              <Route
  path="/chat/:chatId"
  element={
    <ProtectedRoute>
      <ChatRoom theme={theme} />
    </ProtectedRoute>
  }
/>

          </Routes>
          

          <Footer />
        </div>

        {/* ================= AUTH MODALS ================= */}
        {showSignup && (
          <SignupModal
            theme={theme}
            onClose={handleCloseAuth}
            switchToLogin={openLogin}
          />
        )}

        {showLogin && (
          <LoginModal
            theme={theme}
            onClose={handleCloseAuth}
            switchToSignup={openSignup}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
