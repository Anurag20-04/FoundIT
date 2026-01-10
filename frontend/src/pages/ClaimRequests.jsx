import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ClaimRequests.css";

const API = "http://localhost:5000";

export default function ClaimRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${API}/api/claims/received`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      setClaims(res.data.data || []);
    } catch (err) {
      console.error("Failed to load claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchClaims();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `${API}/api/claims/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      fetchClaims();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `${API}/api/claims/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      fetchClaims();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  if (loading) {
    return <div className="claim-requests-page">Loading requests…</div>;
  }

  return (
    <div className="claim-requests-page">
      <div className="claim-requests-shell">
        <h1>Claim Requests</h1>
        <p className="subtitle">People who claimed your items</p>

        {claims.length === 0 ? (
          <div className="empty-claims">No claim requests yet.</div>
        ) : (
          <div className="claims-grid">
            {claims.map((c) => (
              <div key={c._id} className="claim-card">
                <div className="claim-user">
                  <img
                    src={
                      c.claimant?.profileImage
                        ? `${API}${c.claimant.profileImage}`
                        : "/avatar.png"
                    }
                    alt=""
                  />
                  <div>
                    <h4>{c.claimant?.name || "User"}</h4>
                    <span>{c.claimant?.email}</span>
                  </div>
                </div>

                <div className="claim-item">
                  <strong>{c.item?.title}</strong>
                  <span>{c.item?.location}</span>
                </div>

                <div className={`claim-status ${c.status}`}>
                  {c.status}
                </div>

                {c.status === "pending" ? (
                  <div className="claim-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(c._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(c._id)}
                    >
                      Reject
                    </button>
                  </div>
                ) : c.status === "approved" ? (
                  <button
                    className="chat-btn"
                    onClick={() => navigate(`/chat/${c.chat}`)}
                  >
                    Open chat
                  </button>
                ) : (
                  <div className="claim-closed">Rejected</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
