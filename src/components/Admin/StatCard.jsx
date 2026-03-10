// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ value, label, icon, onClick, isActive }) => {
  return (
    <div 
      className={`stat-card ${isActive ? 'stat-card-active' : ''}`}
      onClick={onClick}
    >
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value.toLocaleString()}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
