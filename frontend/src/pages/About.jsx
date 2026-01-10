import { useEffect } from "react";
import "./About.css";

export default function About({ theme }) {
  /* =======================
     THEME SYNC (same as BrowseItems)
  ======================= */
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "dark-mode" : "light-mode";
  }, [theme]);

  return (
    <div className={`about-page ${theme}`}>
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About FoundIT</h1>
          <p>
            FoundIT is a modern lost & found platform built to help people
            recover lost belongings, reconnect items with their owners, and
            create a safer, more responsible community.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Every day, thousands of people lose valuable belongings — documents,
          electronics, keys, pets, and personal items. FoundIT exists to bridge
          the gap between people who lose items and people who find them.
        </p>
        <p>
          Our mission is simple: <strong>reduce permanent loss</strong>, improve
          recovery chances, and build a transparent system that people can
          trust.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="about-section about-cards">
        <h2>How FoundIT Works</h2>

        <div className="about-grid">
          <div className="about-card">
            <h3>📢 Report</h3>
            <p>
              Users report lost or found items with detailed descriptions,
              images, and locations.
            </p>
          </div>

          <div className="about-card">
            <h3>🔍 Match</h3>
            <p>
              Our system intelligently connects lost reports with found items to
              increase recovery success.
            </p>
          </div>

          <div className="about-card">
            <h3>🤝 Reconnect</h3>
            <p>
              Owners and finders are securely notified and guided to reunite
              items safely.
            </p>
          </div>

          <div className="about-card">
            <h3>🔐 Protect</h3>
            <p>
              We focus on identity protection, fraud prevention, and verified
              user flows.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="about-section about-highlight">
        <h2>Trust & Safety</h2>
        <ul>
          <li>✔ Secure authentication & verified email system</li>
          <li>✔ User-controlled profiles and recovery process</li>
          <li>✔ Image-based item identification</li>
          <li>✔ Scalable infrastructure for real-world growth</li>
        </ul>
      </section>

      {/* VISION */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          We envision FoundIT as a national-level recovery network — integrated
          with institutions, public spaces, and communities — where losing an
          item does not mean losing it forever.
        </p>
      </section>
    </div>
  );
}
