import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/summary-navbar.css';

export default function SummaryNavbar() {
  const [navLinksOpen, setNavLinksOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: 'Welcome back' });

  const toggleNav = () => setNavLinksOpen(!navLinksOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const closeAllMenus = () => {
    setNavLinksOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="summary-navbar">
      <Link to="/" className="logo" onClick={closeAllMenus}>
        <span className="logo-name">Report<span>Ease</span></span>
      </Link>

      <ul className={`nav-links ${navLinksOpen ? 'open' : ''}`} id="navLinks">
        <li><Link to="/" onClick={closeAllMenus}>Home</Link></li>
        <li><Link to="/upload" onClick={closeAllMenus}>Upload Report</Link></li>
        <li><Link to="/#features" onClick={closeAllMenus}>Features</Link></li>
        <li><Link to="/#about" onClick={closeAllMenus}>About</Link></li>
      </ul>

      <div className="nav-right">
        <Link to="/upload" className="nav-cta">Upload Report</Link>

        <button
          className="user-btn"
          onClick={toggleUserDropdown}
          aria-label="User menu"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        {userDropdownOpen && (
          <div className="user-dropdown open" onClick={(e) => e.stopPropagation()}>
            <div className="dd-head">
              <strong>{userDetails.name}</strong>
              <span>user@reportease.in</span>
            </div>
            <button className="dd-item">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              My Reports
            </button>
            <button className="dd-item">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Details
            </button>
            <div className="dd-divider" />
            <button className="dd-item">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Sign in to another account
            </button>
            <button className="dd-item danger">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </div>
        )}

        <div className="hamburger" onClick={toggleNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {userDropdownOpen && (
        <div
          className="dropdown-backdrop"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
