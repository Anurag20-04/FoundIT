import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-left">
          <div className="footer-brand">
            <strong>FoundIT</strong>
            <span className="footer-dot">•</span>
            <span className="footer-tagline">Lost & Found, reimagined</span>
          </div>
          <p className="footer-desc">
            Helping people reconnect with what matters. Secure, fast and community-driven.
          </p>
          <span className="footer-copy">
            © {new Date().getFullYear()} FoundIT. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="footer-right">
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
