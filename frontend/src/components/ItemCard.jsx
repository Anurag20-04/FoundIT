import { useNavigate } from "react-router-dom";

export default function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="item-card"
      onClick={() => navigate(`/item/${item.id}`)}
    >
      <div className="item-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>

      <span className={`status-tag ${item.status.toLowerCase()}`}>
        {item.status}
      </span>

      <h3>{item.name}</h3>
    </div>
  );
}
