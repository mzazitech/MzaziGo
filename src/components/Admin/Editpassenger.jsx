import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { liveMapData } from '../../data/Admin/liveMapData';
import { updateStoredPassenger } from '../../utils/Admin/entityStore';
import '../../styles/Admin/AddPassenger.css';

const EditPassenger = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passenger = location.state?.passenger;
  
  // ถ้าไม่มีข้อมูล passenger ให้กลับไปหน้า Passenger List
  if (!passenger) {
    navigate('/admin/passenger-list');
    return null;
  }

  const [formData, setFormData] = useState({
    firstName: passenger.name.split(' ')[0] || '',
    lastName: passenger.name.split(' ')[1] || '',
    email: passenger.email || '',
    phoneNumber: passenger.phone || '',
    dateOfBirth: passenger.dateOfBirth || '',
    gender: passenger.gender || '',
    identityType: passenger.identityType || '',
    identityNumber: passenger.identityNumber || '',
    username: passenger.username || '',
    password: '',
    confirmPassword: ''
  });

  const [documents, setDocuments] = useState({
    passengerImage: passenger.avatar || null,
    otherDocument: passenger.documents?.otherDocument || null,
    idCard: passenger.documents?.idCard || null
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
    // Reset กลับไปเป็นข้อมูลเดิม
    setFormData({
      firstName: passenger.name.split(' ')[0] || '',
      lastName: passenger.name.split(' ')[1] || '',
      email: passenger.email || '',
      phoneNumber: passenger.phone || '',
      dateOfBirth: passenger.dateOfBirth || '',
      gender: passenger.gender || '',
      identityType: passenger.identityType || '',
      identityNumber: passenger.identityNumber || '',
      username: passenger.username || '',
      password: '',
      confirmPassword: ''
    });
    setDocuments({
      passengerImage: passenger.avatar || null,
      otherDocument: passenger.documents?.otherDocument || null,
      idCard: passenger.documents?.idCard || null
    });
  };

  const handleDone = () => {
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    const updatedPassenger = {
      ...passenger,
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phoneNumber,
      avatar: documents.passengerImage,
      documents
    };

    const passengerIndex = liveMapData.passengers.findIndex((p) => p.id === passenger.id);
    if (passengerIndex !== -1) {
      liveMapData.passengers[passengerIndex] = {
        ...liveMapData.passengers[passengerIndex],
        ...updatedPassenger
      };
    }

    updateStoredPassenger(updatedPassenger);
    if (typeof liveMapData.syncDynamicData === 'function') {
      liveMapData.syncDynamicData();
    }
    
    alert('Passenger information updated successfully!');
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
        <h2>EDIT PASSENGER INFORMATION - {passenger.id}</h2>
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

            <div className="form-group-add">
              <label>Date Of Birth <span className="required">*</span></label>
              <input type="date" name="dateOfBirth" placeholder="DD/MM/YY" value={formData.dateOfBirth} onChange={handleChange} />
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
              <input type="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
            </div>
            <div className="form-group-add">
              <label>Confirm Password <span className="required">*</span></label>
              <input type="password" name="confirmPassword" placeholder="Leave blank to keep current" value={formData.confirmPassword} onChange={handleChange} />
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
        <button className="btn-done-add" onClick={handleDone}>UPDATE</button>
      </div>
    </div>
  );
};

export default EditPassenger;