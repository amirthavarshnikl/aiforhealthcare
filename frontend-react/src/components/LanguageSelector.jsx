import React, { useState } from 'react';
import '../styles/language-selector.css';

export default function LanguageSelector({ onLanguageChange }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  return (
    <div className="language-selector">
      <label className="lang-label">Output Language</label>
      <div className="lang-pills">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`lang-pill ${selectedLanguage === lang.code ? 'on' : ''}`}
            data-lang={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.native}
          </button>
        ))}
      </div>
    </div>
  );
}
