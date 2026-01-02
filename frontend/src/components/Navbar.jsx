import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";
import logo from "../assets/foundit-logo.png";

export default function Navbar({ theme, onToggleTheme, onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMobile = () => setMobileOpen(false);

  const handleLogin = () => {
    closeMobile();
    onLogin();
  };

  const handleSignup = () => {
    closeMobile();
    onSignup();
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

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

        {/* CENTER – DESKTOP */}
        <div className="nav-center desktop-only">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/browse" className={navLinkClass}>Browse</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </div>

        {/* RIGHT – DESKTOP */}
        <div className="nav-right desktop-only">
          {user ? (
            <ProfileDropdown
              key={user.profileImage} // 🔑 ONLY REQUIRED CHANGE
            />
          ) : (
            <>
              <button className="btn outline" onClick={handleSignup}>
                Sign up
              </button>
              <button className="btn filled" onClick={handleLogin}>
                Log in
              </button>
            </>
          )}

          <div className={`theme-toggle ${theme}`} onClick={onToggleTheme}>
            <div className="toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(o => !o)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <NavLink to="/" className={navLinkClass} onClick={closeMobile}>Home</NavLink>
        <NavLink to="/browse" className={navLinkClass} onClick={closeMobile}>Browse</NavLink>
        <NavLink to="/about" className={navLinkClass} onClick={closeMobile}>About</NavLink>

        <div className="mobile-auth">
          {user ? (
            <button className="btn outline full" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <button className="btn outline full" onClick={handleSignup}>
                Sign up
              </button>
              <button className="btn filled full" onClick={handleLogin}>
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
