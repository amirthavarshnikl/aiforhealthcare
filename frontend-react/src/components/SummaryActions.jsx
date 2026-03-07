import React from 'react';
import { Link } from 'react-router-dom';

const SummaryActions = ({ onCopy, onDownload, reportId }) => {
  return (
    <div className="card" style={{ padding: '1.4rem 1.5rem' }}>
      <div className="card-title" style={{ marginBottom: '.8rem' }}>
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
        Actions
      </div>
      <div className="sactions">
        <button className="sbtn green" onClick={onDownload}>
          <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Summary
        </button>
        <button className="sbtn ghost" onClick={onCopy}>
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy Full Summary
        </button>
        {reportId && (
          <Link to={`/translation/${reportId}`} className="sbtn ghost">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            View Translations
          </Link>
        )}
        <Link to="/upload" className="sbtn ghost">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Analyse Another
        </Link>
      </div>
    </div>
  );
};

export default SummaryActions;
