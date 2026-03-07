import React, { useState, useEffect } from 'react';
import { fetchUserReports } from '../services/api';

const MyReportsModal = ({ isOpen, onClose }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserReports();
      setReports(data);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">My Reports</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="reports-list">
          {loading && (
            <div className="loading-state">
              <p>Loading reports...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Error: {error}</p>
              <button onClick={loadReports} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="empty-state">
              <p>📋 No reports yet</p>
              <p className="empty-subtitle">Start by uploading your first medical report</p>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <>
              {reports.map((report) => (
                <div key={report.id} className="report-item">
                  <div className="report-info">
                    <h3 className="report-name">{report.reportName || 'Unnamed Report'}</h3>
                    <p className="report-date">{formatDate(report.uploadedAt)}</p>
                    {report.testType && (
                      <p className="report-type">Type: {report.testType}</p>
                    )}
                  </div>
                  <div className="report-actions">
                    {report.status === 'completed' ? (
                      <span className="status-badge completed">✓ Analyzed</span>
                    ) : (
                      <span className="status-badge pending">⏳ Processing</span>
                    )}
                    <button className="view-btn">View</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReportsModal;
