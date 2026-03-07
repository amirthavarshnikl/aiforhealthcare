import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavbarTranslation() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">ReportEase</Link>
          
          <ul className="navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload Report</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
          </ul>

          <div className="navbar-right">
            <button className="btn-upload">Upload Report</button>
            <button 
              className="user-dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <ul>
                  <li><a href="#reports">My Reports</a></li>
                  <li><a href="#details">My Details</a></li>
                  <li><a href="#signin">Sign in another account</a></li>
                  <li><a href="#logout">Logout</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
