import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LANGS, EN_COMP, LANGUAGE_ORDER } from '../data/translationData';
import summaryApi from '../services/summaryApi';
import {
  MOCK_REPORT_KPATEL,
  MOCK_REPORT_YASH_PATEL,
  MOCK_REPORT_AMIRTHA,
  MOCK_REPORT_SARAH_KHAN,
  MOCK_REPORT_RAJESH_KUMAR
} from '../data/mockData';
import '../styles/translation.css';
import Toast from '../components/Toast';
import MyDetailsModal from '../components/MyDetailsModal';
import MyReportsModal from '../components/MyReportsModal';

// Map of reportId to mock report data
const MOCK_REPORTS_MAP = {
  'mock_kpatel_001': MOCK_REPORT_KPATEL,
  'kpatel': MOCK_REPORT_KPATEL,
  'k-patel': MOCK_REPORT_KPATEL,
  'kpatel_blood': MOCK_REPORT_KPATEL,

  'mock_yash_001': MOCK_REPORT_YASH_PATEL,
  'yash': MOCK_REPORT_YASH_PATEL,
  'yash-patel': MOCK_REPORT_YASH_PATEL,
  'yash_fasting': MOCK_REPORT_YASH_PATEL,

  'mock_amirtha_001': MOCK_REPORT_AMIRTHA,
  'amirtha': MOCK_REPORT_AMIRTHA,
  'ms-amirtha': MOCK_REPORT_AMIRTHA,
  'amirtha_blood': MOCK_REPORT_AMIRTHA,

  'mock_sarah_001': MOCK_REPORT_SARAH_KHAN,
  'sarah': MOCK_REPORT_SARAH_KHAN,
  'sarah-khan': MOCK_REPORT_SARAH_KHAN,
  'sarah_lipid': MOCK_REPORT_SARAH_KHAN,

  'mock_rajesh_001': MOCK_REPORT_RAJESH_KUMAR,
  'rajesh': MOCK_REPORT_RAJESH_KUMAR,
  'rajesh-kumar': MOCK_REPORT_RAJESH_KUMAR,
  'rajesh_thyroid': MOCK_REPORT_RAJESH_KUMAR,
};

// Function to get mock report by ID
const getMockReportByID = (reportId) => {
  if (!reportId) return MOCK_REPORT_KPATEL;

  const lowerCaseId = reportId.toLowerCase();
  return MOCK_REPORTS_MAP[lowerCaseId] || MOCK_REPORT_KPATEL;
};

