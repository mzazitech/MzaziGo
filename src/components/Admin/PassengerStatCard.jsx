import React from 'react';
import '../../styles/Admin/PassengerList.css';

const PassengerStatCard = ({ icon, count, label, isActive, onClick }) => {
  return (
    <div 
      className={`passenger-stat-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-count">{count}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default PassengerStatCard;