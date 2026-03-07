import React from 'react';
import '../styles/report-card.css';

export default function ReportCard({ report, onViewSummary }) {
  return (
    <div className="report-card-container">
      <div className="card-icon">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      <div className="card-content">
        <h4 className="card-title">{report.name}</h4>
        <p className="card-date">Uploaded: {report.date}</p>
      </div>

      <button className="card-action" onClick={onViewSummary}>
        View Summary
      </button>
    </div>
  );
}
