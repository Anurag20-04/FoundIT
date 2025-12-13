import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/foundit-logo.png";

export default function Navbar({ theme, onToggleTheme, onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`navbar ${theme}`}>
      <div className="nav-shell">

        {/* LEFT */}
        <div className="nav-left">
          {/* MOBILE HAMBURGER ONLY */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="logo-box">
            <img src={logo} alt="FoundIt" />
          </div>
          <span className="brand">FoundIt</span>
        </div>

        {/* DESKTOP CENTER LINKS */}
        <nav className="nav-center desktop-only">
          <a className="active" href="#">Home</a>
          <a href="#">Browse</a>
          <a href="#">About Us</a>
        </nav>

        {/* RIGHT */}
        <div className="nav-right">
          <button className="btn outline" onClick={onSignup}>Sign In</button>
          <button className="btn filled" onClick={onLogin}>Log In</button>

          <button
            className={`theme-toggle ${theme}`}
            onClick={onToggleTheme}
          >
            <span className="toggle-thumb">
              {theme === "light" ? "☀️" : "🌙"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU (SEPARATE FROM DESKTOP) */}
      <nav className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <a href="#">Home</a>
        <a href="#">Browse</a>
        <a href="#">About Us</a>

        <button className="btn outline full" onClick={onSignup}>
          Sign In
        </button>
        <button className="btn filled full" onClick={onLogin}>
          Log In
        </button>
      </nav>
    </header>
  );
}
