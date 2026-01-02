import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPanel from "./NotificationPanel";
import avatarDefault from "../assets/Portrait_Placeholder.png";
import "./ProfileDropdown.css";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="profile-wrapper" ref={ref}>
      {/* Avatar + Name */}
      <button
        className="profile-trigger"
        onClick={() => setOpen((p) => !p)}
      >
        <img
  src={
    user?.profileImage
      ? `http://localhost:5000${user.profileImage}?t=${Date.now()}`
      : avatarDefault
  }
  alt="Avatar"
  className="profile-avatar"
  onError={(e) => {
    e.currentTarget.src = avatarDefault;
  }}
/>

        <span className="profile-name">{user?.name}</span>
      </button>

      {open && (
        <div className="profile-dropdown">
          <button
            className="profile-item"
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
          >
            👤 Profile
          </button>

          <button
            className="profile-item"
            onClick={() => setShowNotifs((p) => !p)}
          >
            🔔 Notifications
          </button>

          <button
            className="profile-item"
            onClick={() => {
              navigate("/settings");
              setOpen(false);
            }}
          >
            ⚙️ Settings
          </button>

          <button
            className="profile-item logout"
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* 🔔 Notification panel rendered SEPARATELY */}
      {showNotifs && <NotificationPanel />}
    </div>
  );
}