export default function Translation() {
  const { reportId } = useParams();
  const [currentLanguage, setCurrentLanguage] = useState('ta');
  const [toastMessage, setToastMessage] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [reportData, setReportData] = useState(null);
  const [translationData, setTranslationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Fetch report data and translation on mount or when language changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch report summary
        try {
          const summary = await summaryApi.getReportSummary(reportId || 'demo', 'en');
          setReportData(summary);
        } catch (apiError) {
          console.log('API unavailable, using mock data for:', reportId);
          // Use mock data as fallback
          setReportData(getMockReportByID(reportId));
        }

        // Load user name from localStorage
        const stored = localStorage.getItem('userName');
        if (stored) setUserName(stored);
      } catch (error) {
        console.error('Error fetching data:', error);
        setReportData(getMockReportByID(reportId));
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchData();
    } else {
      // No reportId, use default mock data
      setReportData(getMockReportByID(reportId));
      setLoading(false);
    }
  }, [reportId]);

  const switchLanguage = (langCode) => {
    if (langCode === currentLanguage) return;

    setIsFading(true);
    setTimeout(() => {
      setCurrentLanguage(langCode);
      setIsFading(false);
    }, 160);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const copyTranslation = async () => {
    // Use real report data if available, otherwise use mock LANGS data
    const lang = LANGS[currentLanguage];
    if (!lang) return;

    const summaryText = reportData?.medical_summary || lang.summary;
    const plainText = lang.plain.join('\n');
    const text = `${lang.cardTitle}\n\n${summaryText}\n\n${plainText}\n\n${lang.rec}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast('✓ Copied to clipboard');
    } catch (error) {
      showToast('✗ Failed to copy');
    }
  };

  const downloadTranslation = () => {
    const lang = LANGS[currentLanguage];
    if (!lang) return;

    const summaryText = reportData?.medical_summary || lang.summary;
    const plainText = lang.plain.join('\n');
    const text = `${lang.cardTitle}\n\n${summaryText}\n\n${plainText}\n\n${lang.rec}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${currentLanguage}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('✓ Downloaded successfully');
  };

  const shareWhatsApp = () => {
    const lang = LANGS[currentLanguage];
    if (!lang) return;

    const summaryText = reportData?.medical_summary || lang.summary;
    const message = `${lang.cardTitle}\n\n${summaryText}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showToast('✓ Opening WhatsApp');
  };

  const goBack = () => {
    if (reportId) {
      navigate(`/summary/${reportId}`);
    } else {
      navigate('/summary');
    }
  };

  const analyzeAnother = () => {
    navigate('/upload');
  };

  if (loading) {
    return (
      <div className="translation-page">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading translation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="translation-page">
      {/* Navigation Bar */}
      <nav className="translation-navbar">
        <div className="nav-container">
          <div className="nav-left">
            <button className="back-btn" onClick={goBack}>← Back</button>
          </div>
          <div className="nav-right">
            <span className="user-name">{userName}</span>
            <button className="user-icon-btn" onClick={() => setShowDetailsModal(true)}>👤</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="translation-wrapper">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Home</span>
          <span className="separator">›</span>
          <span>Translation</span>
        </div>

        {/* Meta Bar */}
        <div className="meta-bar">
          <div className="meta-left">
            <h1>{reportData?.metadata?.report_name || 'Medical Report Summary'}</h1>
            <p>{reportData?.metadata?.patient_name || 'Patient Report'} • {reportData?.metadata?.report_type || 'Analysis'}</p>
          </div>
          <div className="meta-actions">
            <button className="action-btn copy-btn" onClick={copyTranslation} title="Copy to clipboard">
              📋 Copy
            </button>
            <button className="action-btn download-btn" onClick={downloadTranslation} title="Download as text">
              ⬇️ Download
            </button>
            <button className="action-btn whatsapp-btn" onClick={shareWhatsApp} title="Share on WhatsApp">
              💬 Share
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="language-tabs">
          {LANGUAGE_ORDER.map(code => {
            const lang = LANGS[code];
            return (
              <button
                key={code}
                className={`lang-tab ${currentLanguage === code ? 'active' : ''}`}
                onClick={() => switchLanguage(code)}
                title={lang.name}
              >
                <span className="tab-flag">{lang.flag}</span>
                <span className="tab-name">{lang.native}</span>
              </button>
            );
          })}
        </div>

        <div className="main-layout">
          {/* Main Content Column */}
          <div className="main-column">
            {/* Translation Card */}
            <div className={`fade-content ${isFading ? 'fading' : ''}`} ref={contentRef}>
              <div className="translation-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="header-left">
                    <h2 className="card-title">{LANGS[currentLanguage].cardTitle}</h2>
                    <p className="powered-by">{LANGS[currentLanguage].powered}</p>
                  </div>
                  <span className="ai-badge">{LANGS[currentLanguage].aiBadge}</span>
                </div>

                {/* Summary Section */}
                <div className="section">
                  <h3 className="section-title">📋 Summary</h3>
                  <p className="section-text">{reportData?.medical_summary || LANGS[currentLanguage].summary}</p>
                </div>

                {/* Plain Language Section */}
                <div className="section">
                  <h3 className="section-title">📖 What Does This Mean?</h3>
                  <ul className="plain-list">
                    {LANGS[currentLanguage].plain.map((item, idx) => (
                      <li key={idx} className="plain-item">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Doctor Recommendation Section */}
                <div className="section doctor-section">
                  <h3 className="section-title">👨‍⚕️ Doctor's Recommendation</h3>
                  <p className="section-text">{LANGS[currentLanguage].rec}</p>
                </div>
              </div>

              {/* Comparison Card */}
              <div className="comparison-card">
                <h3 className="card-title">📊 Comparison Table</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>English (Original)</th>
                      <th>{LANGS[currentLanguage].name} (Translation)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EN_COMP.map((eng, idx) => (
                      <tr key={idx}>
                        <td className="eng-term">{eng}</td>
                        <td className="trans-term">{LANGS[currentLanguage].comp[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Language Info Card */}
            <div className="sidebar-card language-info-card">
              <h4 className="sidebar-card-title">ℹ️ Language Info</h4>
              <div className="info-item">
                <span className="info-label">Language</span>
                <span className="info-value">{LANGS[currentLanguage].name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Script</span>
                <span className="info-value">{LANGS[currentLanguage].script}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Speakers</span>
                <span className="info-value">{LANGS[currentLanguage].speakers}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Region</span>
                <span className="info-value">{LANGS[currentLanguage].region}</span>
              </div>
            </div>

            {/* Quality Card */}
            <div className="sidebar-card quality-card">
              <h4 className="sidebar-card-title">⭐ Translation Quality</h4>
              {LANGS[currentLanguage].quality.map((item, idx) => (
                <div key={idx} className="quality-item">
                  <div className="quality-header">
                    <span className="quality-label">{item.l}</span>
                    <span className="quality-percent">{item.p}%</span>
                  </div>
                  <div className="quality-bar">
                    <div className="quality-fill" style={{ width: `${item.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Language Chips Card */}
            <div className="sidebar-card language-chips-card">
              <h4 className="sidebar-card-title">🌍 All Languages</h4>
              <div className="chips-grid">
                {LANGUAGE_ORDER.map(code => (
                  <div key={code} className={`chip ${currentLanguage === code ? 'active' : ''}`}>
                    <span className="chip-flag">{LANGS[code].flag}</span>
                    <span className="chip-name">{LANGS[code].name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Share Card */}
            <div className="sidebar-card export-card">
              <h4 className="sidebar-card-title">📤 Export & Share</h4>
              <button className="export-btn" onClick={copyTranslation}>
                📋 Copy Translation
              </button>
              <button className="export-btn" onClick={downloadTranslation}>
                ⬇️ Download as TXT
              </button>
              <button className="export-btn" onClick={shareWhatsApp}>
                💬 Share on WhatsApp
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="sidebar-card actions-card">
              <h4 className="sidebar-card-title">⚡ Quick Actions</h4>
              <button className="action-link" onClick={goBack}>
                ← Back to Summary
              </button>
              <button className="action-link" onClick={analyzeAnother}>
                📄 Analyze Another
              </button>
              <button className="action-link" onClick={() => setShowReportsModal(true)}>
                📊 My Reports
              </button>
              <button className="action-link" onClick={() => setShowDetailsModal(true)}>
                👤 My Details
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <MyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      <MyReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
