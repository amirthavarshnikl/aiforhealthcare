import React from 'react';

const MedicalSummary = ({ summary }) => {
  return (
    <div className="card">
      <div className="card-tag">AI GENERATED</div>
      <div className="card-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Medical Summary
      </div>
      <div className="sumtext">
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default MedicalSummary;
