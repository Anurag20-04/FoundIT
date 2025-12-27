import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

import Landing from "./components/Landing";
import BrowseItems from "./pages/BrowseItems";
import ItemDetail from "./pages/ItemDetail";
import ReportItem from "./pages/ReportItem/ReportItem";

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

  // ✅ REDIRECT GUARD: Prevents the modal from getting "stuck"
  const handleCloseAuth = () => {
    closeAuthModals();
    // If the user closes the modal while on the protected /report page, 
    // we must move them to the home page so the ReportItem component 
    // doesn't trigger the login modal again.
    if (location.pathname === "/report") {
      navigate("/");
    }
  };

  return (
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

          {/* ✅ ITEM DETAIL PAGE */}
          <Route
            path="/item/:id"
            element={
              <ItemDetail
                theme={theme}
                requireLogin={openLogin}
              />
            }
          />

          {/* ✅ REPORT ITEM FLOW */}
          <Route
            path="/report"
            element={
              <ReportItem
                theme={theme}
                requireLogin={openLogin}
              />
            }
          />
        </Routes>

        <Footer />
      </div>

      {/* ================= AUTH MODALS ================= */}
      {showSignup && (
        <SignupModal
          theme={theme}
          onClose={handleCloseAuth} // ✅ Use redirecting closer
          switchToLogin={openLogin}
        />
      )}

      {showLogin && (
        <LoginModal
          theme={theme}
          onClose={handleCloseAuth} // ✅ Use redirecting closer
          switchToSignup={openSignup}
        />
      )}
    </div>
  );
}

export default App;