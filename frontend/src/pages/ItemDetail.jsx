import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ClaimModal from "../components/ClaimModal";
import { getItemById } from "../services/itemService";
import "./ItemDetail.css";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    getItemById(id).then(setItem);
  }, [id]);

  if (!item) return <div className="loading">Loading...</div>;

  return (
    <div className="item-detail-page">
      <img src={item.image} alt={item.name} className="detail-image" />

      <span className={`status-tag ${item.status.toLowerCase()}`}>
        {item.status}
      </span>

      <h1>{item.name}</h1>
      <p>{item.description}</p>

      <div className="action-box">
        {item.status === "Lost" ? (
          <button onClick={() => setShowClaim(true)}>
            I Found This Item
          </button>
        ) : (
          <button onClick={() => setShowClaim(true)}>
            This Is My Item
          </button>
        )}
      </div>

      {showClaim && (
        <ClaimModal
          itemId={item.id}
          onClose={() => setShowClaim(false)}
        />
      )}
    </div>
  );
}
