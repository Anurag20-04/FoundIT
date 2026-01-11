import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotificationPanel.css";

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

      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotifications(data);

      const unread = data.filter(n => !n?.isRead).length;
      onCount?.(unread);

    } catch (err) {
      console.error("Fetch notifications error:", err.response?.data || err.message);
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
    if (!id) return;
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
      console.error("Mark read failed:", err.response?.data || err.message);
    }
  };

  /* =========================
     CLAIM ACTIONS
  ========================= */
  const handleClaimAction = async (notif, action) => {
    if (!notif?._id) return;

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

      if (action === "accept" && res.data?.chatId) {
        navigate(`/chat/${res.data.chatId}`);
        onClose?.();
      }

    } catch (err) {
      console.error("Claim action failed:", err.response?.data || err.message);
    }
  };

  /* =========================
     NORMAL CLICK
  ========================= */
  const handleClick = async (notif) => {
    if (!notif?._id) return;

    await markAsRead(notif._id);
    fetchNotifications();

    const chatId = notif?.claim?.chat;
    const itemId = notif?.item?._id || notif?.item?.id;

    if (notif.type === "claim-approved" && chatId) {
      navigate(`/chat/${chatId}`);
      onClose?.();
    }

    if (notif.type === "claim-rejected" && itemId) {
      navigate(`/item/${itemId}`);
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
            key={n?._id || Math.random()}
            className={`notif-item ${n?.isRead ? "read" : "unread"}`}
            onClick={() => handleClick(n)}
          >
            <div className="notif-main">
              <p className="notif-message">{n?.message || "New notification"}</p>
              <span className="notif-time">
                {n?.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
              </span>
            </div>

            {n?.type === "claim" && (
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
