import React from 'react';

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function FilePreview({ file, onRemove, showForm, showProgress, progressPercent, progressText }) {
  return (
    <div className="card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        File Preview
      </div>

      {!file ? (
        <div className="empty-state" id="emptyState">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p>No file selected yet. Upload a report to see a preview here.</p>
        </div>
      ) : (
        <>
          <div className={`file-chip ${file ? 'show' : ''}`} id="fileChip">
            <div className="chip-thumb">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="chip-meta">
              <div className="chip-name" id="chipName">
                {file.name}
              </div>
              <div className="chip-size" id="chipSize">
                {formatFileSize(file.size)}
              </div>
            </div>
            <button className="chip-remove" onClick={onRemove} title="Remove">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {showProgress && (
            <div className={`progress-wrap ${showProgress ? 'show' : ''}`} id="progWrap">
              <div className="prog-labels">
                <span id="progTxt">{progressText}</span>
                <span id="progPct">{progressPercent}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" id="progFill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {showForm && (
            <div className={`detail-form ${showForm ? 'show' : ''}`} id="detailForm">
              {/* Form will be rendered by parent component */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
