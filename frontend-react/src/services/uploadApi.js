/**
 * Upload Report Service - Handles file upload to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Upload medical report file to backend for processing
 * @param {File} file - The medical report file to upload
 * @param {Object} metadata - Report metadata (name, type, date, patient name)
 * @returns {Promise} Upload result with report_id
 */
export async function uploadReport(file, metadata = {}) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata fields
    formData.append('language', metadata.language || 'English');
    formData.append('user_id', metadata.user_id || localStorage.getItem('userId') || 'demo_user');
    formData.append('report_name', metadata.reportName || '');
    formData.append('report_type', metadata.reportType || '');
    formData.append('report_date', metadata.reportDate || '');
    formData.append('patient_name', metadata.patientName || '');

    const response = await fetch(`${API_BASE_URL}/upload-report`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
      }));
      throw new Error(error.detail || error.message || `Upload failed: ${response.status}`);
    }

    const data = await response.json();

    // Extract report_id from the response
    const report_id = data.report_id || data._id || `report_${Date.now()}`;

    return {
      report_id,
      status: 'success',
      message: 'Report uploaded and processed successfully',
      metadata: metadata,
      fileName: file.name,
      ...data
    };
  } catch (error) {
    console.error('Upload error:', error);

    // Provide better error messages
    let errorMessage = error.message || 'File upload failed';

    if (error.message === 'Failed to fetch') {
      errorMessage = 'Cannot connect to backend server at http://localhost:8000. Is the backend running?';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Server returned invalid response. Backend may be having issues.';
    }

    console.error('Detailed error:', {
      message: errorMessage,
      originalError: error.message,
      url: `${API_BASE_URL}/upload-report`,
      backendUrl: 'http://localhost:8000'
    });

    throw new Error(errorMessage);
  }
}
