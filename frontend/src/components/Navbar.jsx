import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/foundit-logo.png";

export default function Navbar({ theme, onToggleTheme, onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔑 FIX: close hamburger FIRST, then open modal
  const handleLogin = () => {
    setMobileOpen(false);
    setTimeout(onLogin, 0);
  };

  const handleSignup = () => {
    setMobileOpen(false);
    setTimeout(onSignup, 0);
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="nav-shell">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo-box">
            <img src={logo} alt="FindIT" />
          </div>
          <span className="brand">FindIT</span>
        </div>

        {/* CENTER (DESKTOP) */}
        <div className="nav-center desktop-only">
          <a href="#" className="active">Home</a>
          <a href="#">Browse</a>
          <a href="#">About</a>
        </div>

        {/* RIGHT (DESKTOP) */}
        <div className="nav-right desktop-only">
          <button className="btn outline" onClick={handleSignup}>
            Sign up
          </button>

          <button className="btn filled" onClick={handleLogin}>
            Log in
          </button>

          <div
            className={`theme-toggle ${theme}`}
            onClick={onToggleTheme}
          >
            <div className="toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen((o) => !o)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <a href="#">Home</a>
        <a href="#">Browse</a>
        <a href="#">About</a>

        <div className="mobile-auth">
          <button className="btn outline full" onClick={handleSignup}>
            Sign up
          </button>

          <button className="btn filled full" onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
}
