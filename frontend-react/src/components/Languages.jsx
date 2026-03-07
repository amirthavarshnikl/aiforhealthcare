import React from 'react';

const Languages = () => {
  const languages = [
    {
      id: 1,
      flag: '🇮🇳',
      name: 'Tamil',
      code: 'ta'
    },
    {
      id: 2,
      flag: '🇮🇳',
      name: 'Hindi',
      code: 'hi'
    },
    {
      id: 3,
      flag: '🇮🇳',
      name: 'Kannada',
      code: 'kn'
    },
    {
      id: 4,
      flag: '🇬🇧',
      name: 'English',
      code: 'en'
    }
  ];

  return (
    <div className="languages-section">
      <p className="languages-label">Available in 4 Languages:</p>
      <div className="languages-chips">
        {languages.map((lang) => (
          <div key={lang.id} className="language-chip">
            <span className="language-flag">{lang.flag}</span>
            <span className="language-name">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;
