import React, { useState, useEffect } from "react";
import "./StepPhotos.css";

const MAX_IMAGES = 5;

export default function StepPhotos({ formData, setFormData, onNext, onBack }) {
  const [isDragging, setIsDragging] = useState(false);
  const images = formData.images || [];

  /* =========================
     CLEAN UP OBJECT URLS
  ========================= */
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const processFiles = (files) => {
    const validImages = files.filter(file => file.type.startsWith("image/"));

    if (images.length + validImages.length > MAX_IMAGES) return;

    const newImages = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData({
      ...formData,
      images: [...images, ...newImages],
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeImage = (index) => {
    const updated = [...images];

    if (updated[index]?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(updated[index].preview);
    }

    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  return (
    <div className="step-content-wrapper">
      <header className="step-header-text">
        <h3>Visual Proof</h3>
        <p>
          Items with clear photos are returned <strong>70% faster</strong>. 
          Max {MAX_IMAGES} photos.
        </p>
      </header>

      <div className="form-main-container">
        <div className={`photo-upload-grid ${images.length === 0 ? "empty" : ""}`}>
          {images.map((img, idx) => (
            <div key={idx} className="photo-premium-card">
              <img src={img.preview} alt="item-preview" />
              <button
                type="button"
                className="delete-overlay"
                onClick={() => removeImage(idx)}
                aria-label="Remove image"
              >
                <span className="trash-icon">🗑️</span>
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label
              className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileChange}
              />
              <div className="dropzone-content">
                <div className="upload-circle">
                  <span className="plus-icon">＋</span>
                </div>
                <div className="dropzone-text">
                  <p>Drop or Click</p>
                  <span>{MAX_IMAGES - images.length} slots left</span>
                </div>
              </div>
            </label>
          )}
        </div>

        {images.length > 0 && (
          <div className="photo-info-bar">
            <span className="count-pill">
              {images.length} / {MAX_IMAGES} Photos
            </span>
            <p>High quality images help in verification</p>
          </div>
        )}
      </div>

      <footer className="step-footer">
        <button className="btn-back-text" onClick={onBack}>Back</button>
        <button className="btn-premium-continue" onClick={onNext}>
          {images.length === 0 ? "Skip for now" : "Continue"} <span className="arrow">→</span>
        </button>
      </footer>
    </div>
  );
}
