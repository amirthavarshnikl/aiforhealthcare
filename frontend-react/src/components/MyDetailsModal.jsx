import React, { useState, useEffect } from 'react';
import { saveUserDetails } from '../services/api';

const MyDetailsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    email: '',
    phone: ''
  });

  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = weightInKg / (heightInMeters * heightInMeters);
        setBmi(bmiValue.toFixed(1));

        // Determine BMI category
        if (bmiValue < 18.5) {
          setBmiCategory('Underweight');
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
          setBmiCategory('Normal weight');
        } else if (bmiValue >= 25 && bmiValue < 30) {
          setBmiCategory('Overweight');
        } else {
          setBmiCategory('Obese');
        }
      }
    } else {
      setBmi(null);
      setBmiCategory('');
    }
  }, [formData.height, formData.weight]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await saveUserDetails(formData);
      setSuccess('Details saved successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">My Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="details-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="30"
                min="1"
                max="150"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="170"
                min="50"
                max="300"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="70"
                min="10"
                max="500"
                step="0.1"
              />
            </div>
          </div>

          {bmi && (
            <div className="bmi-result">
              <div className="bmi-display">
                <span className="bmi-label">BMI:</span>
                <span className="bmi-value">{bmi}</span>
                <span className="bmi-category">{bmiCategory}</span>
              </div>
              <div className="bmi-scale">
                <div className="bmi-scale-item underweight">Underweight: &lt;18.5</div>
                <div className="bmi-scale-item normal">Normal: 18.5-25</div>
                <div className="bmi-scale-item overweight">Overweight: 25-30</div>
                <div className="bmi-scale-item obese">Obese: &gt;30</div>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button 
            type="submit" 
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyDetailsModal;
