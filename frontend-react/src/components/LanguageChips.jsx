import React from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', script: 'Latin' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', script: 'Tamil' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', script: 'Kannada' },
];

export default function LanguageChips({ currentLanguage, onLanguageChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">All Languages</h3>
      </div>

      <div className="language-chips">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-chip ${currentLanguage === lang.code ? 'active' : ''}`}
            onClick={() => onLanguageChange(lang.code)}
          >
            <span className="chip-flag">{lang.flag}</span>
            <div className="chip-content">
              <div className="chip-name">{lang.name}</div>
              <div className="chip-script">{lang.script}</div>
            </div>
            {currentLanguage === lang.code && (
              <span className="chip-badge">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
