/**
 * Summary API Service - Handles report summaries and translations
 * Connects to FastAPI backend for real report data
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get report summary data
 * @param {string} reportId - The report ID
 * @param {string} language - Language code (en, ta, hi, kn)
 * @returns {Promise} Report summary data
 */
export const getReportSummary = async (reportId, language = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Fallback to mock data if real data not available
      console.warn(`Summary endpoint returned ${response.status}, using mock data`);
      return getDefaultMockSummary(reportId);
    }

    const data = await response.json();
    return {
      success: true,
      ...data,
      language: language
    };
  } catch (error) {
    console.error('Error fetching report summary:', error);
    // Return mock data as fallback
    return getDefaultMockSummary(reportId);
  }
};

/**
 * Get report translation in specific language
 * @param {string} reportId - The report ID
 * @param {string} language - Language code (en, ta, hi, kn)
 * @returns {Promise} Translated report data
 */
export const getReportTranslation = async (reportId, language = 'English') => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/translation?language=${language}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Translation endpoint returned ${response.status}, using mock data`);
      return getDefaultMockTranslation(reportId, language);
    }

    const data = await response.json();
    return {
      success: true,
      ...data,
      language: language
    };
  } catch (error) {
    console.error('Error fetching translation:', error);
    return getDefaultMockTranslation(reportId, language);
  }
};

/**
 * Copy summary to clipboard
 */
export const copySummaryToClipboard = async (reportId) => {
  try {
    const summary = await getReportSummary(reportId);
    const text = `${summary.metadata?.report_name || 'Medical Report'}\n\n${summary.medical_summary || ''}`;
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export report as text file
 */
export const exportReportText = async (reportId) => {
  try {
    const summary = await getReportSummary(reportId);
    const content = `ReportEase — AI Medical Summary\n\nReport: ${summary.metadata?.report_name}\nDate: ${summary.metadata?.report_date}\n\n${summary.medical_summary || ''}\n\nCreated: ${summary.created_at}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const filename = `ReportEase_${reportId}.txt`;

    return { success: true, url, filename };
  } catch (error) {
    console.error('Error exporting report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get available languages for report
 */
export const getAvailableLanguages = async (reportId) => {
  try {
    const languages = {
      en: 'English',
      ta: 'தமிழ்',
      hi: 'हिन्दी',
      kn: 'ಕನ್ನಡ'
    };

    return {
      success: true,
      languages,
      available: { en: true, ta: true, hi: true, kn: true }
    };
  } catch (error) {
    console.error('Error fetching available languages:', error);
    return {
      success: false,
      error: error.message,
      languages: { en: 'English', ta: 'தமிழ்', hi: 'हिन्दी', kn: 'ಕನ್ನಡ' },
      available: { en: true, ta: false, hi: false, kn: false }
    };
  }
};

// ============================================================================
// DEFAULT MOCK DATA (Fallback when backend is unavailable)
// ============================================================================

/**
 * Get default mock summary data
 */
const getDefaultMockSummary = (reportId) => {
  return {
    success: false,
    error: 'Backend unavailable - using mock data',
    report_id: reportId,
    metadata: {
      report_name: 'Blood Test Report — March 2025',
      report_date: '02 March 2025',
      patient_name: 'Priya Sharma',
      report_type: 'Blood Test',
    },
    medical_summary: 'Your blood test shows slightly low hemoglobin (11.2 g/dL) indicating mild anemia, and borderline high cholesterol (214 mg/dL). Blood glucose levels are normal at 98 mg/dL. Other values including WBC, RBC, and platelets are within normal ranges.',
    original_text: 'Complete Blood Panel Results...',
    language: 'English',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Get default mock translation
 */
const getDefaultMockTranslation = (reportId, language) => {
  const translations = {
    English: 'Your blood test shows slightly low hemoglobin indicating mild anemia...',
    Tamil: 'உங்கள் இரத்த பரிசோதனை முடிவுகள் லேசான இரத்த சோகை காட்டுகின்றன...',
    Hindi: 'आपके रक्त परीक्षण परिणाम हल्के एनीमिया दिखाते हैं...',
    Kannada: 'ನಿಮ್ಮ ರಕ್ತ ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶಗಳು ಸೌಮ್ಯ ರಕ್ತ ಹೀನತೆ ತೋರಿಸುತ್ತವೆ...'
  };

  return {
    success: false,
    error: 'Backend unavailable - using mock data',
    report_id: reportId,
    language: language,
    translated_text: translations[language] || translations.English,
    simplified_text: 'Your blood test results...',
    metadata: {
      report_name: 'Blood Test Report',
      report_date: new Date().toLocaleDateString(),
      patient_name: 'Patient',
      report_type: 'Blood Test',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export default {
  getReportSummary,
  getReportTranslation,
  copySummaryToClipboard,
  exportReportText,
  getAvailableLanguages
};
