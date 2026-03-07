import React from 'react';

const Findings = ({ findings }) => {
  if (!findings || findings.length === 0) return null;

  // Check if using new format (with 'status' property and 'label')
  const isNewFormat = findings[0]?.status && (findings[0]?.status === 'critical' || findings[0]?.status === 'warning' || findings[0]?.status === 'ok');

  if (isNewFormat) {
    return (
      <div className="card">
        <div className="card-tag">FLAGGED VALUES</div>
        <div className="card-title">
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Test Results
        </div>
        <div className="findings">
          {findings.map((finding, idx) => (
            <div key={idx} className={`frow ${finding.status}`}>
              <div className="fdot" />
              <div className="flabel">
                {finding.label}
                <small>{finding.normalRange}</small>
              </div>
              <span className={`fbadge`}>{finding.badge}</span>
              <div className="fval">
                {finding.value}
                <small>{finding.unit}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Old table format
  const getStatusBadge = (status) => {
    switch(status) {
      case 'normal':
        return { className: 'badge-normal', text: 'Normal' };
      case 'high':
        return { className: 'badge-high', text: 'High' };
      case 'low':
        return { className: 'badge-low', text: 'Low' };
      case 'slightly_high':
        return { className: 'badge-warning', text: 'Slightly High' };
      case 'slightly_low':
        return { className: 'badge-warning', text: 'Slightly Low' };
      default:
        return { className: 'badge-neutral', text: 'Unknown' };
    }
  };

  const isAbnormal = (status) => {
    return status !== 'normal';
  };

  return (
    <div className="card findings-card">
      <div className="card-header">
        <h2 className="card-title">Important Findings</h2>
        <p className="card-subtitle">Laboratory test results</p>
      </div>
      <div className="card-body">
        <div className="findings-table-container">
          <table className="findings-table">
            <thead>
              <tr>
                <th>Finding</th>
                <th>Your Result</th>
                <th>Normal Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding) => {
                const badge = getStatusBadge(finding.status);
                const rowClass = isAbnormal(finding.status) ? 'row-abnormal' : 'row-normal';

                return (
                  <tr key={finding.id} className={rowClass}>
                    <td className="finding-name">{finding.finding}</td>
                    <td className="finding-value">{finding.value}</td>
                    <td className="finding-range">{finding.normal_range}</td>
                    <td className="finding-status">
                      <span className={`status-badge ${badge.className}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Findings;
