import React, { useEffect, useRef } from 'react';

const HealthScore = ({ ringFillRef, score }) => {
  const scoreData = score || { score: 70, total: 100, level: 'Moderate', description: '4 of 8 values need attention' };

  useEffect(() => {
    // Animate health ring on mount
    if (ringFillRef?.current) {
      // Reset first
      ringFillRef.current.style.strokeDashoffset = '301';
      // Then animate
      setTimeout(() => {
        ringFillRef.current.style.strokeDashoffset = '90';
      }, 100);
    }
  }, [ringFillRef]);

  return (
    <div className="card">
      <div className="card-tag">Overall</div>
      <div className="card-title" style={{ marginBottom: '.7rem' }}>
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Health Score
      </div>
      <div className="score-wrap">
        <div className="ring-svg-wrap">
          <svg viewBox="0 0 116 116">
            <circle className="ring-track" cx="58" cy="58" r="48" />
            <circle className="ring-fill" ref={ringFillRef} cx="58" cy="58" r="48" />
          </svg>
          <div className="ring-num">
            <strong>{scoreData.score}</strong>
            <span>/ {scoreData.total}</span>
          </div>
        </div>
        <div className="score-lbl">
          <strong>{scoreData.level}</strong>
          {scoreData.description}
        </div>
      </div>
    </div>
  );
};

export default HealthScore;
