import React from 'react';
import { useNavigate } from 'react-router-dom';

const SummaryBreadcrumb = ({ reportName }) => {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb-navigation">
      <div className="breadcrumb-container">
        <button 
          className="breadcrumb-link"
          onClick={() => navigate('/')}
        >
          Dashboard
        </button>
        <span className="breadcrumb-separator">/</span>
        <button 
          className="breadcrumb-link"
          onClick={() => navigate('/reports')}
        >
          Reports
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{reportName}</span>
      </div>
    </div>
  );
};

export default SummaryBreadcrumb;
