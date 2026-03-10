// components/CouponSetup.jsx
import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCouponList, mockDeletedCouponList, couponChartData, couponStats, timeRangeOptions } from '../../data/Admin/CouponMockData';
import AddCouponForm from './AddCouponForm';
import '../../styles/Admin/CouponSetup.css';

const CouponSetup = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'addCoupon'
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState(mockCouponList);
  const [deletedCoupons, setDeletedCoupons] = useState(mockDeletedCouponList);
  const [stats, setStats] = useState(couponStats);
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState(couponChartData.today);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  // ฟังก์ชันเพิ่มคูปอง
  const handleAddCoupon = (newCoupon) => {
    const couponWithId = {
      ...newCoupon,
      id: Math.max(...coupons.map(c => c.id), 0) + 1,
      totalUsed: 0,
      status: 'Active'
    };
    setCoupons([...coupons, couponWithId]);
    setCurrentPage('main');
    
    // อัปเดตสถิติ
    setStats({
      ...stats,
      totalCoupon: stats.totalCoupon + 1,
      activeCoupon: stats.activeCoupon + 1
    });
    
    alert('✓ Coupon added successfully!');
  };

  // ฟังก์ชันลบคูปอง
  const handleDeleteCoupon = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      const couponToDelete = coupons.find(c => c.id === id);
      setDeletedCoupons([...deletedCoupons, { ...couponToDelete, status: 'Inactive', deletedDate: new Date().toLocaleDateString('en-GB') }]);
      setCoupons(coupons.filter(c => c.id !== id));
      
      // อัปเดตสถิติ
      if (couponToDelete.status === 'Active') {
        setStats({
          ...stats,
          totalCoupon: stats.totalCoupon - 1,
          activeCoupon: stats.activeCoupon - 1
        });
      }
    }
  };

  // ฟังก์ชันค้นหาคูปอง
  const filteredCoupons = coupons.filter(coupon =>
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // ถ้าอยู่ในหน้า Add Coupon
  if (currentPage === 'addCoupon') {
    return <AddCouponForm onBack={() => setCurrentPage('main')} onSubmit={handleAddCoupon} />;
  }

  return (
    <div className="coupon-setup-container">
      <div className="coupon-setup-main">
        {/* HEADER */}
        <div className="coupon-setup-header">
          <h1>COUPON MANAGEMENT</h1>
        </div>

        {/* TABS */}
        <div className="coupon-tabs">
          <h3 className="coupon-overview-heading">OVERVIEW</h3>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* CHART */}
            <div className="coupon-chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="coupon-chart-title">Coupon Usage Statistics</h2>
                <select 
                  value={timeRange}
                  onChange={(e) => {
                    setTimeRange(e.target.value);
                    setChartData(couponChartData[e.target.value]);
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: '#fbbf24',
                    color: '#1f2937',
                    cursor: 'pointer',
                    minWidth: '150px'
                  }}
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="coupon-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={Object.keys(chartData[0])[0]} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} name="Active Coupons" />
                    <Line type="monotone" dataKey="expired" stroke="#ef4444" strokeWidth={2} name="Expired Coupons" />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total Coupons" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* OVERVIEW CARDS */}
            <div className="coupon-overview">
              <div className="coupon-overview-card">
                <div className="coupon-overview-icon">📊</div>
                <div className="coupon-overview-label">Total Coupon</div>
                <div className="coupon-overview-value">{stats.totalCoupon}</div>
              </div>
              <div className="coupon-overview-card">
                <div className="coupon-overview-icon">✓</div>
                <div className="coupon-overview-label">Active Coupon</div>
                <div className="coupon-overview-value">{stats.activeCoupon}</div>
              </div>
              <div className="coupon-overview-card">
                <div className="coupon-overview-icon">฿</div>
                <div className="coupon-overview-label">Total Amount</div>
                <div className="coupon-overview-value">{stats.totalAmount}</div>
              </div>
              <div className="coupon-overview-card">
                <div className="coupon-overview-icon">📈</div>
                <div className="coupon-overview-label">Usage Rate</div>
                <div className="coupon-overview-value">{stats.usageRate}</div>
              </div>
            </div>

            {/* ALL COUPONS LIST */}
            <div className="coupon-table-container">
              <h3 className="coupon-section-heading">ALL COUPON</h3>
              <div className="coupon-table-header">
                <div className="coupon-search-box">
                  <input 
                    type="text" 
                    placeholder="Search Coupon"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="coupon-table-info">
                  <div className="coupon-table-info-item">
                    TOTAL COUPON: <span className="coupon-table-info-badge">{filteredCoupons.length}</span>
                  </div>
                  <button className="coupon-btn-trash" onClick={() => setShowDeletedModal(true)}>
                    <Trash2 size={18} />
                    TRASH DATA
                  </button>
                  <button className="coupon-btn-add" onClick={() => setCurrentPage('addCoupon')}>
                    <Plus size={18} />
                    + ADD COUPON
                  </button>
                </div>
              </div>
              <div className="coupon-table-wrapper">
                <table className="coupon-table">
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>TITLE</th>
                      <th>CODE</th>
                      <th>COUPON AMOUNT</th>
                      <th>DURATION</th>
                      <th>TOTAL USED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.length > 0 ? (
                      filteredCoupons.map((coupon, index) => (
                        <tr key={coupon.id}>
                          <td className="center">{index + 1}</td>
                          <td>
                            <span className="coupon-link-btn">
                              {coupon.title}
                            </span>
                          </td>
                          <td>{coupon.code}</td>
                          <td>{coupon.amount}</td>
                          <td>{coupon.duration}</td>
                          <td className="center">{coupon.totalUsed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="coupon-no-data">No coupons found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* DELETED COUPONS MODAL */}
        {showDeletedModal && (
          <div className="coupon-modal-overlay" onClick={() => setShowDeletedModal(false)}>
            <div className="coupon-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="coupon-modal-header">
                <h2>DELETED COUPON LIST</h2>
                <button 
                  className="coupon-modal-close"
                  onClick={() => setShowDeletedModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="coupon-modal-search">
                <input type="text" placeholder="Search Coupon" />
              </div>

              <div className="coupon-modal-info">
                <span>TOTAL COUPON: <strong>{deletedCoupons.length}</strong></span>
              </div>

              <div className="coupon-modal-table-wrapper">
                <table className="coupon-table">
                  <thead>
                    <tr>
                      <th>NO.</th>
                      <th>TOTAL COUPON</th>
                      <th>TYPE</th>
                      <th>APPLICABLE FOR</th>
                      <th>REGION</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th>OTHER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedCoupons.length > 0 ? (
                      deletedCoupons.map((coupon, index) => (
                        <tr key={coupon.id}>
                          <td className="center">{index + 1}</td>
                          <td>{coupon.title}</td>
                          <td>{coupon.type}</td>
                          <td>{coupon.applicableFor}</td>
                          <td>{coupon.region}</td>
                          <td>{coupon.category}</td>
                          <td className="center">
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: '#fecaca',
                              color: '#991b1b'
                            }}>
                              Inactive
                            </span>
                          </td>
                          <td className="coupon-table-actions">
                            <button 
                              className="coupon-action-btn"
                              onClick={() => console.log('Restore:', coupon.id)}
                              title="Restore"
                            >
                              ↻
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="coupon-no-data">No deleted coupons</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CouponSetup;