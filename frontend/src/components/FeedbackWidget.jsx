import { useState } from "react";
import api from "../utils/axios";
import "./FeedbackWidget.css";

export default function FeedbackWidget({ theme }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); 
  // idle | loading | success | error

  const submitFeedback = async () => {
    if (message.trim().length < 3) return;

    try {
      setStatus("loading");

      await api.post("/feedback", {
        rating: rating || null,
        message,
        page: window.location.pathname,
      });

      setStatus("success");

      setTimeout(() => {
        setOpen(false);
        setMessage("");
        setRating(0);
        setHover(0);
        setStatus("idle");
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`feedback-fab ${theme}`}
        onClick={() => setOpen(true)}
      >
        💬 Feedback
      </button>

      {open && (
        <div className="feedback-overlay" onClick={() => setOpen(false)}>
          <div
            className={`feedback-modal ${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            {status === "success" ? (
              <div className="feedback-success">
                <div className="checkmark">✓</div>
                <h3>Thank you!</h3>
                <p>Your feedback helps us improve FoundIT.</p>
              </div>
            ) : (
              <>
                <h3 className="feedback-title">Share your experience</h3>

                {/* STAR RATING */}
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star ${
                        (hover || rating) >= star ? "active" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* TEXT */}
                <textarea
                  placeholder="What did you like? What felt broken?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* STATUS */}
                {status === "error" && (
                  <p className="feedback-error">
                    Something went wrong. Try again.
                  </p>
                )}

                <button
                  className="submit-btn"
                  disabled={status === "loading" || message.length < 3}
                  onClick={submitFeedback}
                >
                  {status === "loading" ? "Sending..." : "Send Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
