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

  const [socket, setSocket] = useState(null);

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const myId = user?._id || user?.id;

  /* =========================
     SOCKET BIND
  ========================= */
  useEffect(() => {
    if (user) {
      setSocket(getSocket());
    }
  }, [user]);

  /* =========================
     FETCH CHAT
  ========================= */
  const fetchChat = async () => {
    try {
      const res = await axios.get(`${API}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      setChat(res.data.data.chat);
      setMessages(res.data.data.messages);
    } catch (err) {
      console.error("Failed to fetch chat:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     JOIN / LEAVE CHAT
  ========================= */
  useEffect(() => {
    if (!socket || !myId || !chatId) return;

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

    socket.emit("chat:join", { chatId });
    socket.emit("unread:update", { targetUserId: myId });

    return () => {
      socket.emit("chat:leave", { chatId });
    };
  }, [chatId, socket, myId]);

  /* =========================
     REALTIME RECEIVE
  ========================= */
  useEffect(() => {
    if (!socket || !myId) return;

    socket.off("message:new");
    socket.off("typing:start");
    socket.off("typing:stop");

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
  }, [chatId, socket, myId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  /* =========================
     SEND MESSAGE (TEXT + IMAGE)
  ========================= */
  const sendMessage = async () => {
    if ((!text.trim() && !image) || !socket) return;

    socket.emit("typing:stop", { chatId });

    try {
      const form = new FormData();
      form.append("text", text);
      if (image) form.append("image", image);

      const res = await axios.post(
        `${API}/api/chats/${chatId}/message`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      
      

      setText("");
      setImage(null);
      setPreview(null);
      document.getElementById("chat-image-input").value = "";

    } catch (err) {
      console.error("Send message failed:", err);
    }
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
    return `${API}/${img}`;
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
                {m.text && <div>{m.text}</div>}

                {m.attachments?.map((a, i) =>
                  a.type === "image" ? (
                    <img key={i} src={a.url} className="chat-image" alt="" />
                  ) : null
                )}

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

        {preview && (
          <div className="msg me">
            <div className="bubble">
              <img src={preview} className="chat-image" alt="" />
            </div>
          </div>
        )}

        {typingUser && (
          <div className="typing-indicator">
            <span className="typing-name">
              {otherUser?.name || "Someone"}
            </span>
            <span> is typing</span>
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
          type="file"
          id="chat-image-input"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        <label htmlFor="chat-image-input" className="file-btn">📎</label>

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (socket) {
              socket.emit("typing:start", { chatId });

              clearTimeout(typingTimer.current);
              typingTimer.current = setTimeout(() => {
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
