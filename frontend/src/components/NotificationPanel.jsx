import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotificationPanel.css";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     Fetch Notifications
  ========================= */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
     Close on Outside Click
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     Mark as Read
  ========================= */
  const markAsRead = async (notifId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${notifId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notifId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read");
    }
  };

  /* =========================
     Notification Click Action
  ========================= */
  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);

    if (notif.itemId) {
      navigate(`/item/${notif.itemId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-wrapper" ref={panelRef}>
      <button
        className="notif-bell"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Notifications"
      >
        {/* CHANGED: removed bell emoji, keep dot */}
        Notifications
        {unreadCount > 0 && <span className="notif-dot" />}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notif-item ${n.read ? "read" : "unread"}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
