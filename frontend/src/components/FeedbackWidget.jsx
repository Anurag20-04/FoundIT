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

  const canSubmit = rating > 0 || message.trim().length >= 3;

  const submitFeedback = async () => {
    if (!canSubmit || status === "loading") return;

    try {
      setStatus("loading");

      await api.post("/feedback", {
        rating: rating || null,
        message: message.trim() || null,
        page: window.location.pathname,
      });

      setStatus("success");

      setTimeout(() => {
        setOpen(false);
        setRating(0);
        setHover(0);
        setMessage("");
        setStatus("idle");
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      {/* ===== FEEDBACK FAB ===== */}
      <button
        className={`feedback-fab ${theme}`}
        aria-label="Give feedback"
        onClick={() => setOpen(true)}
        type="button"
      >
        {/* Insight / Signal Icon (NOT chat) */}
        <svg
          className="feedback-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M3 17l6-6 4 4 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 4l1.5 3L19 8.5l-3.5 1.5L14 13l-1.5-3L9 8.5l3.5-1.5L14 4z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* ===== MODAL ===== */}
      {open && (
        <div
          className="feedback-overlay"
          onClick={() => status !== "loading" && setOpen(false)}
        >
          <div
            className={`feedback-modal ${theme}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {status === "success" ? (
              <div className="feedback-success">
                <div className="success-ring">
                  <div className="checkmark">✓</div>
                </div>
                <h3>Thank you!</h3>
                <p>Your feedback helps improve FoundIT.</p>
              </div>
            ) : (
              <>
                <h3 className="feedback-title">
                  How was your experience?
                </h3>

                {/* ===== STAR RATING ===== */}
                <div className="rating-row" role="radiogroup">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${
                        (hover || rating) >= star ? "active" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${star} star rating`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* ===== OPTIONAL MESSAGE ===== */}
                <textarea
                  placeholder="Optional — tell us what worked or what didn’t"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {status === "error" && (
                  <p className="feedback-error">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  className="submit-btn"
                  disabled={status === "loading" || !canSubmit}
                  onClick={submitFeedback}
                >
                  {status === "loading"
                    ? "Sending…"
                    : "Submit Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
