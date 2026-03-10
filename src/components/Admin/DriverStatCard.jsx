import React from 'react';

const DriverStatCard = ({ icon, count, label, isActive, onClick }) => {
  return (
    <div 
      className={`driver-stat-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="stat-icon-large">{icon}</div>
      <div className="stat-number">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default DriverStatCard;