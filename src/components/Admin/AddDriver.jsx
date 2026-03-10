import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveMapData } from '../../data/Admin/liveMapData';
import { persistDriver } from '../../utils/Admin/entityStore';
import '../../styles/Admin/AddDriver.css';

const AddDriver = () => {
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
    confirmPassword: '',
    vehicleCategory: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: '',
    plateNumber: '',
    notes: ''
  });

  const [documents, setDocuments] = useState({
    driverImage: null,
    otherDocument: null,
    driverLicense: null,
    publicDriverLicense: null,
    idCard: null,
    criminalRecord: null,
    vehicleRegistration: null,
    compulsoryInsurance: null,
    commercialInsurance: null,
    eSticker: null,
    vehicleFront: null,
    vehicleBack: null,
    vehicleLeft: null,
    vehicleRight: null
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
      confirmPassword: '',
      vehicleCategory: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleColor: '',
      vehicleYear: '',
      plateNumber: '',
      notes: ''
    });
    setDocuments({
      driverImage: null,
      otherDocument: null,
      driverLicense: null,
      publicDriverLicense: null,
      idCard: null,
      criminalRecord: null,
      vehicleRegistration: null,
      compulsoryInsurance: null,
      commercialInsurance: null,
      eSticker: null,
      vehicleFront: null,
      vehicleBack: null,
      vehicleLeft: null,
      vehicleRight: null
    });
  };

  const handleDone = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newDriverId = `D${String(liveMapData.drivers.all.length + 1).padStart(3, '0')}`;
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const vehicleModel = formData.vehicleModel || '';
    const vehicleBrand = formData.vehicleBrand || '';
    const combinedVehicle = [vehicleBrand, vehicleModel].filter(Boolean).join(' ').trim();
    const newDriver = {
      id: newDriverId,
      name,
      email: formData.email,
      phone: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      identityType: formData.identityType,
      identityNumber: formData.identityNumber,
      username: formData.username,
      licenseType: formData.vehicleCategory || 'CAR',
      vehicleBrand,
      vehicleModel,
      vehicle: combinedVehicle || formData.vehicleCategory || 'Vehicle',
      vehicleColor: formData.vehicleColor,
      vehicleYear: formData.vehicleYear,
      plateNumber: formData.plateNumber,
      notes: formData.notes,
      status: 'idle',
      location: { lat: 13.7563, lng: 100.5018 },
      avatar: documents.driverImage,
      rating: 5.0,
      totalRides: 0,
      earning: 0,
      joinDate: new Date().toLocaleDateString('th-TH'),
      lastActive: new Date().toLocaleDateString('th-TH'),
      documentVerified: false,
      documents: { ...documents }
    };

    liveMapData.drivers.all.push(newDriver);
    persistDriver(newDriver);
    if (typeof liveMapData.syncDynamicData === 'function') {
      liveMapData.syncDynamicData();
    }

    alert('Driver added successfully!');
    // กลับไปหน้า Driver List
    navigate('/admin/driver-list');
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
    <div className="add-driver-container">
      <div className="add-driver-header">
        <button className="back-to-driver-list" onClick={() => navigate('/admin/driver-list')}>
          <ArrowLeft size={20} />
        </button>
        <h2>ADD NEW DRIVER INFORMATION</h2>
      </div>

      <div className="add-driver-content">
        {/* Driver Image */}
        <div className="section-column">
          <h3 className="section-title-add">DRIVER IMAGE</h3>
          {renderUploadBox('driverImage', 'Driver Photo')}
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

      {/* Driver Documents Section */}
      <div className="documents-section">
        <h3 className="section-title-add">DRIVER DOCUMENTS</h3>
        <div className="documents-grid">
          {renderUploadBox('driverLicense', 'ใบขับขี่')}
          {renderUploadBox('publicDriverLicense', 'ใบขับขี่สาธารณะ')}
          {renderUploadBox('criminalRecord', 'เอกสารตรวจสอบประวัติอาชญากรรม')}
          {renderUploadBox('vehicleRegistration', 'เอกสารการจดทะเบียนยานพาหนะ')}
          {renderUploadBox('compulsoryInsurance', 'ประกันภาคบังคับ (พรบ.)')}
          {renderUploadBox('commercialInsurance', 'ประกันรถยนต์เชิงพาณิชย์')}
          {renderUploadBox('eSticker', 'สติ๊กเกอร์รถยนต์รับจ้างผ่านระบบอิเล็กทรอนิกส์')}
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="vehicle-section">
        <h3 className="section-title-add">VEHICLE DETAILS</h3>
        <div className="form-grid-add">
          <div className="form-group-add">
            <label>Category <span className="required">*</span></label>
            <select name="vehicleCategory" value={formData.vehicleCategory} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="VAN">Van</option>
            </select>
          </div>
          <div className="form-group-add">
            <label>Brand <span className="required">*</span></label>
            <input type="text" name="vehicleBrand" value={formData.vehicleBrand} onChange={handleChange} />
          </div>
          <div className="form-group-add">
            <label>Model <span className="required">*</span></label>
            <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} />
          </div>
          <div className="form-group-add">
            <label>Color <span className="required">*</span></label>
            <input type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
          </div>
          <div className="form-group-add">
            <label>Year <span className="required">*</span></label>
            <input type="text" name="vehicleYear" value={formData.vehicleYear} onChange={handleChange} />
          </div>
          <div className="form-group-add">
            <label>Plate Number <span className="required">*</span></label>
            <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group-add full-width" style={{ marginTop: '20px' }}>
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder="ใส่หมายเหตุเพิ่มเติม เช่น ประวัติการทำงาน หรือข้อมูลเพิ่มเติมใดๆ"
          ></textarea>
        </div>

        {/* Vehicle Photos */}
        <h3 className="section-title-add" style={{ marginTop: '30px' }}>VEHICLE PHOTO</h3>
        <div className="vehicle-photos-grid">
          {renderUploadBox('vehicleFront', 'Front')}
          {renderUploadBox('vehicleBack', 'Back')}
          {renderUploadBox('vehicleLeft', 'Left')}
          {renderUploadBox('vehicleRight', 'Right')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="add-driver-actions">
        <button className="btn-reset-add" onClick={handleReset}>RESET</button>
        <button className="btn-done-add" onClick={handleDone}>DONE</button>
      </div>
    </div>
  );
};

export default AddDriver;