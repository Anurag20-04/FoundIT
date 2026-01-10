import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./ItemDetail.css";

const API = "http://localhost:5000";

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* ===============================
     FETCH ITEM + USER CLAIM
  =============================== */
  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItem(res.data.data);

      if (user) {
        const claimRes = await axios.get(
          `${API}/api/claims/item/${id}/mine`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        setClaim(claimRes.data.data);
      }
    } catch (err) {
      console.error("Failed to load item", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id, user]);

  /* ===============================
     CLAIM HANDLER
  =============================== */
  const handleClaim = async () => {
    if (!user) {
      localStorage.setItem("postLoginAction", "CLAIM_ITEM");
      localStorage.setItem("postLoginItemId", item._id);
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    if (submitting || claim) return;

    try {
      setSubmitting(true);

      await axios.post(
        `${API}/api/claims`,
        {
          itemId: item._id,
          ownerId: item.reporter,
          claimType: item.itemType === "lost" ? "FOUND" : "OWNERSHIP",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      await fetchAll();
    } catch (err) {
      console.error("Claim failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     REPORT
  =============================== */
  const handleReport = async () => {
    if (!user) return navigate("/login");

    try {
      await axios.post(
        `${API}/api/reports`,
        {
          targetType: "ITEM",
          targetId: item._id,
          reason: "Reported by user",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  /* ===============================
     LOAD STATES
  =============================== */
  if (loading) {
    return (
      <div className="detail-page-wrapper">
        <div className="loader">Loading item…</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-page-wrapper">
        <div className="loader error">Item not found</div>
      </div>
    );
  }

  const userId = user?._id || user?.id;
  const ownerId = item.reporter?._id || item.reporter;
  const isOwner = userId === ownerId;
  const images = Array.isArray(item.images) ? item.images : [];

  /* ===============================
     ACTION STATE MACHINE
  =============================== */

  let actionUI = null;

  if (!user) {
    actionUI = (
      <button className="btn-main-action" onClick={handleClaim}>
        Log in to claim
      </button>
    );
  } else if (isOwner) {
    actionUI = (
      <div className="status-info owner">This is your listing</div>
    );
  } else if (!claim) {
    actionUI = (
      <button
        className="btn-main-action"
        onClick={handleClaim}
        disabled={submitting}
      >
        {submitting
          ? "Sending request…"
          : item.itemType === "lost"
          ? "I Found This"
          : "This Is Mine"}
      </button>
    );
  } else if (claim.status === "pending") {
    actionUI = (
      <div className="status-info waiting">
        Request sent · Waiting for approval
      </div>
    );
  } else if (claim.status === "rejected") {
    actionUI = (
      <div className="status-info rejected">
        Your request was declined
      </div>
    );
  } else if (claim.status === "approved") {
    actionUI = (
      <button
        className="btn-main-action success"
        onClick={() => navigate(`/chat/${claim.chat}`)}
      >
        Open chat
      </button>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div className="detail-page-wrapper">
      <div className="detail-container-premium">
        {/* LEFT — IMAGES */}
        <div className="detail-visuals">
          <div className="main-image-frame">
            {images[activeImage] && (
              <img
                src={`${API}/${images[activeImage].replace(/\\/g, "/")}`}
                alt={item.title}
              />
            )}

            <div className="status-badge">{item.itemType}</div>

            {item.reward > 0 && (
              <div className="reward-tag">₹{item.reward} Reward</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${
                    activeImage === idx ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img
                    src={`${API}/${img.replace(/\\/g, "/")}`}
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — INFO */}
        <div className="detail-info-panel">
          <header className="info-header">
            <span className="category-pill">{item.category}</span>
            <h1>{item.title}</h1>
            <div className="meta-row">
              <span>📍 {item.location}</span>
              <span>
                🕒 {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
          </header>

          <div className="description-box">
            {item.description}
          </div>

          <div className="contact-card-premium">
            <div className="card-header">Protected Contact</div>
            <p className="shield-note">
              Contact details unlock after claim approval.
            </p>
            <div className="masked-data">
              <div>📧 u***@gmail.com</div>
              <div>📞 +91 XXX-XXXX</div>
            </div>
          </div>

          {/* ACTION STATE */}
          {actionUI}

          <div className="utility-bar">
            <button
              className="util-btn"
              onClick={() =>
                navigator.share?.({
                  title: item.title,
                  url: window.location.href,
                })
              }
            >
              Share
            </button>
            <button className="util-btn" onClick={handleReport}>
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
