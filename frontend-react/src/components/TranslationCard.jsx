import React from 'react';

const TranslationCard = ({ translation, language }) => {
  const getLanguageName = (lang) => {
    const names = {
      ta: 'Tamil',
      hi: 'Hindi',
      kn: 'Kannada'
    };
    return names[lang] || lang.toUpperCase();
  };

  if (!translation) return null;

  return (
    <div className="card trans-card show">
      <div className="card-tag">TRANSLATION</div>
      <div className="card-title">
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        <span>{translation.title || `Translation — ${getLanguageName(language)}`}</span>
      </div>
      <div className="trans-body" lang={language}>
        {translation.medical_summary && (
          <div className="translation-section">
            <p>{translation.medical_summary}</p>
          </div>
        )}

        {translation.plain_language && translation.plain_language.length > 0 && (
          <div className="translation-section">
            <div style={{ marginTop: '1rem' }}>
              {translation.plain_language.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '0.8rem' }}>
                  <strong>{item.icon} {item.title}</strong>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {translation.summary && (
          <div className="translation-section">
            <h3 className="translation-subtitle">Summary</h3>
            <p>{translation.summary}</p>
          </div>
        )}

        {translation.findings && (
          <div className="translation-section">
            <h3 className="translation-subtitle">{translation.findings}</h3>
          </div>
        )}

        {translation.doctor_note && (
          <div className="translation-section">
            <h3 className="translation-subtitle">Doctor's Note</h3>
            <p>{translation.doctor_note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationCard;
