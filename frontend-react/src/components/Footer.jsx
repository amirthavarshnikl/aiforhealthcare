import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/logo.jpg" alt="ReportEase" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <span className="footer-logo-text">ReportEase</span>
          </div>
          <p className="footer-description">
            Smart medical report analysis powered by AI
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it Works</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p className="footer-contact">
            Email: support@reportease.com<br/>
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {currentYear} ReportEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
