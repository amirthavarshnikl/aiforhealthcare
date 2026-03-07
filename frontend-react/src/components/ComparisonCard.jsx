import React from 'react';

const terms = [
  { en: 'Hemoglobin', term: true },
  { en: 'Cholesterol', term: true },
  { en: 'Blood Sugar', term: true },
  { en: 'Anaemia', term: true },
  { en: 'Normal', term: false },
];

const translations = {
  ta: ['ஹீமோகுளோபின்', 'கொலஸ்ட்ரால்', 'இரத்த சர்க்கரை', 'ரத்தarchaeological்பு', 'இயல்பு'],
  hi: ['हीमोग्लोबिन', 'कोलेस्ट्रॉल', 'रक्त शर्करा', 'एनीमिया', 'सामान्य'],
  kn: ['ಹಿಮೋಗ್ಲೋಬಿನ್', 'ಕೋಲೆಸ್ಟೆರಾಲ್', 'ರಕ್ತ ಶರ್ಕರೆ', 'ರಕ್ತಸ್ವಲ್ಪತೆ', 'ಸಾಮಾನ್ಯ'],
  en: terms.map(t => t.en),
};

export default function ComparisonCard({ currentLanguage }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Original vs Translated</h3>
      </div>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>English Term</th>
            <th>{currentLanguage === 'en' ? 'English' : 'Translated'}</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term, index) => (
            <tr key={index} className={currentLanguage !== 'en' ? 'highlighted' : ''}>
              <td className={currentLanguage === 'en' ? 'active-column' : ''}>
                {term.en}
              </td>
              <td className={currentLanguage !== 'en' ? 'active-column' : ''}>
                {translations[currentLanguage][index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
