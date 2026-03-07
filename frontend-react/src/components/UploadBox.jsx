import React, { useRef, useState } from 'react';
import '../styles/upload.css';

export default function UploadBox({ onFileSelect }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF, JPG, PNG, or WEBP file');
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`upload-box ${dragActive ? 'over' : ''}`}>
      <input
        ref={inputRef}
        type="file"
        id="fileInput"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {!file ? (
        <div
          className="dropzone"
          id="dz"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="dz-icon">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="dz-title">Drag &amp; drop your report here</div>
          <div className="dz-sub">PDF, JPG, PNG or WEBP · Max 50 MB</div>
          <div className="dz-or">or</div>
          <button className="btn-upload" onClick={handleButtonClick}>
            <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Browse File
          </button>
        </div>
      ) : (
        <div className="file-chip">
          <div className="chip-icon">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="chip-meta">
            <div className="chip-name">{file.name}</div>
            <div className="chip-size">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          <button className="chip-remove" onClick={clearFile} title="Remove">
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div>
        <div className="sublabel">Supported Formats</div>
        <div className="formats">
          <span className="fmt">PDF</span>
          <span className="fmt">JPG</span>
          <span className="fmt">PNG</span>
          <span className="fmt">WEBP</span>
        </div>
      </div>
    </div>
  );
}
