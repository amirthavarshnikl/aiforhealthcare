import React from 'react';

export default function ReportMetaBar({ report, onCopy, onDownload }) {
  return (
    <div className="meta-bar">
      <div className="meta-left">
        <div className="meta-icon">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div>
          <div className="meta-name">{report?.metadata?.report_name || 'Medical Report'}</div>
          <div className="meta-sub">
            <span>
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {report?.metadata?.report_date || 'Date'}
            </span>
            <span>
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {report?.metadata?.patient_name || 'Patient'}
            </span>
            <span>
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {report?.metadata?.report_type || 'Report'} • Pathology
            </span>
          </div>
        </div>
      </div>
      <div className="meta-btns">
        <button className="btn-sm outline" onClick={onCopy}>
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </button>
        <button className="btn-sm outline" onClick={onDownload}>
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
