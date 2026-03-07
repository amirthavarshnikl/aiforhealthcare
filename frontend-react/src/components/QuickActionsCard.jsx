import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
      </div>

      <div className="quick-actions">
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/summary')}
        >
          ← Back to Summary
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate('/upload')}
        >
          📤 Analyse Another Report
        </button>
      </div>
    </div>
  );
}
