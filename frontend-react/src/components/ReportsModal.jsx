import React from 'react';

const mockReports = [
  { id: 1, name: 'Blood Test Report', date: '02 March 2025' },
  { id: 2, name: 'X-Ray Report', date: '28 February 2025' },
  { id: 3, name: 'Lipid Panel', date: '25 February 2025' },
];

export default function ReportsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">My Reports</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="reports-list">
          {mockReports.length > 0 ? (
            mockReports.map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-item-info">
                  <div className="report-item-name">{report.name}</div>
                  <div className="report-item-date">{report.date}</div>
                </div>
                <button className="report-item-btn">View Summary</button>
              </div>
            ))
          ) : (
            <div className="no-reports">
              <p>No reports available yet. Upload your first medical report.</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
