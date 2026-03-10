import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Ban } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/Admin/ViewDriver.css';

const ViewDriver = ({ driver, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedTab, setSelectedTab] = useState('riding');

  // Mock data สำหรับกราฟ
  const chartData = {
    today: [
      { name: '00:00', rides: 2, earning: 350 },
      { name: '06:00', rides: 5, earning: 890 },
      { name: '12:00', rides: 8, earning: 1420 },
      { name: '18:00', rides: 12, earning: 2100 },
      { name: '23:59', rides: 15, earning: 2680 }
    ],
    thisWeek: [
      { name: 'Mon', rides: 25, earning: 4500 },
      { name: 'Tue', rides: 32, earning: 5800 },
      { name: 'Wed', rides: 28, earning: 5100 },
      { name: 'Thu', rides: 35, earning: 6200 },
      { name: 'Fri', rides: 40, earning: 7100 },
      { name: 'Sat', rides: 38, earning: 6800 },
      { name: 'Sun', rides: 30, earning: 5400 }
    ],
    thisMonth: [
      { name: 'Week 1', rides: 85, earning: 15200 },
      { name: 'Week 2', rides: 92, earning: 16500 },
      { name: 'Week 3', rides: 88, earning: 15800 },
      { name: 'Week 4', rides: 80, earning: 14300 }
    ],
    thisYear: [
      { name: 'Jan', rides: 320, earning: 57600 },
      { name: 'Feb', rides: 298, earning: 53640 },
      { name: 'Mar', rides: 345, earning: 62100 },
      { name: 'Apr', rides: 312, earning: 56160 },
      { name: 'May', rides: 335, earning: 60300 }
    ]
  };

  const currentChartData = chartData[selectedPeriod] || chartData.thisMonth;

  // Mock ข้อมูลรีวิว
  const reviews = driver.reviews || [
    { customer: 'สมชาย ใจดี', rating: 5, comment: 'ขับดีมาก สุภาพ บริการดีเยี่ยม', date: '16 Nov 2025' },
    { customer: 'วรรณา สุขใจ', rating: 4, comment: 'ดีครับ แต่ขับเร็วไปนิด', date: '15 Nov 2025' },
    { customer: 'ประพันธ์ มีสุข', rating: 5, comment: 'ประทับใจมากครับ ขับดี ปลอดภัย', date: '14 Nov 2025' }
  ];

  // Mock คำเตือน
  const warnings = driver.warnings || [
    { date: '10 Nov 2025', reason: 'ขับรถเร็วเกินไป', reportBy: 'นางสาว อรุณ สว่าง', status: 'Resolved' },
    { date: '05 Nov 2025', reason: 'ยกเลิกรายการกระทันหัน', reportBy: 'นาย สมศักดิ์ ดี', status: 'Pending' }
  ];

  // Mock ประวัติการรับส่ง
  const rideHistory = driver.rideHistory || [
    { date: '17 Nov 2025 14:30', from: 'Siam Square', to: 'Asiatique', fare: 250.00, status: 'Completed', duration: '35 min' },
    { date: '17 Nov 2025 12:15', from: 'MBK Center', to: 'Central World', fare: 180.00, status: 'Completed', duration: '20 min' },
    { date: '16 Nov 2025 18:45', from: 'Victory Monument', to: 'Don Mueang Airport', fare: 420.00, status: 'Completed', duration: '45 min' },
    { date: '16 Nov 2025 15:20', from: 'Chatuchak', to: 'Lumpini Park', fare: 310.00, status: 'Completed', duration: '38 min' },
    { date: '15 Nov 2025 09:00', from: 'Sukhumvit', to: 'Siam Paragon', fare: 220.00, status: 'Completed', duration: '28 min' }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const handleSendWarning = () => {
    alert('ระบบจะส่งข้อความเตือนไปยังคนขับ (เชื่อมกับระบบแชทในอนาคต)');
  };

  const handleSuspend = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการระงับการใช้งานของคนขับคนนี้?')) {
      alert('ระงับการใช้งานสำเร็จ');
    }
  };

  return (
    <div className="view-driver-container">
      {/* Header */}
      <div className="view-driver-header">
        <button className="back-to-list" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Driver List
        </button>
        <h2>DRIVER NO. {driver.id}</h2>
      </div>

      {/* Driver Info Card */}
      <div className="driver-info-card">
        <div className="driver-info-left">
          <div className="driver-avatar-large">
            <img src={driver.avatar} alt={driver.name} />
          </div>
          <div className="driver-basic-info">
            <h3>{driver.name}</h3>
            <div className="rating-display">
              <span className="stars-large">{renderStars(driver.rating)}</span>
              <span className="rating-number-large">{driver.rating}</span>
            </div>
            <p>Phone : {driver.phone}</p>
            <p>Email : {driver.email || 'N/A'}</p>
            <p>License No : {driver.licenseNumber || 'TH123456789'}</p>
          </div>
        </div>

        <div className="driver-info-right">
          <div className="info-section">
            <h4>IDENTITY INFORMATION</h4>
            <div className="identity-card">
              {driver.documents?.idCard ? (
                <div className="id-card-image-preview">
                  <img src={driver.documents.idCard} alt="ID Card" />
                </div>
              ) : (
                <div className="id-card-preview">
                  <p className="id-title">บัตรประจำตัวประชาชน/เลขที่</p>
                  <p className="id-number">{driver.identityNumber || '0123456789'}</p>
                  <div className="id-qr">QR Code</div>
                  <div className="id-photo">
                    <img src={driver.avatar} alt="ID" />
                  </div>
                </div>
              )}
              <p className="id-type">Identity Type : {driver.identityType || 'Passport'}</p>
              <p className="id-num">Identity Number : {driver.identityNumber || '0123456789'}</p>
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
            <h4>จำนวนที่รับส่ง (Rides)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rides" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4>ยอดที่ได้รับ (Earning - THB)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="earning" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Driver Details Tabs */}
      <div className="driver-details-section">
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
                <span className="stat-value">{driver.totalCompleted || driver.totalRides}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Cancel Riding</span>
                <span className="stat-value cancel">{driver.totalCanceled || 12}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Active Hour</span>
                <span className="stat-value">{driver.totalActiveHours || 1840}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Join Date</span>
                <span className="stat-value">{driver.joinDate || '15 Jan 2024'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Active</span>
                <span className="stat-value">{driver.lastActive || '17 Nov 2025'}</span>
              </div>
            </div>
          )}

          {selectedTab === 'review' && (
            <div className="review-content">
              <div className="reviews-list">
                <h4>ความคิดเห็นจากลูกค้า</h4>
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.customer}</span>
                      <span className="review-rating">{renderStars(review.rating)} {review.rating}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">{review.date}</span>
                  </div>
                ))}
              </div>

              <div className="warnings-list">
                <h4>รายการคำเตือน/ร้องเรียน</h4>
                {warnings.length > 0 ? (
                  warnings.map((warning, index) => (
                    <div key={index} className="warning-item">
                      <div className="warning-header">
                        <span className="warning-date">{warning.date}</span>
                        <span className={`warning-status ${warning.status.toLowerCase()}`}>
                          {warning.status}
                        </span>
                      </div>
                      <p className="warning-reason">เหตุผล: {warning.reason}</p>
                      <p className="warning-reporter">รายงานโดย: {warning.reportBy}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-warnings">ไม่มีรายการคำเตือน</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ดูไฟล์เพิ่มเติมในข้อความถัดไป - ยาวเกินไป */}

      {/* Vehicle Information */}
      <div className="vehicle-info-section">
        <h3>VEHICLE INFORMATION</h3>
        <div className="vehicle-photos">
          <div className="vehicle-photo-item">
            <img src="https://via.placeholder.com/300x200/f59e0b/ffffff?text=Front+View" alt="Front" />
            <p>Front View</p>
          </div>
          <div className="vehicle-photo-item">
            <img src="https://via.placeholder.com/300x200/f59e0b/ffffff?text=Back+View" alt="Back" />
            <p>Back View</p>
          </div>
          <div className="vehicle-photo-item">
            <img src="https://via.placeholder.com/300x200/f59e0b/ffffff?text=Left+View" alt="Left" />
            <p>Left View</p>
          </div>
          <div className="vehicle-photo-item">
            <img src="https://via.placeholder.com/300x200/f59e0b/ffffff?text=Right+View" alt="Right" />
            <p>Right View</p>
          </div>
        </div>

        <div className="vehicle-details">
          <p><strong>Vehicle:</strong> {driver.vehicle}</p>
          <p><strong>Category:</strong> {driver.licenseType}</p>
          <p><strong>Brand:</strong> {driver.vehicleBrand || 'Toyota'}</p>
          <p><strong>Model:</strong> {driver.vehicleModel || driver.vehicle}</p>
          <p><strong>License Plate Number:</strong> {driver.plateNumber}</p>
        </div>
      </div>

      {/* Documents Section */}
      <div className="documents-view-section">
        <h3>DRIVER DOCUMENTS</h3>
        <div className="documents-grid-view">
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.driverLicense || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Driver+License'} alt="ใบขับขี่" />
            </div>
            <p className="document-label">ใบขับขี่</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.publicDriverLicense || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Public+License'} alt="ใบขับขี่สาธารณะ" />
            </div>
            <p className="document-label">ใบขับขี่สาธารณะ</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.idCard || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=ID+Card'} alt="บัตรประชาชน" />
            </div>
            <p className="document-label">บัตรประชาชน</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.criminalRecord || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Criminal+Record'} alt="ประวัติอาชญากรรม" />
            </div>
            <p className="document-label">เอกสารตรวจสอบประวัติอาชญากรรม</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.vehicleRegistration || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Registration'} alt="ทะเบียนรถ" />
            </div>
            <p className="document-label">เอกสารการจดทะเบียนยานพาหนะ</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.compulsoryInsurance || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Insurance'} alt="พรบ." />
            </div>
            <p className="document-label">ประกันภาคบังคับ (พรบ.)</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.commercialInsurance || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=Commercial+Ins'} alt="ประกันพาณิชย์" />
            </div>
            <p className="document-label">ประกันรถยนต์เชิงพาณิชย์</p>
          </div>
          <div className="document-item">
            <div className="document-preview">
              <img src={driver.documents?.eSticker || 'https://via.placeholder.com/200x150/e5e7eb/6b7280?text=E-Sticker'} alt="สติกเกอร์" />
            </div>
            <p className="document-label">สติ๊กเกอร์รถยนต์รับจ้างผ่านระบบอิเล็กทรอนิกส์</p>
          </div>
        </div>
      </div>

      {/* Ride History Table */}
      <div className="ride-history-section">
        <div className="history-header">
          <h3>ประวัติการรับส่งลูกค้า</h3>
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

      {/* Wallet Information (bonus) */}
      <div className="wallet-info-section">
        <h3>WALLET INFORMATION</h3>
        <div className="wallet-table-wrapper">
          <table className="wallet-table">
            <thead>
              <tr>
                <th>DATE & TIME</th>
                <th>TRANSACTION ID / TRANSACTION REF.</th>
                <th>DESCRIPTION</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-10-10 18:00</td>
                <td>TRANSFER-001</td>
                <td>Cash out to bank</td>
                <td className="amount-negative">฿2370.00</td>
                <td><span className="status-badge-wallet complete">Complete</span></td>
              </tr>
              <tr>
                <td>2025-10-11 08:30</td>
                <td>TRIP-34589</td>
                <td>Trip Earning</td>
                <td className="amount-positive">฿320.00</td>
                <td><span className="status-badge-wallet complete">Complete</span></td>
              </tr>
              <tr>
                <td>2025-10-11 09:45</td>
                <td>TRIP-34612</td>
                <td>Trip Earning</td>
                <td className="amount-positive">฿180.00</td>
                <td><span className="status-badge-wallet complete">Complete</span></td>
              </tr>
              <tr>
                <td>2025-10-11 14:20</td>
                <td>PROMO-00001</td>
                <td>Campaign Earning</td>
                <td className="amount-positive">฿50.00</td>
                <td><span className="status-badge-wallet complete">Complete</span></td>
              </tr>
              <tr>
                <td>2025-10-11 16:10</td>
                <td>TRANSFER-002</td>
                <td>Cash out to bank</td>
                <td className="amount-negative">฿477.00</td>
                <td><span className="status-badge-wallet in-progress">In-Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="driver-actions">
        <button className="action-btn-large warning-btn" onClick={handleSendWarning}>
          <MessageCircle size={18} />
          ส่งข้อความเตือน
        </button>
        <button className="action-btn-large suspend-btn" onClick={handleSuspend}>
          <Ban size={18} />
          ระงับการใช้งาน
        </button>
      </div>
    </div>
  );
};

export default ViewDriver;