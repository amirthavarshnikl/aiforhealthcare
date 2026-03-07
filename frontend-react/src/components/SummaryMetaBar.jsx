import React from 'react';

const SummaryMetaBar = ({ patientName, reportDate, reportType, onCopy, onDownload }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="meta-bar">
      <div className="meta-info">
        <div className="meta-item">
          <span className="meta-label">Patient:</span>
          <span className="meta-value">{patientName}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Report Date:</span>
          <span className="meta-value">{formatDate(reportDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Type:</span>
          <span className="meta-value">{reportType}</span>
        </div>
      </div>

      <div className="meta-actions">
        <button 
          className="meta-button copy-button"
          onClick={onCopy}
          title="Copy report"
        >
          <span className="icon">📋</span>
          Copy
        </button>
        <button 
          className="meta-button download-button"
          onClick={onDownload}
          title="Download report"
        >
          <span className="icon">⬇️</span>
          Download
        </button>
      </div>
    </div>
  );
};

export default SummaryMetaBar;
