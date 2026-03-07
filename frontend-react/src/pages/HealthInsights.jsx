import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/insights.css';

export default function HealthInsights() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentReport');
    if (stored) {
      setReport(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const sampleInsights = [
    {
      id: 1,
      type: 'warning',
      title: 'Possible Iron Deficiency',
      description: 'Low haemoglobin and MCV levels suggest iron deficiency anaemia.',
      recommendation: 'Consider iron supplementation and dietary changes.'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Slightly Elevated Cholesterol',
      description: 'Total and LDL cholesterol levels are above optimal range.',
      recommendation: 'Increase physical activity and reduce saturated fat intake.'
    },
    {
      id: 3,
      type: 'success',
      title: 'Normal Blood Sugar',
      description: 'Fasting glucose level is within healthy range.',
      recommendation: 'Maintain current diet and exercise habits.'
    },
    {
      id: 4,
      type: 'success',
      title: 'Healthy Immune System',
      description: 'White blood cell count indicates normal immune function.',
      recommendation: 'Continue maintaining good hygiene and sleep patterns.'
    }
  ];

  if (loading) {
    return <div className="insights-page"><p>Loading...</p></div>;
  }

  return (
    <div className="insights-page">
      <div className="insights-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/upload">Upload</Link> / <span>Health Insights</span>
        </div>

        <h1>Your Health Insights</h1>
        <p className="subtitle">
          AI-extracted insights from your medical report to help you understand your health better.
        </p>

        <div className="insights-grid">
          {sampleInsights.map((insight) => (
            <div key={insight.id} className={`insight-card ${insight.type}`}>
              <div className="insight-header">
                <div className={`insight-badge ${insight.type}`}>
                  {insight.type === 'warning' ? '⚠️' : '✅'}
                </div>
                <h3>{insight.title}</h3>
              </div>
              <p className="insight-description">{insight.description}</p>
              <div className="insight-footer">
                <strong>Recommendation:</strong> {insight.recommendation}
              </div>
            </div>
          ))}
        </div>

        <div className="insights-actions">
          <Link to="/summary" className="btn-secondary">View Summary</Link>
          <Link to="/translate" className="btn-secondary">View Translation</Link>
          <Link to="/upload" className="btn-primary">Upload Another Report</Link>
        </div>
      </div>
    </div>
  );
}
