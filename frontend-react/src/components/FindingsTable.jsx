import React from 'react';

export default function FindingsTable({ findings = [] }) {
  // Default findings if none provided
  const defaultFindings = [
    {
      severity: 'critical',
      label: 'Haemoglobin',
      description: 'Below normal — mild anaemia',
      badge: 'Low',
      value: '11.2 g/dL',
      reference: 'Ref: 12–16'
    },
    {
      severity: 'critical',
      label: 'MCV (Mean Corpuscular Volume)',
      description: 'Low — iron deficiency pattern',
      badge: 'Low',
      value: '72 fL',
      reference: 'Ref: 80–100'
    },
    {
      severity: 'warning',
      label: 'Total Cholesterol',
      description: 'Marginally above desirable range',
      badge: 'Borderline',
      value: '214 mg/dL',
      reference: 'Ref: <200'
    },
    {
      severity: 'warning',
      label: 'LDL Cholesterol',
      description: 'Borderline high — dietary change advised',
      badge: 'Borderline',
      value: '138 mg/dL',
      reference: 'Ref: <130'
    },
    {
      severity: 'ok',
      label: 'White Blood Cells (WBC)',
      description: 'Within normal limits',
      badge: 'Normal',
      value: '7,400 /μL',
      reference: 'Ref: 4.5k–11k'
    },
    {
      severity: 'ok',
      label: 'Fasting Blood Glucose',
      description: 'Normal — no diabetes risk',
      badge: 'Normal',
      value: '98 mg/dL',
      reference: 'Ref: 70–100'
    },
    {
      severity: 'ok',
      label: 'Platelet Count',
      description: 'Normal range',
      badge: 'Normal',
      value: '2,10,000 /μL',
      reference: 'Ref: 1.5–4L'
    },
    {
      severity: 'ok',
      label: 'HDL Cholesterol',
      description: 'Good — protective level',
      badge: 'Normal',
      value: '52 mg/dL',
      reference: 'Ref: >40'
    }
  ];

  const dataToDisplay = findings.length > 0 ? findings : defaultFindings;

  return (
    <div className="card">
      <div className="card-tag">Flagged Values</div>
      <div className="card-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Important Findings
      </div>
      <div className="findings">
        {dataToDisplay.map((finding, idx) => (
          <div key={idx} className={`frow ${finding.severity}`}>
            <div className="fdot" />
            <div className="flabel">
              {finding.label}
              <small>{finding.description}</small>
            </div>
            <span className="fbadge">{finding.badge}</span>
            <div className="fval">
              {finding.value}
              <small>{finding.reference}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
