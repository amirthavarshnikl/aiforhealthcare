import React from 'react';
import { Link } from 'react-router-dom';

export default function BreadcrumbTranslation() {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb-container">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        
        <Link to="/upload">Upload Report</Link>
        <span className="breadcrumb-separator">/</span>
        
        <Link to="/summary">AI Summary</Link>
        <span className="breadcrumb-separator">/</span>
        
        <span className="breadcrumb-current">Translation</span>
      </div>
    </div>
  );
}
