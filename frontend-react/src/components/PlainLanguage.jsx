import React from 'react';

const PlainLanguage = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Check if items use the new format (with icon and description) or old format (with explanation and status)
  const isNewFormat = items[0]?.icon !== undefined;

  if (isNewFormat) {
    return (
      <div className="card">
        <div className="card-tag">PLAIN LANGUAGE</div>
        <div className="card-title">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M2 15.5v4a1.5 1.5 0 001.5 1.5h17a1.5 1.5 0 001.5-1.5v-4" />
            <polyline points="10 5 14 1 18 5" />
            <polyline points="14 1 14 15" />
          </svg>
          Explained in Simple Terms
        </div>
        <div className="plain-items">
          {items.map((item, idx) => (
            <div key={idx} className="plain-item">
              <div className="plain-icon">{item.icon}</div>
              <div className="plain-content">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Old format
  const getStatusColor = (status) => {
    switch(status) {
      case 'normal':
        return 'status-normal';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
      default:
        return 'status-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'normal':
        return '✓';
      case 'warning':
        return '⚠';
      case 'critical':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="card plain-language-card">
      <div className="card-header">
        <h2 className="card-title">In Simple Terms</h2>
        <p className="card-subtitle">Easy-to-understand explanation for patients</p>
      </div>
      <div className="card-body">
        <div className="explanation-items">
          {items.map((item) => (
            <div key={item.id} className={`explanation-item ${getStatusColor(item.status)}`}>
              <div className="explanation-header">
                <span className={`status-icon ${item.status}`}>
                  {getStatusIcon(item.status)}
                </span>
                <h3 className="explanation-title">{item.title}</h3>
              </div>
              <p className="explanation-text">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlainLanguage;
