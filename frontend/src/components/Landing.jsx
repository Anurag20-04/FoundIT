// React hooks MUST be imported explicitly
import React, { useEffect, useState } from "react";
import "./Landing.css";

/**
 * Landing page component
 * Acts as the main body of the home page
 */
export default function Landing({ theme = "light" }) {
  // Controls slide-in animation on mount
  const [show, setShow] = useState(false);

  // Run once when component mounts
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <main className={`landing ${theme} ${show ? "show" : ""}`}>
      
      {/* HERO SECTION */}
      <section className="hero slide">
        <h1>
          Lost something?
          <br />
          <span>Find it. Fast.</span>
        </h1>

        <p>
          FindIT helps people reunite with their lost belongings using a
          simple, secure, community-driven platform.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">
            Report Lost Item
          </button>
          <button className="secondary-btn">
            Browse Found Items
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features slide delay">
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
