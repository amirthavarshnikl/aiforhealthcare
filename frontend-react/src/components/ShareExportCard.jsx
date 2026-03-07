import React from 'react';

export default function ShareExportCard({ 
  onDownload, 
  onCopy, 
  onWhatsApp, 
  onPrint 
}) {
  const handleWhatsApp = () => {
    const message = "Check out my medical report analysis from ReportEase - AI powered medical insights!";
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onWhatsApp && onWhatsApp();
  };

  const handlePrint = () => {
    window.print();
    onPrint && onPrint();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Share & Export</h3>
      </div>

      <div className="export-actions">
        <button className="export-btn primary" onClick={onDownload}>
          ⬇️ Download Translation
        </button>
        <button className="export-btn secondary" onClick={onCopy}>
          📋 Copy Translation
        </button>
        <button className="export-btn secondary" onClick={handleWhatsApp}>
          💬 Share via WhatsApp
        </button>
        <button className="export-btn secondary" onClick={handlePrint}>
          🖨️ Print Page
        </button>
      </div>

      <div className="privacy-note">
        <p>🔒 Your data is processed securely and never stored.</p>
      </div>
    </div>
  );
}
