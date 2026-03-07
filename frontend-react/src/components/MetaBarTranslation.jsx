import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MetaBarTranslation({ reportData, onCopy, onDownload }) {
  const navigate = useNavigate();

  return (
    <div className="meta-bar">
      <div className="meta-bar-container">
        <div className="meta-info">
          <div className="meta-item">
            <label>Report Name</label>
            <value>{reportData?.report_name || 'Blood Test Report'}</value>
          </div>
          <div className="meta-item">
            <label>Date</label>
            <value>{reportData?.report_date || '02 March 2025'}</value>
          </div>
          <div className="meta-item">
            <label>Patient Name</label>
            <value>{reportData?.patient_name || 'Priya Sharma'}</value>
          </div>
          <div className="meta-item">
            <label>Type</label>
            <value>{reportData?.report_type || 'Translation'}</value>
          </div>
        </div>

        <div className="meta-actions">
          <button className="btn-secondary" onClick={onCopy}>Copy</button>
          <button className="btn-secondary" onClick={onDownload}>Download</button>
          <button className="btn-secondary" onClick={() => navigate('/summary')}>Back to Summary</button>
        </div>
      </div>
    </div>
  );
}
