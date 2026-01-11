import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StepContact.css";

const COUNTRY_DATA = [
  { code: "+91", name: "India", flag: "🇮🇳", length: 10 },
  { code: "+1", name: "USA / Canada", flag: "🇺🇸", length: 10 },
  { code: "+44", name: "UK", flag: "🇬🇧", length: 10 },
  { code: "+971", name: "UAE", flag: "🇦🇪", length: 9 },
];

export default function StepContact({ formData, setFormData, onBack }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  /* Ensure default country */
  useEffect(() => {
    if (!formData.countryCode) {
      setFormData((prev) => ({
        ...prev,
        countryCode: COUNTRY_DATA[0].code,
      }));
    }
  }, [formData.countryCode, setFormData]);

  const selectedCountry =
    COUNTRY_DATA.find((c) => c.code === formData.countryCode) ||
    COUNTRY_DATA[0];

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, showEmail: !prev.showEmail }));
  };

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      countryCode: e.target.value,
      phone: "",
    });
    setError("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= selectedCountry.length) {
      setFormData({ ...formData, phone: value });
    }
    setError("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.phone || formData.phone.length !== selectedCountry.length) {
      setError(`Please enter a valid ${selectedCountry.length}-digit mobile number.`);
      return;
    }

    if (!user) {
      setError("You must be logged in to submit the report.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const form = new FormData();

      form.append("itemType", formData.type);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("location", formData.location);
      form.append("landmark", formData.landmark || "");
      form.append("date", formData.date);
      form.append("reward", formData.type === "lost" ? Number(formData.reward) || 0 : 0);
      form.append("contactPhone", `${selectedCountry.code}${formData.phone}`);
      form.append("contactEmail", user.email);
      form.append("displayEmail", Boolean(formData.showEmail));
      form.append("reporter", user._id || user.id);

      if (Array.isArray(formData.images)) {
        formData.images.forEach((img) => {
          if (img?.file) form.append("images", img.file);
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/items/report`,
        form,
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/browse"), 2200);
      }

    } catch (err) {
      console.error("❌ Item submit error:", err);
      setIsSubmitting(false);
      setError(err.response?.data?.error || "Failed to submit report. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="success-container">
        <div className="success-card-premium">
          <div className="check-animated">✓</div>
          <h2>Report Published!</h2>
          <p>Your item is now live. Redirecting you...</p>
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content-wrapper">
      <header className="step-header-text">
        <h3>Contact & Privacy</h3>
        <p>Ensure others can reach you securely to return the item.</p>
      </header>

      <div className="form-main-container">
        <div className={`premium-field ${error ? "error-state" : ""}`}>
          <label>Mobile Number <span className="req">*</span></label>

          <div className="phone-grid-premium">
            <div className="country-select-wrapper">
              <span className="flag-icon">{selectedCountry.flag}</span>
              <select value={selectedCountry.code} onChange={handleCountryChange}>
                {COUNTRY_DATA.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>

            <div className="number-input-wrapper">
              <input
                type="tel"
                placeholder="Enter digits"
                value={formData.phone || ""}
                onChange={handlePhoneChange}
              />
              <span className="count">
                {formData.phone?.length || 0}/{selectedCountry.length}
              </span>
            </div>
          </div>

          {error && <p className="error-text-msg">⚠️ {error}</p>}
        </div>

        <div className="toggle-card-premium" onClick={handleToggle}>
          <div className="toggle-info">
            <h4>Display Email Address</h4>
            <p className="toggle-subtext">
              Publicly show: <span className="highlight-email">{user?.email}</span>
            </p>
          </div>
          <div className={`custom-switch ${formData.showEmail ? "on" : ""}`}>
            <div className="switch-handle"></div>
          </div>
        </div>

        <div className="privacy-pill">
          <span>🔒</span> Your contact details are encrypted and safe.
        </div>
      </div>

      <footer className="step-footer">
        <button className="btn-back-minimal" onClick={onBack} disabled={isSubmitting}>
          Back
        </button>
        <button
          className={`btn-finish-premium ${isSubmitting ? "is-loading" : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Post Listing"}
          {!isSubmitting && <span className="icon-ship">🚀</span>}
        </button>
      </footer>
    </div>
  );
}
