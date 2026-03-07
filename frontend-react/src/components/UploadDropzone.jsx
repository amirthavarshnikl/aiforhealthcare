import React, { useState } from 'react';

export default function UploadDropzone({ onFileSelect, selectedLanguage, onLanguageChange }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const languages = [
    { code: 'English', label: 'English', flag: '🌐' },
    { code: 'Tamil', label: 'Tamil', flag: '🇮🇳' },
    { code: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'Kannada', label: 'Kannada', flag: '🇮🇳' },
  ];

  return (
    <div className="card upload-card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Drop Your Report
      </div>

      {/* Dropzone */}
      <div
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="dropzone-content">
          <div className="dropzone-icon">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="dropzone-text">
            <strong>Drag your report here</strong> or{' '}
            <button
              className="dropzone-link"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <p className="dropzone-hint">Any PDF or image file, up to 20 MB</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf, .jpg, .jpeg, .png, .gif"
          style={{ display: 'none' }}
        />
      </div>

      {/* Formats */}
      <div className="formats">
        <strong>Accepted formats</strong>
        <div className="format-list">
          <span className="format-tag">PDF</span>
          <span className="format-tag">JPG</span>
          <span className="format-tag">PNG</span>
          <span className="format-tag">GIF</span>
        </div>
      </div>

      {/* Languages */}
      <div className="languages-section">
        <strong>Available languages</strong>
        <div className="lang-options">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${selectedLanguage === lang.code ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang.code)}
            >
              <span className="flag">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="privacy-note">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p>Your files are private. They're processed securely and not stored on our servers.</p>
      </div>
    </div>
  );
}
