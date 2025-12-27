import React from "react";
import "./StepType.css";

const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "pets", label: "Pets", icon: "🐕" },
  { id: "bags", label: "Bags", icon: "🎒" },
  { id: "documents", label: "Documents", icon: "📄" },
  { id: "jewelry", label: "Jewelry", icon: "💍" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "keys", label: "Keys", icon: "🔑" },
  { id: "other", label: "Other", icon: "📦" },
];

export default function StepType({ formData, setFormData, onNext }) {
  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,        // ALWAYS "lost" or "found"
      reward: "",  // reset reward safely
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  // Disable continue until required fields are picked
  const canContinue = Boolean(formData.type && formData.category);

  return (
    <div className="step-content-wrapper">
      {/* --- Section 1: Type Selection --- */}
      <div className="selection-group">
        <h3 className="group-title">What happened?</h3>

        <div className="type-grid">
          <div
            className={`type-card lost ${
              formData.type === "lost" ? "active" : ""
            }`}
            onClick={() => handleTypeSelect("lost")}
          >
            <div className="type-icon-circle">
              <span className="icon">📍</span>
            </div>
            <div className="type-info">
              <h4>I Lost Something</h4>
              <p>Report a lost item</p>
            </div>
          </div>

          <div
            className={`type-card found ${
              formData.type === "found" ? "active" : ""
            }`}
            onClick={() => handleTypeSelect("found")}
          >
            <div className="type-icon-circle plus-bg">
              <span className="icon">+</span>
            </div>
            <div className="type-info">
              <h4>I Found Something</h4>
              <p>Report a found item</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Category Selection --- */}
      <div className="selection-group">
        <h3 className="group-title">Select Category</h3>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${
                formData.category === cat.id ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              <span className="cat-emoji">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Footer Navigation --- */}
      <footer className="step-footer">
        <button className="btn-back-text" disabled>
          Back
        </button>

        <button
          className="btn-premium-continue"
          onClick={onNext}
          disabled={!canContinue}
        >
          Continue <span className="arrow">→</span>
        </button>
      </footer>
    </div>
  );
}
