import React, { useState } from 'react';

export default function DetailsModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
  });

  const [bmi, setBmi] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'height' || name === 'weight') {
      calculateBMI({ ...formData, [name]: value });
    }
  };

  const calculateBMI = (data) => {
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const weightKg = parseFloat(data.weight);
      const calculatedBMI = (weightKg / (heightM * heightM)).toFixed(1);
      setBmi(calculatedBMI);
    }
  };

  const getBMICategory = () => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">My Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-input"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height"
                className="form-input"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 170"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className="form-input"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
              />
            </div>
          </div>

          {bmi && (
            <div className="bmi-result">
              <div className="bmi-value">BMI: {bmi}</div>
              <div className="bmi-category">Category: {getBMICategory()}</div>
            </div>
          )}
        </form>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Save</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
