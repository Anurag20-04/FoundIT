import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChatInbox.css";

// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = import.meta.env.VITE_API_URL;


export default function ChatInbox({ theme }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className =
      theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/chats/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (res.data?.success) {
          setThreads(res.data.data);
        }
      } catch (err) {
        console.error("Fetch chats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className={`browse-page-wrapper ${theme}`}>
        <div className="browse-shell">
          <p>Loading chats…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`browse-page-wrapper ${theme}`}>
      <div className="browse-shell chat-inbox-shell">
        <header className="browse-header">
          <h1>
            Messages <span className="highlight">Inbox</span>
          </h1>
          <p>Your active claims and conversations</p>
        </header>

        <div className="chat-thread-list">
         {threads.length === 0 ? (
  <div className="chat-empty-wrap">
    <div className="chat-empty-card">
      <div className="chat-empty-icon">💬</div>
      <h2>Your inbox is empty</h2>
      <p>
        When you claim an item or someone contacts you,
        your conversations will appear here.
      </p>

      <div className="chat-empty-actions">
        <button
          className="chat-primary-btn"
          onClick={() => navigate("/browse")}
        >
          Browse lost & found items
        </button>
      </div>

      <div className="chat-empty-hint">
        Tip: Chats unlock after a claim is accepted.
      </div>
    </div>
  </div>
) : (

            threads.map((chat) => (
              <div
                key={chat._id}
                className="chat-thread-card"
                onClick={async () => {
  await axios.patch(
    `${BACKEND_URL}/api/chats/${chat._id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }
  );

  navigate(`/chat/${chat._id}`);
}}
>
                <div className="thread-avatar">
                  {chat.otherUser?.name?.[0] || "U"}
                </div>

                <div className="thread-info">
                  <h4>{chat.otherUser?.name || "Unknown User"}</h4>
                  <p className="last-msg">
                    {chat.lastMessage?.text || "No messages yet"}
                  </p>
                </div>

                <div className="thread-meta">
                  <span>
                    {chat.lastMessage?.createdAt
                      ? new Date(chat.lastMessage.createdAt).toLocaleDateString()
                      : ""}
                  </span>

                  {chat.unreadCount > 0 && (
                    <div className="unread-badge">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
