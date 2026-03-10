// components/AddCouponForm.jsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import '../../styles/Admin/CouponSetup.css';

const AddCouponForm = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    type: 'Percentage',
    amount: '',
    startDate: '',
    endDate: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    applicableFor: '',
    category: '',
    region: '',
    note: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.applicableFor) newErrors.applicableFor = 'Applicable for is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      code: '',
      type: 'Percentage',
      amount: '',
      startDate: '',
      endDate: '',
      minOrder: '',
      maxDiscount: '',
      usageLimit: '',
      applicableFor: '',
      category: '',
      region: '',
      note: ''
    });
    setErrors({});
  };

  return (
    <div className="coupon-setup-container">
      <div className="coupon-setup-main">
        {/* HEADER */}
        <div className="coupon-setup-header">
          <button className="coupon-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1>ADD COUPON</h1>
        </div>

        {/* FORM */}
        <form className="coupon-form-container" onSubmit={handleSubmit}>
          
          {/* COUPON INFORMATION */}
          <div className="coupon-form-section">
            <h2 className="coupon-form-section-title">COUPON INFORMATION</h2>
            
            <div className="coupon-form-grid">
              <div className="coupon-form-group">
                <label>COUPON TITLE <span className="required">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Type here..."
                />
                {errors.title && <span className="coupon-form-hint">{errors.title}</span>}
              </div>

              <div className="coupon-form-group">
                <label>COUPON DESCRIPTION</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Type here..."
                />
              </div>

              <div className="coupon-form-group">
                <label>COUPON CODE <span className="required">*</span></label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., WELCOME10"
                />
                {errors.code && <span className="coupon-form-hint">{errors.code}</span>}
              </div>
            </div>
          </div>

          {/* COUPON SETUP */}
          <div className="coupon-form-section">
            <h2 className="coupon-form-section-title">COUPON SETUP</h2>
            
            <div className="coupon-form-grid">
              <div className="coupon-form-group">
                <label>COUPON TYPE <span className="required">*</span></label>
                <div className="coupon-type-group">
                  <div className="coupon-type-option">
                    <input
                      type="radio"
                      id="type-percentage"
                      name="type"
                      value="Percentage"
                      checked={formData.type === 'Percentage'}
                      onChange={handleChange}
                    />
                    <label htmlFor="type-percentage">Percentage</label>
                  </div>
                  <div className="coupon-type-option">
                    <input
                      type="radio"
                      id="type-fixed"
                      name="type"
                      value="Fixed Amount"
                      checked={formData.type === 'Fixed Amount'}
                      onChange={handleChange}
                    />
                    <label htmlFor="type-fixed">Fixed Amount</label>
                  </div>
                </div>
              </div>

              <div className="coupon-form-group">
                <label>COUPON AMOUNT <span className="required">*</span></label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
                {errors.amount && <span className="coupon-form-hint">{errors.amount}</span>}
              </div>

              <div className="coupon-form-group">
                <label>START DATE <span className="required">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && <span className="coupon-form-hint">{errors.startDate}</span>}
              </div>
            </div>

            <div className="coupon-form-grid">
              <div className="coupon-form-group">
                <label>END DATE <span className="required">*</span></label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && <span className="coupon-form-hint">{errors.endDate}</span>}
              </div>

              <div className="coupon-form-group">
                <label>MINIMUM ORDER</label>
                <input
                  type="number"
                  name="minOrder"
                  value={formData.minOrder}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="coupon-form-group">
                <label>MAXIMUM DISCOUNT LIMIT</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="coupon-form-grid">
              <div className="coupon-form-group">
                <label>USAGE LIMIT (Per user)</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="e.g., 1000"
                  min="0"
                />
              </div>

              <div className="coupon-form-group">
                <label>NOTE</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Type here..."
                />
              </div>
            </div>
          </div>

          {/* COUPON AVAILABILITY */}
          <div className="coupon-form-section">
            <h2 className="coupon-form-section-title">COUPON AVAILABILITY</h2>
            
            <div className="coupon-form-grid">
              <div className="coupon-form-group">
                <label>APPLICABLE FOR <span className="required">*</span></label>
                <select
                  name="applicableFor"
                  value={formData.applicableFor}
                  onChange={handleChange}
                >
                  <option value="">-- Select --</option>
                  <option value="New Riders">New Riders</option>
                  <option value="All Users">All Users</option>
                  <option value="Members">Members</option>
                  <option value="First-Time Users">First-Time Users</option>
                  <option value="Students">Students</option>
                </select>
                {errors.applicableFor && <span className="coupon-form-hint">{errors.applicableFor}</span>}
              </div>

              <div className="coupon-form-group">
                <label>CATEGORY <span className="required">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">-- Select Category --</option>
                  <option value="Taxi Ride">Taxi Ride</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                  <option value="Premium Taxi">Premium Taxi</option>
                  <option value="Standard Ride">Standard Ride</option>
                  <option value="Daily Ride">Daily Ride</option>
                  <option value="Night Ride">Night Ride</option>
                </select>
                {errors.category && <span className="coupon-form-hint">{errors.category}</span>}
              </div>

              <div className="coupon-form-group">
                <label>REGION <span className="required">*</span></label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option value="">-- Select Region --</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Chiang Mai">Chiang Mai</option>
                  <option value="Phuket">Phuket</option>
                  <option value="Pattaya">Pattaya</option>
                  <option value="Chachoengsao">Chachoengsao</option>
                  <option value="Rayong">Rayong</option>
                </select>
                {errors.region && <span className="coupon-form-hint">{errors.region}</span>}
              </div>
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="coupon-form-actions">
            <button type="button" className="coupon-btn-reset" onClick={handleReset}>
              RESET
            </button>
            <button type="submit" className="coupon-btn-done">
              DONE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponForm;