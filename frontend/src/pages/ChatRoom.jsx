import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import "./ChatRoom.css";

// const API = "http://localhost:5000";
const API = import.meta.env.VITE_API_URL;

export default function ChatRoom() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const socket = getSocket();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);

  /* =========================
     FETCH CHAT
  ========================= */
  const fetchChat = async () => {
    const res = await axios.get(`${API}/api/chats/${chatId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    setChat(res.data.data.chat);
    setMessages(res.data.data.messages);
    setLoading(false);
  };
useEffect(() => {
  fetchChat();

  axios.patch(
    `${API}/api/chats/${chatId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }
  );

  if (socket) {
    socket.emit("chat:join", { chatId });

    // 🔔 tell system unread count changed
    socket.emit("unread:update", {
      targetUserId: user?.id || user?._id
    });
  }

  return () => {
    if (socket) socket.emit("chat:leave", { chatId });
  };
}, [chatId]);


  /* =========================
     REALTIME RECEIVE
  ========================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("message:new", (message) => {
      if (String(message.chat) === String(chatId)) {
        setMessages(prev => [...prev, message]);
      }
    });

   socket.on("typing:start", ({ userId }) => {
  if (String(userId) !== String(user.id || user._id)) {
    setTypingUser(userId);
  }
});


    socket.on("typing:stop", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("message:new");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [chatId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    if (socket) socket.emit("typing:stop", { chatId });

    const res = await axios.post(
      `${API}/api/chats/${chatId}/message`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );

    setMessages(prev => [...prev, res.data.data]);
    setText("");

    if (socket) {
      socket.emit("message:send", res.data.data);
    }
  };

  if (loading) return <div className="chatroom-shell">Loading…</div>;
  if (!chat || !user) return null;

  const myId = user.id || user._id;

  const otherUser = chat.participants.find(
    (p) => String(p._id) !== String(myId)
  );

  return (
    <div className="chatroom-shell">
      {/* ================= HEADER ================= */}
      <header className="chatroom-header">
        <div className="chatroom-user">
          <div className="chat-avatar">
            {otherUser?.profileImage ? (
              <img
                // src={`http://localhost:5000${otherUser.profileImage}`}
                src={`${import.meta.env.VITE_API_URL}${otherUser.profileImage}`}

                alt=""
              />
            ) : (
              <span>{otherUser?.name?.[0] || "U"}</span>
            )}
          </div>

          <div className="chat-user-info">
            <h3>{otherUser?.name || "User"}</h3>
           <p>{typingUser ? "typing…" : "online"}</p>

          </div>
        </div>

        <div className="chatroom-actions">⋮</div>
      </header>

      {/* ================= BODY ================= */}
      <div className="chatroom-body">
        {messages.length === 0 && (
          <div className="chatroom-empty">No messages yet. Say hello.</div>
        )}

        {messages.map((m) => {
          const senderId =
            typeof m.sender === "object" ? m.sender._id : m.sender;

          const isMe = String(senderId) === String(myId);

          return (
            <div key={m._id} className={`msg ${isMe ? "me" : "them"}`}>
              <div className="bubble">
                {m.text}
                <span className="time">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {/* ✅ Typing indicator */}
      {/* ✅ Typing indicator */}
{typingUser && (
  <div className="typing-indicator">
    <span className="typing-name">
      {otherUser?.name || "Someone"}
    </span>
    <span>is typing</span>
    <div className="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
)}


<div ref={bottomRef} />

       
      </div>

      {/* ================= INPUT ================= */}
      <div className="chatroom-input">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (socket) {
              socket.emit("typing:start", { chatId });

              clearTimeout(window.__typingTimer);
              window.__typingTimer = setTimeout(() => {
                socket.emit("typing:stop", { chatId });
              }, 1200);
            }
          }}
          placeholder="Type a message…"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
