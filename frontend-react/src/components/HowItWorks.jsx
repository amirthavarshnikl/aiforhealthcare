import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      number: '1',
      icon: '📤',
      title: 'Upload Report',
      description: 'Select and upload your medical report in PDF or image format'
    },
    {
      id: 2,
      number: '2',
      icon: '🤖',
      title: 'AI Analysis',
      description: 'Our AI engine analyzes the report and extracts key information'
    },
    {
      id: 3,
      number: '3',
      icon: '🌐',
      title: 'Choose Language',
      description: 'Select your preferred language for the analysis'
    },
    {
      id: 4,
      number: '4',
      icon: '📊',
      title: 'Get Insights',
      description: 'Receive detailed, easy-to-understand insights about your report'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step">
            <div className="step-circle">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
            {index < steps.length - 1 && <div className="step-arrow">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
