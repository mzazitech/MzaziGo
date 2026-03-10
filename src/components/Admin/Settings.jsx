import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import '../../styles/Admin/Settings.css';

const Settings = () => {
  const defaultFormData = {
    firstName: 'Thunder',
    lastName: 'Admin',
    email: 'Thunder@admin.com',
    phoneNumber: '+66 02 123 4567',
    dateOfBirth: '01/01/1990',
    gender: 'other',
    username: 'ThunderAdmin',
    password: '',
    confirmPassword: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [driverImage, setDriverImage] = useState(null);
  const [otherDocument, setOtherDocument] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('adminProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setFormData(prev => ({
          ...prev,
          ...parsedProfile
        }));
      } catch (error) {
        console.error('Failed to load admin profile', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'driver') {
          setDriverImage(reader.result);
        } else {
          setOtherDocument(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setDriverImage(null);
    setOtherDocument(null);
  };

  const handleDone = () => {
    localStorage.setItem('adminProfile', JSON.stringify(formData));
    if (formData.email) {
      localStorage.setItem('adminEmail', formData.email);
    }
    window.dispatchEvent(new Event('adminProfileUpdated'));
    if (typeof window.__forceAdminReload === 'function') {
      window.__forceAdminReload();
    }
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>ADMIN INFORMATION</h2>
        <div className="header-icons">
          <span className="bell-icon">🔔</span>
          <span className="user-icon">👤</span>
        </div>
      </div>

      <div className="settings-content">
        {/* Driver Image Section */}
        <div className="settings-section">
          <h3 className="section-title">DRIVER IMAGE</h3>
          <div className="upload-box">
            <input
              type="file"
              id="driver-image"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'driver')}
              style={{ display: 'none' }}
            />
            <label htmlFor="driver-image" className="upload-label">
              {driverImage ? (
                <img src={driverImage} alt="Driver" className="uploaded-image" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} color="#999" />
                </div>
              )}
            </label>
            <button 
              className="upload-link"
              onClick={() => document.getElementById('driver-image').click()}
            >
              Click To Upload
            </button>
          </div>
        </div>

        {/* General Information Section */}
        <div className="settings-section general-info">
          <h3 className="section-title">GENERAL INFORMATION</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name <span className="required">*</span></label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Date Of Birth <span className="required">*</span></label>
              <input
                type="text"
                name="dateOfBirth"
                placeholder="DD/MM/YY"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender <span className="required">*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="settings-section account-info">
          <h3 className="section-title">ACCOUNT INFORMATION</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Username <span className="required">*</span></label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password <span className="required">*</span></label>
              <input
                type="password"
                name="password"
                placeholder="************"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password <span className="required">*</span></label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="************"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Other Document Section */}
        <div className="settings-section">
          <h3 className="section-title">OTHER DOCUMENT</h3>
          <div className="upload-box">
            <input
              type="file"
              id="other-document"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'other')}
              style={{ display: 'none' }}
            />
            <label htmlFor="other-document" className="upload-label">
              {otherDocument ? (
                <img src={otherDocument} alt="Document" className="uploaded-image" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={40} color="#999" />
                </div>
              )}
            </label>
            <button 
              className="upload-link"
              onClick={() => document.getElementById('other-document').click()}
            >
              Click To Upload
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button className="btn-reset" onClick={handleReset}>RESET</button>
        <button className="btn-done" onClick={handleDone}>DONE</button>
      </div>
    </div>
  );
};

export default Settings;