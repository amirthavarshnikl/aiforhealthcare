import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadDropzone from '../components/UploadDropzone';
import ProgressBar from '../components/ProgressBar';
import ReportDetailsForm from '../components/ReportDetailsForm';
import ResultSection from '../components/ResultSection';
import MyDetailsModal from '../components/MyDetailsModal';
import MyReportsModal from '../components/MyReportsModal';
import { uploadReport } from '../services/uploadApi';
import '../styles/upload.css';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showProgress, setShowProgress] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: '',
    reportDate: '',
    patientName: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(stored);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      setFormData((prev) => ({
        ...prev,
        reportName: selectedFile.name.replace(/\.[^.]+$/, ''),
      }));
    }
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20 MB limit');
      return;
    }
    setSelectedFile(file);
    setShowProgress(true);
  };

  const handleProgressComplete = () => {
    setShowProgress(false);
    setShowForm(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  const handleAnalyze = async () => {
    if (!formData.reportName || !formData.reportType || !formData.reportDate || !formData.patientName) {
      alert('Please fill in all report details before analyzing');
      return;
    }

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Upload report to backend
      const result = await uploadReport(selectedFile, {
        reportName: formData.reportName,
        reportType: formData.reportType,
        reportDate: formData.reportDate,
        patientName: formData.patientName,
        language: selectedLanguage,
      });

      if (!result.report_id) {
        throw new Error('No report ID returned from server');
      }

      // Show result and redirect
      setShowResult(true);
      localStorage.setItem('lastReportId', result.report_id);
      localStorage.setItem('userName', formData.patientName);

      // Redirect to summary page after 2 seconds
      setTimeout(() => {
        navigate(`/summary/${result.report_id}`);
      }, 2000);
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      alert(`Analysis failed: ${error.message || 'Please try again.'}`);
      setIsAnalyzing(false);
      setShowResult(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setShowProgress(false);
    setShowForm(false);
    setShowResult(false);
    setFormData({
      reportName: '',
      reportType: '',
      reportDate: '',
      patientName: '',
    });
  };

  const handleAnalyzeAnother = () => {
    handleRemoveFile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      <div className="page">
        <div className="page-header">
          <div className="page-tag">Upload &amp; Analyse</div>
          <h1>Upload Your Medical Report</h1>
          <p>Drop your file below. We'll read it, simplify it, and translate it — in seconds.</p>
        </div>

        <div className="layout">
          <UploadDropzone
            onFileSelect={handleFileSelect}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />

          <div className="card">
            <div className="card-title">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              File Preview
            </div>

            {!selectedFile ? (
              <div className="empty-state" id="emptyState">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p>No file selected yet. Upload a report to see a preview here.</p>
              </div>
            ) : (
              <>
                <div className="file-chip show" id="fileChip">
                  <div className="chip-thumb">
                    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="chip-meta">
                    <div className="chip-name" id="chipName">
                      {selectedFile.name}
                    </div>
                    <div className="chip-size" id="chipSize">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button className="chip-remove" onClick={handleRemoveFile} title="Remove">
                    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <ProgressBar isRunning={showProgress} onComplete={handleProgressComplete} />

                {showForm && (
                  <ReportDetailsForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <ResultSection
          isVisible={showResult}
          onAnalyzeAnother={handleAnalyzeAnother}
        />
      </div>

      {/* Modals */}
      <MyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onNameUpdate={setUserName}
      />
      <MyReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />
    </div>
  );
}
