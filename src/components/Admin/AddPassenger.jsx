import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveMapData } from '../../data/Admin/liveMapData';
import { persistPassenger } from '../../utils/Admin/entityStore';
import '../../styles/Admin/AddPassenger.css';

const AddPassenger = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    identityType: '',
    identityNumber: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [documents, setDocuments] = useState({
    passengerImage: null,
    otherDocument: null,
    idCard: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments({
          ...documents,
          [docType]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      identityType: '',
      identityNumber: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setDocuments({
      passengerImage: null,
      otherDocument: null,
      idCard: null
    });
  };

  const handleDone = () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newPassengerId = `P${String(liveMapData.passengers.length + 1).padStart(3, '0')}`;
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const newPassenger = {
      id: newPassengerId,
      name,
      email: formData.email,
      phone: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      identityType: formData.identityType,
      identityNumber: formData.identityNumber,
      username: formData.username,
      totalRides: 0,
      totalSpent: 0,
      totalCanceled: 0,
      joinDate: new Date().toLocaleDateString('th-TH'),
      lastActive: new Date().toLocaleDateString('th-TH'),
      avatar: documents.passengerImage,
      documents: { ...documents }
    };

    liveMapData.passengers.push(newPassenger);
    persistPassenger(newPassenger);
    if (typeof liveMapData.syncDynamicData === 'function') {
      liveMapData.syncDynamicData();
    }

    alert('Passenger added successfully!');
    navigate('/admin/passenger-list');
  };

  const renderUploadBox = (docType, label) => (
    <div className="upload-section">
      <label className="upload-label-text">{label}</label>
      <div className="upload-box-small">
        <input
          type="file"
          id={docType}
          accept="image/*"
          onChange={(e) => handleFileUpload(e, docType)}
          style={{ display: 'none' }}
        />
        <label htmlFor={docType} className="upload-area">
          {documents[docType] ? (
            <img src={documents[docType]} alt={label} className="uploaded-preview" />
          ) : (
            <div className="upload-placeholder-small">
              <Upload size={30} color="#999" />
            </div>
          )}
        </label>
        <button 
          className="upload-link-small"
          onClick={() => document.getElementById(docType).click()}
        >
          Click To Upload
        </button>
      </div>
    </div>
  );

  return (
    <div className="add-passenger-container">
      <div className="add-passenger-header">
        <button className="back-to-passenger-list" onClick={() => navigate('/admin/passenger-list')}>
          <ArrowLeft size={20} />
        </button>
        <h2>ADD NEW PASSENGER INFORMATION</h2>
      </div>

      <div className="add-passenger-content">
        {/* Passenger Image */}
        <div className="section-column">
          <h3 className="section-title-add">PASSENGER IMAGE</h3>
          {renderUploadBox('passengerImage', 'Passenger Photo')}
        </div>

        {/* General Information */}
        <div className="section-column main-section">
          <h3 className="section-title-add">GENERAL INFORMATION</h3>
          <div className="form-grid-add">
            <div className="form-group-add">
              <label>First Name <span className="required">*</span></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Last Name <span className="required">*</span></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Email <span className="required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Phone Number <span className="required">*</span></label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="date-picker-wrapper">
              <label>Date of Birth <span className="required">*</span></label>
              <input
                 type="date"
                 name="dateOfBirth"
                 value={formData.dateOfBirth}
                 onChange={handleChange}
                 className="date-input"
               />
           </div>
            <div className="form-group-add">
              <label>Gender <span className="required">*</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Identity Information */}
          <h3 className="section-title-add" style={{ marginTop: '30px' }}>IDENTITY INFORMATION</h3>
          <div className="form-grid-add">
            <div className="form-group-add">
              <label>Identity Type <span className="required">*</span></label>
              <select name="identityType" value={formData.identityType} onChange={handleChange}>
                <option value="">Select Identity Type</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="National ID">National ID</option>
              </select>
            </div>
            <div className="form-group-add">
              <label>Identity Card Image <span className="required">*</span></label>
              <div className="inline-upload">
                <input
                  type="file"
                  id="identityCard"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'idCard')}
                  style={{ display: 'none' }}
                />
                <button onClick={() => document.getElementById('identityCard').click()} className="upload-btn-inline">
                  {documents.idCard ? 'Change Image' : 'Click to Upload'}
                </button>
              </div>
              {documents.idCard && (
                <div className="identity-preview">
                  <img src={documents.idCard} alt="Identity Card Preview" />
                </div>
              )}
            </div>
            <div className="form-group-add full-width">
              <label>Identity Number <span className="required">*</span></label>
              <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange} />
            </div>
          </div>

          {/* Account Information */}
          <h3 className="section-title-add" style={{ marginTop: '30px' }}>ACCOUNT INFORMATION</h3>
          <div className="form-grid-add">
            <div className="form-group-add">
              <label>Username <span className="required">*</span></label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Password <span className="required">*</span></label>
              <input type="password" name="password" placeholder="************" value={formData.password} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Confirm Password <span className="required">*</span></label>
              <input type="password" name="confirmPassword" placeholder="************" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Other Documents */}
        <div className="section-column">
          <h3 className="section-title-add">OTHER DOCUMENT</h3>
          {renderUploadBox('otherDocument', 'Additional Document')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="add-passenger-actions">
        <button className="btn-reset-add" onClick={handleReset}>RESET</button>
        <button className="btn-done-add" onClick={handleDone}>DONE</button>
      </div>
    </div>
  );
};

export default AddPassenger;