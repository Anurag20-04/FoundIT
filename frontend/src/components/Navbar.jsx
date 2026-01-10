import { useState ,useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";
import logo from "../assets/foundit-logo.png";
import ChatIcon from "../assets/chatIcon.png";
import axios from "axios";
import { getSocket } from "../services/socket";

const API = "http://localhost:5000";

export default function Navbar({ theme, onToggleTheme, onLogin, onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [unreadChats, setUnreadChats] = useState(0);

useEffect(() => {
  if (!user) return;

  const socket = getSocket();

  const fetchUnread = async () => {
    try {
      const res = await axios.get(`${API}/api/chats/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const people = res.data.data.filter(c => c.unreadCount > 0).length;
      setUnreadChats(people);
    } catch (err) {
      console.error("Unread fetch error:", err);
    }
  };

  // initial load
  fetchUnread();

  // realtime refresh
  if (socket) {
    socket.on("unread:update", fetchUnread);
    socket.on("message:new", fetchUnread);
  }

  return () => {
    if (socket) {
      socket.off("unread:update", fetchUnread);
      socket.off("message:new", fetchUnread);
    }
  };

}, [user]);

  const navigate = useNavigate();

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
       <NavLink to="/" className="nav-left" onClick={closeMobile}>
  <div className="logo-box">
    <img src={logo} alt="FoundIT" />
  </div>
  <span className="brand">FoundIT</span>
</NavLink>


        {/* CENTER – DESKTOP */}
        <div className="nav-center desktop-only">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/browse" className={navLinkClass}>Browse</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </div>

        {/* RIGHT – DESKTOP */}
        <div className="nav-right ">

            <div className={`theme-toggle ${theme}`} onClick={onToggleTheme}>
            <div className="toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </div>
          </div>
        </div>

          {/* 🔹 CHAT BUTTON (only when logged in) */}
        {user && (
  <button className="nav-chat-btn" onClick={() => navigate("/messages")}>
    <img src={ChatIcon} alt="Chat" />
    {unreadChats > 0 && <span className="chat-dot">{unreadChats}</span>}
  </button>
)}

      

        
            {user ? (
            <ProfileDropdown
              key={user.profileImage}
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
