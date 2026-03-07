import React, { useState } from 'react';

export default function ResultSection({ isVisible, onAnalyzeAnother }) {
  const [currentTab, setCurrentTab] = useState('summary');

  if (!isVisible) return null;

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📄' },
    { id: 'plain', label: 'Plain Language', icon: '💬' },
    { id: 'translated', label: 'Translation', icon: '🌐' }
  ];

  return (
    <div className="result-section show" id="resultSection">
      <div className="result-header">
        <div className="result-title">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Analysis Complete
        </div>
        <p>Your report has been analyzed and simplified</p>
      </div>

      <div className="result-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="result-content">
        {currentTab === 'summary' && (
          <div className="tab-content">
            <h3>Medical Summary</h3>
            <p>Your report analysis is ready. This comprehensive summary includes clinical findings, plain language explanations, and actionable health recommendations from your medical professional.</p>
          </div>
        )}

        {currentTab === 'plain' && (
          <div className="tab-content">
            <h3>In Plain Language</h3>
            <div className="plain-items">
              <div className="plain-item"><strong>✓ Normal Results</strong><p>Most of your test values are within healthy ranges.</p></div>
              <div className="plain-item"><strong>📌 Key Finding</strong><p>There are a few values that may need attention. Your doctor will follow up with you about these.</p></div>
              <div className="plain-item"><strong>💊 Recommendations</strong><p>Follow any lifestyle or medication advice provided by your healthcare provider.</p></div>
            </div>
          </div>
        )}

        {currentTab === 'translated' && (
          <div className="tab-content">
            <h3>Translation Available</h3>
            <p>View this summary in Tamil, Hindi, or Kannada using the language selector on the page.</p>
          </div>
        )}
      </div>

      <div className="result-actions">
        <button className="action-btn download-btn">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
        <button className="action-btn copy-btn">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          Copy
        </button>
        <button className="action-btn another-btn" onClick={onAnalyzeAnother}>
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Analyze Another
        </button>
      </div>
    </div>
  );
}
