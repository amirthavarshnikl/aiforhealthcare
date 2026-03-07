import React from 'react';

const KeyValues = ({ values }) => {
  if (!values || values.length === 0) return null;

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '.8rem' }}>
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
        Key Values
      </div>
      <div className="key-values">
        {values.map((kv, idx) => (
          <div key={idx} className={`kv-row ${kv.status}`}>
            <span className="kv-icon">{kv.icon}</span>
            <div className="kv-label">{kv.label}</div>
            <div className={`kv-value ${kv.status}`}>{kv.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyValues;
