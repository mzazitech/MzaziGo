// src/components/ZoneCard.jsx
import React from 'react';

const ZoneCard = ({ zone, selectedMetric, percentage, value }) => {
  return (
    <div className="zone-card">
      <div className="zone-name">{zone.name}</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="zone-stats">
        <div className="zone-percentage">
          {percentage}% of total {selectedMetric.replace(/([A-Z])/g, ' $1')}
        </div>
        <div className="zone-value">
          Value: {value.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ZoneCard;