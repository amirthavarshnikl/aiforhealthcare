import React from 'react';

const TranslatePanel = ({ selectedLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' }
  ];

  return (
    <div className="card translate-panel">
      <div className="card-header">
        <h2 className="card-title">Choose Language</h2>
      </div>
      <div className="card-body">
        <div className="language-pills">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-pill ${selectedLanguage === lang.code ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslatePanel;
