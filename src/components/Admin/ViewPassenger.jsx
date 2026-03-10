import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/Admin/ViewPassenger.css';

const ViewPassenger = ({ passenger, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedTab, setSelectedTab] = useState('riding');

  // Mock data สำหรับกราฟ
  const chartData = {
    today: [
      { name: '00:00', rides: 1, spending: 150 },
      { name: '06:00', rides: 2, spending: 320 },
      { name: '12:00', rides: 3, spending: 580 },
      { name: '18:00', rides: 4, spending: 890 },
      { name: '23:59', rides: 5, spending: 1120 }
    ],
    thisWeek: [
      { name: 'Mon', rides: 3, spending: 450 },
      { name: 'Tue', rides: 5, spending: 780 },
      { name: 'Wed', rides: 4, spending: 620 },
      { name: 'Thu', rides: 6, spending: 890 },
      { name: 'Fri', rides: 7, spending: 1100 },
      { name: 'Sat', rides: 4, spending: 650 },
      { name: 'Sun', rides: 3, spending: 480 }
    ],
    thisMonth: [
      { name: 'Week 1', rides: 12, spending: 1850 },
      { name: 'Week 2', rides: 15, spending: 2300 },
      { name: 'Week 3', rides: 13, spending: 2050 },
      { name: 'Week 4', rides: 10, spending: 1600 }
    ],
    thisYear: [
      { name: 'Jan', rides: 45, spending: 7200 },
      { name: 'Feb', rides: 38, spending: 6100 },
      { name: 'Mar', rides: 52, spending: 8300 },
      { name: 'Apr', rides: 47, spending: 7500 },
      { name: 'May', rides: 50, spending: 8000 }
    ]
  };

  const currentChartData = chartData[selectedPeriod] || chartData.thisMonth;

  // Mock ข้อมูลรีวิวที่ให้ไว้
  const reviews = passenger.reviews || [
    { driver: 'Somchai Jaidee', rating: 5, comment: 'ผู้โดยสารดีมาก สุภาพ', date: '16 Nov 2025' },
    { driver: 'Pornthip Saengfang', rating: 4, comment: 'ดีครับ แต่รอนานไปนิด', date: '15 Nov 2025' }
  ];

  // Mock ประวัติการรับส่ง
  const rideHistory = passenger.rideHistory || [
    { date: '17 Nov 2025 14:30', from: 'Siam Square', to: 'Asiatique', fare: 250.00, driver: 'Somchai Jaidee', status: 'Completed', duration: '35 min' },
    { date: '17 Nov 2025 12:15', from: 'MBK Center', to: 'Central World', fare: 180.00, driver: 'Pornthip Saengfang', status: 'Completed', duration: '20 min' },
    { date: '16 Nov 2025 18:45', from: 'Victory Monument', to: 'Don Mueang Airport', fare: 420.00, driver: 'Wanchai Pattana', status: 'Completed', duration: '45 min' },
    { date: '16 Nov 2025 15:20', from: 'Chatuchak', to: 'Lumpini Park', fare: 310.00, driver: 'Kiattisak Phothanut', status: 'Completed', duration: '38 min' },
    { date: '15 Nov 2025 09:00', from: 'Sukhumvit', to: 'Siam Paragon', fare: 220.00, driver: 'Narong Suksai', status: 'Completed', duration: '28 min' }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="view-passenger-container">
      {/* Header */}
      <div className="view-passenger-header">
        <button className="back-to-list" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Customer List
        </button>
        <h2>CUSTOMER NO. {passenger.id}</h2>
      </div>

      {/* Passenger Info Card */}
      <div className="passenger-info-card">
        <div className="passenger-info-left">
          <div className="passenger-avatar-large">
            <img src={passenger.avatar} alt={passenger.name} />
          </div>
          <div className="passenger-basic-info">
            <h3>{passenger.name}</h3>
            <p>Phone : {passenger.phone}</p>
            <p>Email : {passenger.email || 'N/A'}</p>
            <p>Gender : {passenger.gender || 'N/A'}</p>
          </div>
        </div>

        <div className="passenger-info-right">
          <div className="info-section">
            <h4>IDENTITY INFORMATION</h4>
            <div className="identity-card">
              {passenger.documents?.idCard ? (
                <div className="id-card-image-preview">
                  <img src={passenger.documents.idCard} alt="ID Card" />
                </div>
              ) : (
                <div className="id-card-preview">
                  <p className="id-title">บัตรประจำตัวประชาชน/เลขที่</p>
                  <p className="id-number">{passenger.identityNumber || '0123456789'}</p>
                  <div className="id-qr">QR Code</div>
                  <div className="id-photo">
                    <img src={passenger.avatar} alt="ID" />
                  </div>
                </div>
              )}
              <p className="id-type">Identity Type : {passenger.identityType || 'Passport'}</p>
              <p className="id-num">Identity Number : {passenger.identityNumber || '0123456789'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">
        <div className="stats-header">
          <h3>STATISTICS</h3>
          <select 
            className="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
        
        <div className="stats-charts">
          <div className="chart-box">
            <h4>จำนวนที่รับบริการ (Rides)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rides" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4>ยอดเงินที่ใช้ (Spending - THB)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="spending" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Passenger Details Tabs */}
      <div className="passenger-details-section">
        <div className="details-tabs">
          <button 
            className={`tab-button ${selectedTab === 'riding' ? 'active' : ''}`}
            onClick={() => setSelectedTab('riding')}
          >
            RIDING
          </button>
          <button 
            className={`tab-button ${selectedTab === 'review' ? 'active' : ''}`}
            onClick={() => setSelectedTab('review')}
          >
            REVIEW
          </button>
        </div>

        <div className="tab-content">
          {selectedTab === 'riding' && (
            <div className="riding-stats">
              <div className="stat-item">
                <span className="stat-label">Total Completed Riding</span>
                <span className="stat-value">{passenger.totalRides || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Cancel Riding</span>
                <span className="stat-value cancel">{passenger.totalCanceled || 2}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Spending</span>
                <span className="stat-value">฿{(passenger.totalSpent || 12859).toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Join Date</span>
                <span className="stat-value">{passenger.joinDate || '15 Jan 2024'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Active</span>
                <span className="stat-value">{passenger.lastActive || '17 Nov 2025'}</span>
              </div>
            </div>
          )}

          {selectedTab === 'review' && (
            <div className="review-content">
              <div className="reviews-list">
                <h4>รีวิวจากผู้โดยสาร</h4>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">คนขับ: {review.driver}</span>
                      <span className="review-rating">{renderStars(review.rating)} {review.rating}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ride History Table */}
      <div className="ride-history-section">
        <div className="history-header">
          <h3>ประวัติการใช้บริการ</h3>
          <select className="period-select">
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="allTime">All Time</option>
          </select>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>DATE & TIME</th>
                <th>FROM</th>
                <th>TO</th>
                <th>DRIVER</th>
                <th>DURATION</th>
                <th>FARE (THB)</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {rideHistory.map((ride, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ride.date}</td>
                  <td>{ride.from}</td>
                  <td>{ride.to}</td>
                  <td>{ride.driver}</td>
                  <td>{ride.duration}</td>
                  <td>{ride.fare.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge-ride ${ride.status.toLowerCase()}`}>
                      {ride.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;