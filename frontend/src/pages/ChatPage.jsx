import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "./ChatPage.css";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    socket.emit("join_chat", receiverId);
    
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [receiverId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgData = { text: input, sender: "me", time: new Date() };
    socket.emit("send_message", { receiverId, ...msgData });
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  return (
    <div className="chat-interface-premium">
      <div className="chat-header">
        <div className="user-info">
          <div className="avatar">JD</div>
          <div>
            <h4>Chatting with Reporter</h4>
            <span className="online-status">Online</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-header">🚫 Block</button>
          <button className="btn-header danger">🚩 Report</button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((m, i) => (
          <div key={i} className={`message-bubble ${m.sender === "me" ? "sent" : "received"}`}>
            <p>{m.text}</p>
            <span className="msg-time">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="chat-input-area">
        <button className="attach-btn">📎</button>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>Send ✈️</button>
      </div>
    </div>
  );
}