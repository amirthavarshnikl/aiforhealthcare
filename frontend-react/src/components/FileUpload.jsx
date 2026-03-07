import React, { useRef } from 'react';

export default function FileUpload({ file, onFileSelect, selectedLanguage, onLanguageChange }) {
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    dropzoneRef.current?.classList.add('over');
  };

  const handleDragLeave = () => {
    dropzoneRef.current?.classList.remove('over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropzoneRef.current?.classList.remove('over');
    if (e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card">
      <div className="card-title">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload File
      </div>

      <div
        className="dropzone"
        ref={dropzoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <div className="dz-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="dz-title">Drag & drop your report here</div>
        <div className="dz-sub">PDF, JPG, PNG or WEBP · Max 20 MB</div>
        <div className="dz-or">or</div>
        <button className="btn-upload" type="button">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Browse File
        </button>
      </div>

      <div>
        <div className="sublabel">Supported Formats</div>
        <div className="formats">
          <span className="fmt">PDF</span>
          <span className="fmt">JPG</span>
          <span className="fmt">PNG</span>
          <span className="fmt">WEBP</span>
        </div>
      </div>

      <div>
        <div className="sublabel">Output Language</div>
        <div className="langs">
          {['English', 'தமிழ்', 'हिन्दी', 'ಕನ್ನಡ'].map((lang) => (
            <button
              key={lang}
              className={`lang-pill ${selectedLanguage === lang ? 'on' : ''}`}
              onClick={() => onLanguageChange(lang)}
              type="button"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="privacy">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Your file is processed securely and never stored permanently. Data is deleted immediately after analysis.
      </div>
    </div>
  );
}
