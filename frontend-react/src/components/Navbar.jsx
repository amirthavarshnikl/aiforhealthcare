import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onDetailsOpen, onReportsOpen, userName }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const userBtnRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          userBtnRef.current && !userBtnRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showDropdown]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleNavLinkClick = () => {
    setShowMenu(false);
  };

  const handleDetailsClick = () => {
    setShowDropdown(false);
    onDetailsOpen();
  };

  const handleReportsClick = () => {
    setShowDropdown(false);
    onReportsOpen();
  };

  return (
    <nav className="navbar-home">
      <a className="logo" href="/">
        <img src="/logo.jpg" alt="ReportEase Logo" className="logo-img"/>
        <span className="logo-name">Report<span>Ease</span></span>
      </a>

      <ul className="nav-links" id="navLinks" style={{ display: showMenu ? 'flex' : '' }}>
        <li><a href="#features" onClick={handleNavLinkClick}>Features</a></li>
        <li><a href="#how" onClick={handleNavLinkClick}>How It Works</a></li>
        <li><a href="#about" onClick={handleNavLinkClick}>About</a></li>
      </ul>

      <div className="nav-right">
        <a className="nav-cta" href="/upload" onClick={handleNavLinkClick}>Upload Report</a>
        <button className="user-btn" ref={userBtnRef} id="userBtn" onClick={() => setShowDropdown(!showDropdown)} aria-label="User menu">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

        {showDropdown && (
          <div className="user-dropdown open" id="userDropdown" ref={dropdownRef}>
            <div className="dropdown-header">
              <strong>Welcome back</strong>
              <span>{userName || 'user@reportease.in'}</span>
            </div>
            <button className="dropdown-item" onClick={handleReportsClick}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              My Reports
            </button>
            <button className="dropdown-item" onClick={handleDetailsClick}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              My Details
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Sign in to another account
            </button>
            <button className="dropdown-item danger">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log Out
            </button>
          </div>
        )}

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
