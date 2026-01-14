import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import "./ChatRoom.css";

const API = import.meta.env.VITE_API_URL;

export default function ChatRoom() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const socket = getSocket();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);
  const chatBodyRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const myId = user?._id || user?.id;

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

    if (socket && myId) {
      socket.emit("chat:join", { chatId });
      socket.emit("unread:update", { targetUserId: myId });
    }

    return () => {
      if (socket) socket.emit("chat:leave", { chatId });
    };
  }, [chatId]);

  /* =========================
     REALTIME RECEIVE
  ========================= */
  useEffect(() => {
    if (!socket || !myId) return;

    socket.on("message:new", ({ chatId: incomingChatId, message }) => {
      if (String(incomingChatId) === String(chatId)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing:start", ({ userId }) => {
      if (String(userId) !== String(myId)) {
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
  }, [chatId, myId]);

  /* =========================
     SMART AUTO SCROLL
  ========================= */
  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUser]);

  /* =========================
     SEND MESSAGE (TEXT + FILE)
  ========================= */
  const sendMessage = async () => {
    if (!text.trim() && !file) return;

    if (socket) socket.emit("typing:stop", { chatId });

    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);

    const res = await axios.post(
      `${API}/api/chats/${chatId}/message`,
      form,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessages((prev) => [...prev, res.data.data]);
    setText("");
    setFile(null);

    if (socket) socket.emit("message:send", res.data.data);
  };

  if (loading) return <div className="chatroom-shell">Loading…</div>;
  if (!chat || !user) return null;

  const otherUser = chat.participants.find(
    (p) => String(p._id) !== String(myId)
  );

  /* =========================
     IMAGE RESOLVER
  ========================= */
  const resolveAvatar = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    if (img.includes("uploads")) {
      const cleaned = img.substring(img.indexOf("uploads")).replace(/\\/g, "/");
      return `${API}/${cleaned}`;
    }
    return null;
  };

  return (
    <div className="chatroom-shell">
      {/* ================= HEADER ================= */}
      <header className="chatroom-header">
        <div className="chatroom-user">
          <div className="chat-avatar">
            {otherUser?.profileImage ? (
              <img src={resolveAvatar(otherUser.profileImage)} alt="" />
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
      <div
        className="chatroom-body"
        ref={chatBodyRef}
        onScroll={() => {
          const el = chatBodyRef.current;
          if (!el) return;

          const nearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 120;

          shouldAutoScroll.current = nearBottom;
        }}
      >
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
                {m.file && m.file.type?.startsWith("image") && (
                  <img
                    src={m.file.url}
                    alt=""
                    className="chat-image"
                  />
                )}

                {m.file && !m.file.type?.startsWith("image") && (
                  <a
                    href={m.file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="chat-file"
                  >
                    📎 {m.file.originalName || "Download file"}
                  </a>
                )}

                {m.text && <div>{m.text}</div>}

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
        <label className="file-btn">
          +
          <input
            type="file"
            hidden
            accept="image/*,.pdf,.doc,.docx,.zip"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

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
