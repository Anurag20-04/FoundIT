import React, { useState } from "react";
import "./StepDetails.css";

export default function StepDetails({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = "Title too short";
    }

    if (!formData.description || formData.description.trim().length < 15) {
      newErrors.description = "More details needed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isLost = formData.type === "lost";

  return (
    <div className="step-content-wrapper">
      <div className="form-main-container">
        
        {/* Item Title */}
        <div className={`premium-field ${errors.title ? "error" : ""}`}>
          <label>
            What is the item? <span className="req">*</span>
          </label>
          <div className="input-wrapper">
            <span className="input-icon">🏷️</span>
            <input
              type="text"
              placeholder="e.g. Vintage Leather Wallet"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          {errors.title && <p className="err-msg">{errors.title}</p>}
        </div>

        {/* Brand & Color */}
        <div className="attributes-responsive-grid">
          <div className="premium-field">
            <label>Brand</label>
            <div className="input-wrapper">
              <span className="input-icon">✨</span>
              <input
                type="text"
                placeholder="Brand name"
                value={formData.brand || ""}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </div>
          </div>

          <div className="premium-field">
            <label>Color</label>
            <div className="input-wrapper">
              <span className="input-icon">🎨</span>
              <input
                type="text"
                placeholder="Primary color"
                value={formData.color || ""}
                onChange={(e) => handleInputChange("color", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`premium-field ${errors.description ? "error" : ""}`}>
          <label>
            Distinctive Features <span className="req">*</span>
          </label>
          <div className="input-wrapper">
            <textarea
              placeholder="Scratches, serial numbers, or unique stickers..."
              value={formData.description || ""}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
            />
          </div>
          {errors.description && (
            <p className="err-msg">{errors.description}</p>
          )}
        </div>

        {/* 💰 REWARD — ONLY FOR LOST ITEMS */}
        {isLost && (
          <div className="reward-card-premium">
            <div className="reward-info">
              <h4>Offer a Reward?</h4>
              <p>Help motivate the finder to return your item safely.</p>
            </div>

            <div className="reward-input-box">
              <span className="currency-label">₹</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                onKeyDown={(e) =>
                  ["-", "e", "E", "+"].includes(e.key) &&
                  e.preventDefault()
                }
                placeholder="0.00"
                value={formData.reward || ""}
                onChange={(e) =>
                  handleInputChange(
                    "reward",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        )}
      </div>

      <footer className="step-footer">
        <button className="btn-back-text" onClick={onBack}>
          Back
        </button>

        <button
          className="btn-premium-continue"
          onClick={() => validate() && onNext()}
        >
          Continue <span className="arrow">→</span>
        </button>
      </footer>
    </div>
  );
}
