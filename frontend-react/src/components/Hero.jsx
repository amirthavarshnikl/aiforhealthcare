import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Smart Medical Report Analysis</h1>
        <p className="hero-subtitle">
          Upload your medical reports and get instant insights with AI-powered analysis in your language
        </p>
        <button 
          className="hero-btn"
          onClick={() => navigate('/upload')}
        >
          📤 Upload Your Report
        </button>
      </div>
      <div className="hero-image">
        <div className="hero-image-placeholder">
          📊
        </div>
      </div>
    </section>
  );
};

export default Hero;
