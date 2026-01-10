import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotificationPanel.css";

// const API = "http://localhost:5000";
const API = import.meta.env.VITE_API_URL;

export default function NotificationPanel({ onCount, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/api/notifications/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = res.data?.data || [];
      setNotifications(data);

      const unread = data.filter(n => !n.isRead).length;
      onCount?.(unread);

    } catch (err) {
      console.error("Notification fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
     MARK AS READ
  ========================= */
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${API}/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  /* =========================
     CLAIM ACTIONS (APPROVE / REJECT)
  ========================= */
  const handleClaimAction = async (notif, action) => {
    try {
      const res = await axios.patch(
        `${API}/api/notifications/${notif._id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      await fetchNotifications();

      // ✅ APPROVED → open chat
      if (action === "accept" && res.data?.chatId) {
        navigate(`/chat/${res.data.chatId}`);
        onClose?.();
      }

    } catch (err) {
  console.error("Claim action failed:", err.response?.data || err.message);
}

  };

  /* =========================
     NORMAL CLICK BEHAVIOR
  ========================= */
  const handleClick = async (notif) => {
    await markAsRead(notif._id);
    fetchNotifications();

    if (notif.type === "claim-approved" && notif.claim?.chat) {
      navigate(`/chat/${notif.claim.chat}`);
      onClose?.();
    }

    if (notif.type === "claim-rejected" && notif.item?._id) {
      navigate(`/item/${notif.item._id}`);
      onClose?.();
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="notif-dropdown" ref={panelRef}>
      <div className="notif-header">Notifications</div>

      {loading ? (
        <div className="notif-empty">Loading…</div>
      ) : notifications.length === 0 ? (
        <div className="notif-empty">No notifications yet</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`notif-item ${n.isRead ? "read" : "unread"}`}
            onClick={() => handleClick(n)}
          >
            <div className="notif-main">
              <p className="notif-message">{n.message}</p>
              <span className="notif-time">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {/* 🔥 CLAIM ACTION ZONE */}
            {n.type === "claim" && (
              <div
                className="notif-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="notif-accept"
                  onClick={() => handleClaimAction(n, "accept")}
                >
                  Approve
                </button>

                <button
                  className="notif-reject"
                  onClick={() => handleClaimAction(n, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
