import { useState, useEffect } from "react";
import api from "../utils/axios";
import "./FeedbackWidget.css";

export default function FeedbackWidget({ theme }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  // idle | loading | success | error

  /* =========================
     ESC KEY CLOSE
  ========================= */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && open && status !== "success") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, status]);

  /* =========================
     SUBMIT
  ========================= */
  const submitFeedback = async () => {
    if (message.trim().length < 3 || status !== "idle") return;

    try {
      setStatus("loading");

      await api.post("/feedback", {
        rating: rating || null,
        message: message.trim(),
        page: window.location.pathname,
      });

      setStatus("success");

      setTimeout(() => {
        setOpen(false);
        setMessage("");
        setRating(0);
        setHover(0);
        setStatus("idle");
      }, 1600);

    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      {/* ================= FLOATING ACTION BUTTON ================= */}
      <button
        className={`feedback-fab premium ${theme}`}
        onClick={() => setOpen(true)}
        aria-label="Open feedback"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </button>

      {/* ================= MODAL ================= */}
      {open && (
        <div
          className="feedback-overlay"
          onClick={() => status !== "success" && setOpen(false)}
        >
          <div
            className={`feedback-modal premium ${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== SUCCESS ===== */}
            {status === "success" ? (
              <div className="feedback-success">
                <div className="success-ring">
                  <span className="checkmark">✓</span>
                </div>
                <h3>Thank you</h3>
                <p>We genuinely read every piece of feedback.</p>
              </div>
            ) : (
              <>
                <h3 className="feedback-title">How was your experience?</h3>

                {/* ===== STAR RATING ===== */}
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star ${
                        (hover || rating) >= star ? "active" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p className="rating-hint">
                  {rating
                    ? `You selected ${rating} star${rating > 1 ? "s" : ""}`
                    : "Optional rating"}
                </p>

                {/* ===== MESSAGE ===== */}
                <textarea
                  autoFocus
                  placeholder="Tell us what worked, what didn’t, or what you'd love to see next."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* ===== ERROR ===== */}
                {status === "error" && (
                  <p className="feedback-error">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* ===== SUBMIT ===== */}
                <button
                  className="submit-btn premium"
                  disabled={status !== "idle" || message.length < 3}
                  onClick={submitFeedback}
                >
                  {status === "loading" ? "Sending…" : "Send Feedback"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
