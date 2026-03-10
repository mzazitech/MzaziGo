// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { mockData } from '../../data/Admin/mockdata.jsx';
import StatCard from './StatCard';
import ZoneCard from './ZoneCard';
import '../../styles/Admin/Dashboard.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('activeDriver');
  const [selectedZone, setSelectedZone] = useState('all'); // 'all' หรือชื่อ zone เฉพาะ
  const [selectedDuration, setSelectedDuration] = useState('today');

  const durations = ['today', 'yesterday', 'last7days', 'thisMonth', 'lastMonth', 'thisYear', 'lastYear', 'allTime'];

  // คำนวณ total ของ metric ที่เลือกในช่วงเวลาที่เลือก
  const getTotalForMetric = () => {
    if (selectedZone === 'all') {
      let total = 0;
      mockData.zones.forEach(zone => {
        const zoneMetricData = mockData.zoneData[zone.name][selectedMetric];
        if (zoneMetricData) {
          total += zoneMetricData[selectedDuration] || 0;
        }
      });
      return total;
    } else {
      // ถ้าเลือก zone เฉพาะ คืนค่าของ zone นั้น
      const zoneMetricData = mockData.zoneData[selectedZone][selectedMetric];
      return zoneMetricData ? zoneMetricData[selectedDuration] || 0 : 0;
    }
  };

  // คำนวณค่าสำหรับแต่ละ metric ตาม zone และ duration ที่เลือก
  const getStatValues = () => {
    const values = {};
    Object.keys(mockData.stats).forEach(metric => {
      if (selectedZone === 'all') {
        let total = 0;
        mockData.zones.forEach(zone => {
          const zoneMetricData = mockData.zoneData[zone.name][metric];
          if (zoneMetricData) {
            total += zoneMetricData[selectedDuration] || 0;
          }
        });
        values[metric] = total;
      } else {
        const zoneMetricData = mockData.zoneData[selectedZone][metric];
        values[metric] = zoneMetricData ? zoneMetricData[selectedDuration] || 0 : 0;
      }
    });
    return values;
  };

  const statValues = getStatValues();

  const statIcons = {
    activeDriver: <DirectionsCarIcon fontSize="large" />,
    activePassenger: <GroupsIcon fontSize="large" />,
    bookingRides: <LocalTaxiIcon fontSize="large" />,
    canceledRides: <CancelIcon fontSize="large" />,
    totalEarning: <AttachMoneyIcon fontSize="large" />,
    bikeEarning: <TwoWheelerIcon fontSize="large" />,
    carEarning: <DirectionsCarIcon fontSize="large" />,
    vanEarning: <LocalShippingIcon fontSize="large" />,
  };

  // คำนวณเปอร์เซ็นต์สำหรับแต่ละ zone
  const getZonePercentages = () => {
    const total = getTotalForMetric();
    if (total === 0) return mockData.zones.map(zone => ({ ...zone, percentage: 0 }));
    
    return mockData.zones.map(zone => {
      const zoneMetricData = mockData.zoneData[zone.name][selectedMetric];
      const value = zoneMetricData ? zoneMetricData[selectedDuration] || 0 : 0;
      const percentage = ((value / total) * 100).toFixed(1);
      return {
        ...zone,
        percentage: parseFloat(percentage),
        value: value
      };
    });
  };

  // ข้อมูล chart แสดงค่าของแต่ละ zone (X-axis = zones)
  const getChartData = () => {
    return mockData.zones.map(zone => {
      const zoneMetricData = mockData.zoneData[zone.name][selectedMetric];
      const value = zoneMetricData ? zoneMetricData[selectedDuration] || 0 : 0;
      return {
        name: zone.name.replace(' Zone', ''),
        value: value
      };
    });
  };

  const zonePercentages = getZonePercentages();

  return (
    <div className="dashboard">
      {/* Stat Cards with Zone Dropdown */}
      <div className="stats-section">
        <div className="stats-header">
          <h3>Statistics Overview</h3>
          <div className="zone-filter">
            <label>Filter by Zone: </label>
            <select 
              className="zone-select-dropdown"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="all">All Zones</option>
              {mockData.zones.map(zone => (
                <option key={zone.name} value={zone.name}>{zone.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="stats-grid">
          {Object.entries(mockData.stats).map(([key, value]) => (
            <StatCard
              key={key}
              value={statValues[key]}
              label={key.replace(/([A-Z])/g, ' $1')}
              icon={statIcons[key]}
              isActive={selectedMetric === key}
              onClick={() => setSelectedMetric(key)}
            />
          ))}
        </div>
      </div>

      {/* Zone Cards */}
      <div className="zones-section-wrapper">
        <h3 className="section-title">Zone Distribution for {selectedMetric.replace(/([A-Z])/g, ' $1')}</h3>
        <div className="zones-grid">
          {zonePercentages.map(zone => (
            <ZoneCard
              key={zone.name}
              zone={zone}
              selectedMetric={selectedMetric}
              percentage={zone.percentage}
              value={zone.value}
            />
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">
            {selectedMetric.replace(/([A-Z])/g, ' $1')} by Zone - {selectedDuration}
          </h3>
          <div className="chart-controls">
            <select
              className="duration-select"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              {durations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  ); 
};

export default Dashboard;