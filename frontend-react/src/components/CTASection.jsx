import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Understand Your Medical Reports?</h2>
        <p className="cta-subtitle">
          Join thousands of users who trust ReportEase for accurate, instant medical report analysis
        </p>
        <button 
          className="cta-btn"
          onClick={() => navigate('/upload')}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};

export default CTASection;
