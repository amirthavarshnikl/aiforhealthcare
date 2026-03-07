import React from 'react';

export default function TranslatePanel({ selectedLanguage, onLanguageChange }) {
  return (
    <div className="card" style={{ padding: '1.4rem 1.5rem' }}>
      <div className="card-title" style={{ marginBottom: '.8rem' }}>
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        Translate
      </div>
      <div className="lpills">
        {['en', 'ta', 'hi', 'kn'].map((lang) => (
          <button
            key={lang}
            className={`lpill ${selectedLanguage === lang ? 'on' : ''}`}
            onClick={() => onLanguageChange(lang)}
          >
            {lang === 'en' && 'English'}
            {lang === 'ta' && 'தமிழ்'}
            {lang === 'hi' && 'हिन्दी'}
            {lang === 'kn' && 'ಕನ್ನಡ'}
          </button>
        ))}
      </div>
    </div>
  );
}
