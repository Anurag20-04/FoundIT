import React from "react";
import SphereBackground from "./SphereBackground";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing({ theme = "dark" }) {
  return (
    <main className={`landing ${theme}`}>
      <section className="hero-wrapper">

        {/* BACKGROUND ORB */}
        <div className="orb-container">
          <SphereBackground />
        </div>

        {/* FOREGROUND CONTENT */}
        <div className="hero">
          <h1>
            Lost something?
            <br />
            <span>Find it. Fast.</span>
          </h1>

          <p>
            FoundIT helps people reunite with their lost belongings using a
            secure, community-driven platform.
          </p>

          <div className="hero-actions">
            {/*  REPORT ITEM → FULL MULTI-STEP FLOW */}
            <Link to="/report" className="primary-btn">
              Report Item
            </Link>

            <Link to="/browse" className="secondary-btn">
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>Report</h3>
          <p>Post lost or found items with essential details.</p>
        </div>
        <div className="feature-card">
          <h3>Search</h3>
          <p>Browse items by location, category, and date.</p>
        </div>
        <div className="feature-card">
          <h3>Reconnect</h3>
          <p>Safely connect owners with found items.</p>
        </div>
      </section>
    </main>
  );
}
