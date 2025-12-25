import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/foundit-logo.png";

export default function Navbar({ theme, onToggleTheme, onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogin = () => {
    setMobileOpen(false);
    setTimeout(onLogin, 0);
  };

  const handleSignup = () => {
    setMobileOpen(false);
    setTimeout(onSignup, 0);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
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

        {/* CENTER */}
        <div className="nav-center desktop-only">
          <a href="#" className="active">Home</a>
          <a href="#">Browse</a>
          <a href="#">About</a>
        </div>

        {/* RIGHT DESKTOP */}
        <div className="nav-right desktop-only">
          {user ? (
            <div className="nav-profile">
              <span className="nav-username">{user.name}</span>
              <button className="btn outline" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn outline" onClick={handleSignup}>Sign up</button>
              <button className="btn filled" onClick={handleLogin}>Log in</button>
            </>
          )}

          <div className={`theme-toggle ${theme}`} onClick={onToggleTheme}>
            <div className="toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</div>
          </div>
        </div>

        {/* HAMBURGER */}
        <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>☰</button>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <a href="#">Home</a>
        <a href="#">Browse</a>
        <a href="#">About</a>

        <div className="mobile-auth">
          {user ? (
            <button className="btn outline full" onClick={logout}>Logout</button>
          ) : (
            <>
              <button className="btn outline full" onClick={handleSignup}>Sign up</button>
              <button className="btn filled full" onClick={handleLogin}>Log in</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
