import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./ItemDetail.css";

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/items/${id}`
        );
        if (mounted) setItem(res.data.data);
      } catch (err) {
        console.error("Failed to fetch item", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchItem();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* ---------------- THEME-SAFE LOADER ---------------- */
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
  const isClaimed = Boolean(item.claimedBy);

  /* ---------------- ACTION HANDLERS ---------------- */

  const handleClaim = async () => {
    if (!user) return navigate("/login");
    if (isClaimed || claiming) return;

    setClaiming(true);
    try {
      const claimRes = await axios.post(
        "http://localhost:5000/api/claims",
        {
          itemId: item._id,
          claimantId: userId,
          claimType: item.itemType === "lost" ? "FOUND" : "OWNERSHIP",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const claimId = claimRes.data.data._id;

      await axios.post(
        "http://localhost:5000/api/notifications",
        {
          recipientId: ownerId,
          senderId: userId,
          type: "CLAIM",
          itemId: item._id,
          claimId,
          message:
            item.itemType === "lost"
              ? "Someone claims they found your item."
              : "Someone claims ownership of this item.",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/chat/claim/${claimId}`);
    } catch {
      alert("Unable to submit claim.");
    } finally {
      setClaiming(false);
    }
  };

  const handleReport = async () => {
    if (!user) return navigate("/login");

    try {
      await axios.post(
        "http://localhost:5000/api/reports",
        {
          targetType: "ITEM",
          targetId: item._id,
          reason: "Reported by user",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Item reported successfully.");
    } catch {
      alert("Failed to report item.");
    }
  };

  const images = Array.isArray(item.images) ? item.images : [];

  return (
    <div className="detail-page-wrapper">
      <div className="detail-container-premium">
        {/* LEFT — IMAGES */}
        <div className="detail-visuals">
          <div className="main-image-frame">
            {images[activeImage] && (
              <img
                src={`http://localhost:5000/${images[
                  activeImage
                ].replace(/\\/g, "/")}`}
                alt={item.title}
              />
            )}

            <div className="status-badge">{item.itemType}</div>

            {item.reward > 0 && (
              <div className="reward-tag">₹{item.reward} Reward</div>
            )}

            {isClaimed && (
              <div className="claimed-overlay">CLAIMED</div>
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
                    src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
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

          <div className="description-box">{item.description}</div>

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
          {isOwner ? (
            <div className="status-info">This is your listing</div>
          ) : isClaimed ? (
            <div className="status-info claimed">
              Claim already submitted
            </div>
          ) : (
            <button
              className="btn-main-action"
              onClick={handleClaim}
              disabled={claiming}
            >
              {item.itemType === "lost"
                ? "I Found This"
                : "This Is Mine"}
            </button>
          )}

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

