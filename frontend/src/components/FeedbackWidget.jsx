import { useState } from "react";
import api from "../utils/axios";
import "./FeedbackWidget.css";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submitFeedback = async () => {
    if (!rating && message.trim().length < 3) return;

    try {
      setLoading(true);

      await api.post("/feedback", {
        rating,
        message: message.trim() || null,
        page: window.location.pathname,
      });

      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setRating(null);
        setMessage("");
      }, 1800);

    } catch (err) {
      console.error("Feedback failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="feedback-fab" onClick={() => setOpen(true)}>
        💬 Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="feedback-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="feedback-success">
                ✅ Thanks for your feedback!
              </div>
            ) : (
              <>
                <h3>How was your experience?</h3>

                {/* Rating */}
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={rating >= n ? "star active" : "star"}
                      onClick={() => setRating(n)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  placeholder="Tell us what worked or what didn’t…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  className="submit-btn"
                  onClick={submitFeedback}
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Submit"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
