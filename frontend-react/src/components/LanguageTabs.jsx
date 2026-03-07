import React from 'react';

const languages = [
  { code: 'en', name: 'English', label: 'English (Original)' },
  { code: 'ta', name: 'Tamil', label: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', label: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', label: 'ಕನ್ನಡ' },
];

export default function LanguageTabs({ currentLanguage, onLanguageChange }) {
  return (
    <div className="language-tabs-wrapper">
      <div className="language-tabs">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-tab ${currentLanguage === lang.code ? 'active' : ''}`}
            onClick={() => onLanguageChange(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
