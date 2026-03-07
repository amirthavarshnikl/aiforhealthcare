import React, { useState, forwardRef } from 'react';

const UserDropdown = forwardRef(({ onClose, onShowDetails, onShowReports }, ref) => {
  const handleDetailsClick = () => {
    onShowDetails && onShowDetails();
    onClose();
  };

  const handleReportsClick = () => {
    onShowReports && onShowReports();
    onClose();
  };

  const handleLogout = () => {
    // Logout logic here
    localStorage.removeItem('authToken');
    window.location.reload();
    onClose();
  };

  return (
    <div ref={ref} className="user-dropdown">
      <button 
        className="dropdown-item"
        onClick={handleDetailsClick}
      >
        👤 My Details
      </button>
      <button 
        className="dropdown-item"
        onClick={handleReportsClick}
      >
        📊 My Reports
      </button>
      <button 
        className="dropdown-item dropdown-logout"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>
    </div>
  );
});

UserDropdown.displayName = 'UserDropdown';

export default UserDropdown;
