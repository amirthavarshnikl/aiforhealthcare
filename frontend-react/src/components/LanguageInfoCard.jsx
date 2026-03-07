import React from 'react';

const languageInfo = {
  en: {
    name: 'English',
    script: 'Latin',
    speakers: '125M+ native speakers',
    region: 'Widely spoken across India',
  },
  ta: {
    name: 'Tamil',
    script: 'Tamil Script',
    speakers: '75M+ speakers',
    region: 'Tamil Nadu',
  },
  hi: {
    name: 'Hindi',
    script: 'Devanagari',
    speakers: '345M+ speakers',
    region: 'Hindi-speaking regions',
  },
  kn: {
    name: 'Kannada',
    script: 'Kannada Script',
    speakers: '50M+ speakers',
    region: 'Karnataka',
  },
};

const flags = {
  en: '🇮🇳',
  ta: '🇮🇳',
  hi: '🇮🇳',
  kn: '🇮🇳',
};

export default function LanguageInfoCard({ currentLanguage }) {
  const info = languageInfo[currentLanguage];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Language Info</h3>
      </div>
      
      <div className="language-info-content">
        <div className="language-header">
          <span className="flag">{flags[currentLanguage]}</span>
          <div className="language-details">
            <h4>{info.name}</h4>
            <p className="script">{info.script}</p>
          </div>
        </div>

        <div className="info-rows">
          <div className="info-row">
            <label>Script</label>
            <value>{info.script}</value>
          </div>
          <div className="info-row">
            <label>Speakers</label>
            <value>{info.speakers}</value>
          </div>
          <div className="info-row">
            <label>Region</label>
            <value>{info.region}</value>
          </div>
        </div>
      </div>
    </div>
  );
}
