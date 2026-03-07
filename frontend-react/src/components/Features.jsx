import React from 'react';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your medical data is encrypted and processed securely with HIPAA compliance'
    },
    {
      id: 2,
      icon: '🌐',
      title: 'Multi-Language Support',
      description: 'Get analysis in Tamil, Hindi, Kannada, and English'
    },
    {
      id: 3,
      icon: '⚡',
      title: 'Instant Analysis',
      description: 'AI-powered insights generated in seconds, not hours'
    }
  ];

  return (
    <section id="features" className="features">
      <h2 className="section-title">Why Choose ReportEase?</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
