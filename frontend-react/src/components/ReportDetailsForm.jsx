import React from 'react';

export default function ReportDetailsForm({ formData, onFormChange, onAnalyze, isAnalyzing }) {
  const reportTypes = ['Blood Test', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG', 'General'];

  return (
    <div className="form-container show" id="formContainer">
      <div className="form-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        Tell us about this report
      </div>

      <div className="form-group">
        <label htmlFor="reportName">Report Name</label>
        <input
          type="text"
          id="reportName"
          placeholder="e.g. Blood Test Results"
          value={formData.reportName}
          onChange={(e) => onFormChange('reportName', e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reportType">Report Type</label>
          <select
            id="reportType"
            value={formData.reportType}
            onChange={(e) => onFormChange('reportType', e.target.value)}
            disabled={isAnalyzing}
          >
            <option value="">Select type</option>
            {reportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reportDate">Report Date</label>
          <input
            type="date"
            id="reportDate"
            value={formData.reportDate}
            onChange={(e) => onFormChange('reportDate', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="patientName">Patient Name</label>
        <input
          type="text"
          id="patientName"
          placeholder="Your full name"
          value={formData.patientName}
          onChange={(e) => onFormChange('patientName', e.target.value)}
          disabled={isAnalyzing}
        />
      </div>

      <button
        className="analyze-btn"
        onClick={onAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <svg className="spinner" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" fill="none" strokeDasharray="60" strokeDashoffset="0" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Analyze Report
          </>
        )}
      </button>
    </div>
  );
}
