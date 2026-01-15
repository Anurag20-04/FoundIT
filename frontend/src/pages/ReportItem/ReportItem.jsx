import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import StepType from "./StepType";
import StepDetails from "./StepDetails";
import StepLocation from "./StepLocation";
import StepPhotos from "./StepPhotos";
import StepContact from "./StepContact";

import "./ReportItem.css";

export default function ReportItem({ theme, requireLogin }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 5;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================================
     FORM STATE
  ========================================================= */
  const [formData, setFormData] = useState({
    type: "", // 'lost' or 'found'
    title: "",
    description: "",
    category: "",
    location: "",
    reward: "",
    phone: "",
    showEmail: false,
    images: [],
  });

  /* =========================================================
      REMOVE REWARD FOR FOUND ITEMS
  ========================================================= */
  useEffect(() => {
    if (formData.type === "found" && formData.reward) {
      setFormData((prev) => ({ ...prev, reward: "" }));
    }
  }, [formData.type]);

  /* =========================================================
      LOGIN GUARD
  ========================================================= */
  useEffect(() => {
    if (!loading && !user) {
      requireLogin();
    }
  }, [loading, user, requireLogin]);

  if (loading || !user) return null;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className={`report-page-wrapper ${theme}`}>
      <div className="report-container">
        <header className="report-header">
          <h1>
            Report {formData.type === "found" ? "Found" : "Lost"}{" "}
            <span className="highlight">Item</span>
          </h1>
          <p>Fill in the details to help reunite items with their owners.</p>

          <div className="stepper-container">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`stepper-bar ${step > i ? "completed" : ""} ${
                  step === i + 1 ? "active" : ""
                }`}
              />
            ))}
          </div>
        </header>

        <main className="report-card">
          <div className="step-content-animator" key={step}>
            {step === 1 && (
              <StepType
                formData={formData}
                setFormData={setFormData}
                onNext={next}
              />
            )}

            {step === 2 && (
              <StepDetails
                formData={formData}
                setFormData={setFormData}
                onNext={next}
                onBack={prev}
                /* reward field hidden internally if type === 'found' */
              />
            )}

            {step === 3 && (
              <StepLocation
                formData={formData}
                setFormData={setFormData}
                onNext={next}
                onBack={prev}
              />
            )}

            {step === 4 && (
              <StepPhotos
                formData={formData}
                setFormData={setFormData}
                onNext={next}
                onBack={prev}
              />
            )}

            {step === 5 && (
              <StepContact
                formData={formData}
                setFormData={setFormData}
                onBack={prev}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
