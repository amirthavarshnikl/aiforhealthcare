import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LanguageSelector from '../components/LanguageSelector';
import { uploadReport } from '../services/api';
import '../styles/upload.css';

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState({
    report_name: '',
    report_type: '',
    report_date: '',
    patient_name: ''
  });
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setMetadata({
      ...metadata,
      report_name: selectedFile.name
    });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata({
      ...metadata,
      [name]: value
    });
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      const result = await uploadReport(
        file,
        language,
        localStorage.getItem('userId') || 'demo_user',
        metadata
      );

      clearInterval(progressInterval);
      setProgress(100);

      // Store result in localStorage
      localStorage.setItem('currentReport', JSON.stringify(result));

      // Add to reports list
      const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
      reports.unshift({
        id: result.report_id || Date.now(),
        name: metadata.report_name || file.name,
        date: metadata.report_date || new Date().toLocaleDateString(),
        ...result
      });
      localStorage.setItem('userReports', JSON.stringify(reports.slice(0, 20)));

      // Redirect to summary
      setTimeout(() => {
        navigate('/summary');
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Error uploading report. ';
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Backend is not running. Make sure it\'s running at http://127.0.0.1:8000';
      } else if (error.message.includes('Upload failed')) {
        errorMessage += 'Backend returned an error. Check the backend logs.';
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Your Medical Report</h1>
        <p className="subtitle">
          Upload a PDF or image of your medical report and we'll analyze it for you.
        </p>

        <div className="upload-grid">
          <div className="upload-card">
            <UploadBox onFileSelect={handleFileSelect} />
            <LanguageSelector onLanguageChange={handleLanguageChange} />
          </div>

          <div className="upload-card metadata-card">
            <h2>Report Details</h2>
            <div className="form-group">
              <label>Report Name</label>
              <input
                type="text"
                name="report_name"
                placeholder="e.g. Blood Test — March 2025"
                value={metadata.report_name}
                onChange={handleMetadataChange}
              />
            </div>

            <div className="form-group">
              <label>Report Type</label>
              <select
                name="report_type"
                value={metadata.report_type}
                onChange={handleMetadataChange}
              >
                <option value="">Select type</option>
                <option>Blood Test</option>
                <option>X-Ray / Scan</option>
                <option>Discharge Summary</option>
                <option>Prescription</option>
                <option>Pathology Report</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Report Date</label>
              <input
                type="date"
                name="report_date"
                value={metadata.report_date}
                onChange={handleMetadataChange}
              />
            </div>

            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                name="patient_name"
                placeholder="e.g. Priya Sharma"
                value={metadata.patient_name}
                onChange={handleMetadataChange}
              />
            </div>

            {loading && (
              <div className="progress-wrap">
                <div className="prog-labels">
                  <span id="progTxt">Processing report...</span>
                  <span id="progPct">{Math.round(progress)}%</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            <button
              className={`btn-analyze ${file ? 'show' : ''}`}
              onClick={handleAnalyze}
              disabled={loading || !file}
            >
              {loading ? 'Analyzing...' : 'Analyze Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
