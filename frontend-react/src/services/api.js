/**
 * API Service - Helper functions for API calls
 * Base URL is set from environment variables or defaults to localhost
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Make API request with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
      }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'API request failed');
  }
};

/**
 * Save user details
 */
export const saveUserDetails = async (userDetails) => {
  return apiRequest('/users/details', {
    method: 'POST',
    body: JSON.stringify(userDetails),
  });
};

/**
 * Get user details
 */
export const getUserDetails = async () => {
  return apiRequest('/users/details', {
    method: 'GET',
  });
};

/**
 * Fetch user reports
 */
export const fetchUserReports = async () => {
  return apiRequest('/reports', {
    method: 'GET',
  });
};

/**
 * Upload report file
 */
export const uploadReport = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  // Add metadata to form data
  Object.keys(metadata).forEach(key => {
    formData.append(key, metadata[key]);
  });

  const headers = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/upload-report`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
      }));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'File upload failed');
  }
};

/**
 * Get report analysis/summary
 */
export const getReportAnalysis = async (reportId, language = 'en') => {
  return apiRequest(`/reports/${reportId}/summary?language=${language}`, {
    method: 'GET',
  });
};

/**
 * Delete report
 */
export const deleteReport = async (reportId) => {
  return apiRequest(`/reports/${reportId}`, {
    method: 'DELETE',
  });
};

/**
 * Get report by ID
 */
export const getReportById = async (reportId) => {
  return apiRequest(`/reports/${reportId}`, {
    method: 'GET',
  });
};

/**
 * Update report
 */
export const updateReport = async (reportId, updates) => {
  return apiRequest(`/reports/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }
  
  return response;
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
};

/**
 * Register user
 */
export const registerUser = async (userData) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }
  
  return response;
};

/**
 * Verify auth token
 */
export const verifyToken = async () => {
  try {
    const response = await apiRequest('/auth/verify', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    logoutUser();
    throw error;
  }
};

export default {
  saveUserDetails,
  getUserDetails,
  fetchUserReports,
  uploadReport,
  getReportAnalysis,
  deleteReport,
  getReportById,
  updateReport,
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
};
