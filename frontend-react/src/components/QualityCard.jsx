import React from 'react';

const qualityMetrics = {
  en: { medical: 100, plain: 100, recommendations: 100 },
  ta: { medical: 94, plain: 98, recommendations: 96 },
  hi: { medical: 96, plain: 99, recommendations: 97 },
  kn: { medical: 93, plain: 97, recommendations: 95 },
};

export default function QualityCard({ currentLanguage }) {
  const metrics = qualityMetrics[currentLanguage];

  const QualityBar = ({ label, percentage }) => (
    <div className="quality-item">
      <div className="quality-label">
        <span>{label}</span>
        <span className="percentage">{percentage}%</span>
      </div>
      <div className="quality-bar">
        <div 
          className="quality-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Translation Quality</h3>
      </div>

      <div className="quality-content">
        <QualityBar label="Medical Terms" percentage={metrics.medical} />
        <QualityBar label="Plain Language" percentage={metrics.plain} />
        <QualityBar label="Recommendations" percentage={metrics.recommendations} />
      </div>

      <div className="quality-footer">
        <p>High accuracy ensures medical precision while maintaining clarity.</p>
      </div>
    </div>
  );
}
