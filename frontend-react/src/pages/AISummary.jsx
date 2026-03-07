import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MOCK_REPORT_KPATEL,
  MOCK_REPORT_YASH_PATEL,
  MOCK_REPORT_AMIRTHA,
  MOCK_REPORT_SARAH_KHAN,
  MOCK_REPORT_RAJESH_KUMAR
} from '../data/mockData';
import '../styles/summary.css';

export default function AISummary() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentReport');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReport(parsed);
      } catch (error) {
        console.error('Error parsing report:', error);
        // Use mock data as fallback
        setReport(MOCK_REPORT_KPATEL);
      }
    } else {
      // No stored report, use mock data
      setReport(MOCK_REPORT_KPATEL);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="summary-page"><p>Loading...</p></div>;
  }

  return (
    <div className="summary-page">
      <div className="summary-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/upload">Upload</Link> / <span>Summary</span>
        </div>

        <div className="report-meta">
          <div className="meta-left">
            <div className="meta-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h2 className="meta-name">{report.metadata?.report_name || 'Medical Report'}</h2>
              <div className="meta-info">
                <span>{report.metadata?.report_date || new Date().toLocaleDateString()}</span>
                <span>{report.metadata?.patient_name || 'Patient'}</span>
                <span>{report.metadata?.report_type || 'Report'}</span>
              </div>
            </div>
          </div>
          <div className="meta-actions">
            <button className="btn-outline" onClick={() => navigator.clipboard.writeText(report.medical_summary)}>Copy</button>
            <button className="btn-outline" onClick={() => {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([report.medical_summary], { type: 'text/plain' }));
              a.download = 'report-summary.txt';
              a.click();
            }}>Download</button>
            <Link to="/translate" className="btn-translate">🌍 Translate (4 Languages)</Link>
            <Link to="/upload" className="btn-primary">New Report</Link>
          </div>
        </div>

        <div className="summary-content">
          <div className="summary-card">
            <h3>AI Simplified Summary</h3>
            <div className="summary-text">
              {report.medical_summary || 'No summary available'}
            </div>
          </div>

          <div className="summary-card">
            <h3>Doctor's Notes & Recommendations</h3>
            <div className="summary-text">
              {report.doctor_notes || 'No notes available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
