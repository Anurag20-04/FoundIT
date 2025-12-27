import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BrowseItems.css";

const CATEGORIES = [
  "All",
  "Electronics",
  "Pets",
  "Bags",
  "Documents",
  "Jewelry",
  "Clothing",
  "Keys",
  "Other",
];

const BACKEND_URL = "http://localhost:5000";

export default function BrowseItems({ theme }) {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =======================
     THEME SYNC
  ======================= */
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);

  /* =======================
     FETCH ITEMS
  ======================= */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/items`);
        if (res.data?.success) {
          setItems(
            res.data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
        }
      } catch (err) {
        console.error("Fetch items error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  /* =======================
     IMAGE RESOLVER (FIXED)
  ======================= */
  const resolveImage = (path) => {
    if (!path) return "/no-image.png";

    // Handle absolute Windows paths saved in DB
    if (path.includes("uploads")) {
      const cleanedPath = path
        .substring(path.indexOf("uploads"))
        .replace(/\\/g, "/");
      return `${BACKEND_URL}/${cleanedPath}`;
    }

    // Already full URL or base64
    if (path.startsWith("http") || path.startsWith("data:")) {
      return path;
    }

    return "/no-image.png";
  };

  /* =======================
     FILTER LOGIC
  ======================= */
  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        (item.title || "").toLowerCase().includes(query) ||
        (item.location || "").toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        (item.category || "").toLowerCase() ===
          activeCategory.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        (item.itemType || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, activeCategory, statusFilter]);

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p>Loading items…</p>
      </div>
    );
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className={`browse-page-wrapper ${theme}`}>
      <div className="browse-shell">
        <header className="browse-header">
          <h1>
            Browse <span className="highlight">Items</span>
          </h1>
          <p>Live feed of lost and found belongings.</p>
        </header>

        <section className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="clear-btn"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="status-filter">
            {["All", "Lost", "Found"].map((status) => (
              <button
                key={status}
                className={statusFilter === status ? "active" : ""}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "cat-active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <main className="items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const imageSrc =
                Array.isArray(item.images) && item.images.length > 0
                  ? resolveImage(item.images[0])
                  : "/no-image.png";

              return (
                <div
                  key={item._id}
                  className="item-card-premium"
                  onClick={() => navigate(`/item/${item._id}`)}
                >
                  <div className="card-img-wrapper">
                    <img
                      src={imageSrc}
                      alt={item.title}
                      crossOrigin="anonymous"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/no-image.png";
                      }}
                    />

                    <span
                      className={`status-pill ${item.itemType?.toLowerCase()}`}
                    >
                      {item.itemType?.toUpperCase()}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="card-top">
                      <span className="card-cat">{item.category}</span>
                      <span className="card-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3>{item.title}</h3>

                    <div className="card-loc">📍 {item.location}</div>

                    {item.itemType?.toLowerCase() === "lost" &&
                      Number(item.reward) > 0 && (
                        <div className="card-reward">
                          💰 Reward: ₹{item.reward}
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <h2>No items found</h2>
              <button
                className="btn-reset"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setStatusFilter("All");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
