import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./StepLocation.css";

// Fix for default Leaflet icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Search Logic inside Map
function SearchField() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      searchLabel: 'Search area...',
      keepResult: true
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

export default function StepLocation({ formData, setFormData, onNext, onBack }) {
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError("");
  };

  const getAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const cleanAddress = data.display_name.split(',').slice(0, 3).join(',');
      handleInputChange("location", cleanAddress);
      setFormData(prev => ({ ...prev, coords: [lat, lng] }));
    } catch (err) {
      handleInputChange("location", `Pinned: ${lat.toFixed(3)}, ${lng.toFixed(3)}`);
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) { getAddress(e.latlng.lat, e.latlng.lng); },
    });
    return formData.coords ? <Marker position={formData.coords} /> : null;
  }

  return (
    <div className="step-content-wrapper">
      <div className="form-main-container">
        
        {/* Map Section */}
        <div className="map-wrapper-premium">
          <MapContainer 
            center={formData.coords || [20.5937, 78.9629]} 
            zoom={formData.coords ? 15 : 5} 
            className="leaflet-container-actual"
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <SearchField />
            <LocationMarker />
          </MapContainer>
          <div className="map-hint-badge">Search or tap map to pin</div>
        </div>

        {/* Location Input */}
        <div className={`premium-field ${error ? "error" : ""}`}>
          <label>Location / Area <span className="req">*</span></label>
          <div className="input-wrapper">
            <span className="input-icon">📍</span>
            <input
              type="text"
              placeholder="Select on map or type here..."
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
          {error && <p className="err-msg">{error}</p>}
        </div>

        {/* Landmark & Date Grid */}
        <div className="location-grid-row">
          <div className="premium-field">
            <label>Nearby Landmark</label>
            <div className="input-wrapper">
              <span className="input-icon">🏛️</span>
              <input
                type="text"
                placeholder="e.g. Near Metro Stn"
                value={formData.landmark || ""}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
              />
            </div>
          </div>

          <div className="premium-field">
            <label>Date {formData.type === "Found" ? "Found" : "Last Seen"}</label>
            <div className="input-wrapper">
              <input
                type="date"
                className="date-input-premium"
                max={today}
                value={formData.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="step-footer">
        <button className="btn-back-text" onClick={onBack}>Back</button>
        <button className="btn-premium-continue" onClick={() => formData.location?.length > 4 ? onNext() : setError("Location is required")}>
          Continue <span className="arrow">→</span>
        </button>
      </footer>
    </div>
  );
}