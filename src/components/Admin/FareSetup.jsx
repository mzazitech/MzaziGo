// components/FareSetup.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/Admin/FareSetup.css';
import { ensureCurrentFareData, syncFareEntryToStorage } from '../../utils/Admin/fareDefaults';

const FareSetup = () => {
  const [activeTab, setActiveTab] = useState('setup');

  // State สำหรับการตั้งค่า
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [farePrice, setFarePrice] = useState('');
  const [baseFare, setBaseFare] = useState('');
  const [minimumFare, setMinimumFare] = useState('');
  const [cancellationFee, setCancellationFee] = useState('');
  const [minCancellationFee, setMinCancellationFee] = useState('');
  const [delayFee, setDelayFee] = useState('');
  const [idleFee, setIdleFee] = useState('');
  const [peakHours, setPeakHours] = useState('');

  // ข้อมูลภูมิภาคและจังหวัด
  const regionData = {
    'Northern': ['Chiang Mai', 'Chiang Rai', 'Lampang', 'Lamphun', 'Nan', 'Phayao', 'Phrae', 'Tak', 'Uttaradit'],
    'Northeastern': ['Amnat Charoen', 'Bueng Kan', 'Chaiyaphum', 'Kalasin', 'Khon Kaen', 'Loei', 'Maha Sarakham', 'Mukdahan', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Yasothon'],
    'Central': ['Amnat Charoen', 'Ayutthaya', 'Bangkok', 'Lopburi', 'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Samut Sakhon', 'Saraburi'],
    'Eastern': ['Chachoengsao', 'Chon Buri', 'Rayong', 'Sa Kaeo', 'Trat'],
    'Western': ['Chumphon', 'Kanchanaburi', 'Phetchaburi', 'Prachuap Khiri Khan', 'Ratchaburi', 'Ranong'],
    'Southern': ['Krabi', 'Nakhon Si Thammarat', 'Phang Nga', 'Phuket', 'Satun', 'Songkhla', 'Surat Thani', 'Trang', 'Yala']
  };

  const vehicleTypes = ['BIKE', 'CAR', 'BUS'];

  // State สำหรับตาราง
  const [fareTable, setFareTable] = useState([]);

  // State สำหรับ Category Fare Toggle
  const [categoryFareEnabled, setCategoryFareEnabled] = useState(
    JSON.parse(localStorage.getItem('categoryFareEnabled')) || true
  );

  // State สำหรับประวัติ
  const [fareHistory, setFareHistory] = useState(() => {
    const saved = localStorage.getItem('fareHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // State สำหรับตาราง
  const [faresData, setFaresData] = useState(() => {
    const saved = localStorage.getItem('faresData');
    return saved ? JSON.parse(saved) : [];
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fareToDelete, setFareToDelete] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedFareDetail, setSelectedFareDetail] = useState(null);

  useEffect(() => {
    ensureCurrentFareData();
  }, []);

  // ฟังก์ชันจัดการการกดปุ่มยืนยัน
  const handleConfirm = () => {
    if (!selectedRegion || !selectedProvince || !selectedVehicleType || !farePrice) {
      alert('Please fill in all required fields');
      return;
    }

    // ตรวจสอบว่า record นี้มีอยู่แล้วหรือไม่
    const existingIndex = faresData.findIndex(
      item => item.region === selectedRegion && 
               item.province === selectedProvince && 
               item.vehicleType === selectedVehicleType
    );

    let newFareEntry;

    if (existingIndex !== -1) {
      // อัปเดต record เก่า
      const updatedData = [...faresData];
      updatedData[existingIndex] = {
        ...updatedData[existingIndex],
        baseFare: parseFloat(baseFare) || 0,
        minimumFare: parseFloat(minimumFare) || 0,
        price: parseFloat(farePrice),
        cancellationFee: parseFloat(cancellationFee) || 0,
        minCancellationFee: parseFloat(minCancellationFee) || 0,
        delayFee: parseFloat(delayFee) || 0,
        idleFee: parseFloat(idleFee) || 0,
        peakHours: peakHours || '',
        lastUpdated: new Date().toLocaleString('th-TH'),
        updatedBy: 'Thunder@admin.com'
      };
      setFaresData(updatedData);
      localStorage.setItem('faresData', JSON.stringify(updatedData));
      newFareEntry = updatedData[existingIndex];
    } else {
      // สร้าง record ใหม่
      const fareEntry = {
        id: Date.now(),
        region: selectedRegion,
        province: selectedProvince,
        vehicleType: selectedVehicleType,
        baseFare: parseFloat(baseFare) || 0,
        minimumFare: parseFloat(minimumFare) || 0,
        price: parseFloat(farePrice),
        cancellationFee: parseFloat(cancellationFee) || 0,
        minCancellationFee: parseFloat(minCancellationFee) || 0,
        delayFee: parseFloat(delayFee) || 0,
        idleFee: parseFloat(idleFee) || 0,
        peakHours: peakHours || '',
        createdAt: new Date().toLocaleString('th-TH'),
        createdBy: 'Thunder@admin.com',
        lastUpdated: new Date().toLocaleString('th-TH'),
        updatedBy: 'Thunder@admin.com'
      };
      const newData = [...faresData, fareEntry];
      setFaresData(newData);
      localStorage.setItem('faresData', JSON.stringify(newData));
      newFareEntry = fareEntry;
    }

    // เพิ่มลงประวัติ
    const historyEntry = {
      id: Date.now(),
      region: selectedRegion,
      province: selectedProvince,
      vehicleType: selectedVehicleType,
      price: parseFloat(farePrice),
      timestamp: new Date().toLocaleString('th-TH'),
      setBy: 'Thunder@admin.com',
      status: categoryFareEnabled ? 'Active' : 'Inactive'
    };
    const newHistory = [historyEntry, ...fareHistory];
    setFareHistory(newHistory);
    localStorage.setItem('fareHistory', JSON.stringify(newHistory));

    syncFareEntryToStorage(
      {
        ...newFareEntry,
        vehicleType: selectedVehicleType || newFareEntry.vehicleType,
      },
      categoryFareEnabled
    );

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('fare-data-updated'));
    }

    // รีเซ็ตฟอร์ม
    handleReset();
    alert('✓ Fare updated successfully!');
  };

  // ฟังก์ชันรีเซ็ต
  const handleReset = () => {
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedVehicleType('');
    setFarePrice('');
    setBaseFare('');
    setMinimumFare('');
    setCancellationFee('');
    setMinCancellationFee('');
    setDelayFee('');
    setIdleFee('');
    setPeakHours('');
  };

  // ฟังก์ชันลบ record
  const deleteFareRecord = (id) => {
    const updatedData = faresData.filter(item => item.id !== id);
    setFaresData(updatedData);
    localStorage.setItem('faresData', JSON.stringify(updatedData));
  };

  const handleDeleteClick = (fare) => {
    setFareToDelete(fare);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (fareToDelete) {
      deleteFareRecord(fareToDelete.id);
    }
    setShowDeleteModal(false);
    setFareToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFareToDelete(null);
  };

  const handlePriceClick = (fare) => {
    setSelectedFareDetail(fare);
    setShowPriceModal(true);
  };

  const closePriceModal = () => {
    setShowPriceModal(false);
    setSelectedFareDetail(null);
  };

  // ฟังก์ชันสำหรับเปลี่ยน dropdown province
  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSelectedProvince('');
  };

  // ฟังก์ชันสำหรับแสดงข้อมูลในตาราง
  const renderFareTable = () => {
    if (faresData.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="no-data">No fare data set yet</td>
        </tr>
      );
    }

    return faresData.map((item, index) => (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td><strong>{item.region}</strong></td>
        <td>{item.province}</td>
        <td>
          <span className={`vehicle-badge ${item.vehicleType.toLowerCase()}`}>
            {item.vehicleType}
          </span>
        </td>
        <td className="price">
          <button className="price-detail-btn" onClick={() => handlePriceClick(item)}>
            ฿{item.price.toFixed(2)}
          </button>
        </td>
        <td className="date">{item.lastUpdated}</td>
        <td className="actions">
          <button 
            className="delete-btn" 
            onClick={() => handleDeleteClick(item)}
            title="Delete"
          >
            ✕
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="fare-setup-container">
      {/* Header */}
      <div className="fare-setup-header">
        <h2>FARE SETUP</h2>
      </div>

      {/* Tabs */}
      <div className="fare-tabs">
        <button
          className={`fare-tab ${activeTab === 'setup' ? 'active' : ''}`}
          onClick={() => setActiveTab('setup')}
        >
          SETUP
        </button>
        <button
          className={`fare-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          HISTORY
        </button>
      </div>

      {/* Setup Tab */}
      {activeTab === 'setup' && (
        <div className="fare-setup-section">
          {/* Dropdowns Section */}
          <div className="fare-section-box">
            <h3 className="fare-section-title">SELECT LOCATION & VEHICLE</h3>
            
            <div className="dropdown-group">
              <div className="form-group-fare">
                <label>Region *</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="fare-dropdown"
                >
                  <option value="">-- Select Region --</option>
                  {Object.keys(regionData).map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-fare">
                <label>Province *</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="fare-dropdown"
                  disabled={!selectedRegion}
                >
                  <option value="">-- Select Province --</option>
                  {selectedRegion && regionData[selectedRegion].map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Available Vehicles Section - HORIZONTAL */}
          <div className="fare-section-box">
            <h3 className="fare-section-title">AVAILABLE VEHICLES</h3>
            
            <div className="vehicle-selector-horizontal">
              {vehicleTypes.map(vehicle => (
                <div key={vehicle} className="vehicle-option-horizontal">
                  <input
                    type="radio"
                    id={`vehicle-${vehicle}`}
                    name="vehicleType"
                    value={vehicle}
                    checked={selectedVehicleType === vehicle}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                  />
                  <label htmlFor={`vehicle-${vehicle}`} className="vehicle-label-horizontal">
                    <span className="vehicle-icon">
                      {vehicle === 'BIKE' && ''}
                      {vehicle === 'CAR' && ''}
                      {vehicle === 'BUS' && ''}
                    </span>
                    <span className="vehicle-name">{vehicle}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Input Section - EXPANDED */}
          <div className="fare-section-box">
            <h3 className="fare-section-title">DEFAULT FARE SETUP</h3>
            
            <div className="price-input-group">
              <div className="form-group-fare">
                <label>Base Fare (฿)</label>
                <div className="price-input-wrapper">
                  <span className="currency">฿</span>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="fare-input"
                    placeholder="Base Fare"
                    min="0"
                    step="0.50"
                  />
                </div>
              </div>

              <div className="form-group-fare">
                <label>Minimum Fare (฿)</label>
                <div className="price-input-wrapper">
                  <span className="currency">฿</span>
                  <input
                    type="number"
                    value={minimumFare}
                    onChange={(e) => setMinimumFare(e.target.value)}
                    className="fare-input"
                    placeholder="Minimum Fare"
                    min="0"
                    step="0.50"
                  />
                </div>
              </div>

              <div className="form-group-fare">
                <label>Fare Per KM (฿) *</label>
                <div className="price-input-wrapper">
                  <span className="currency">฿</span>
                  <input
                    type="number"
                    value={farePrice}
                    onChange={(e) => setFarePrice(e.target.value)}
                    className="fare-input"
                    placeholder="Enter fare price"
                    min="0"
                    step="0.50"
                  />
                </div>
              </div>
            </div>

            <div className="price-input-group">
              <div className="form-group-fare">
                <label>Cancellation Fee (%)</label>
                <input
                  type="number"
                  value={cancellationFee}
                  onChange={(e) => setCancellationFee(e.target.value)}
                  className="fare-input"
                  placeholder="Cancel fee %"
                  min="0"
                  step="0.50"
                />
              </div>

              <div className="form-group-fare">
                <label>Minimum Cancellation Fee (%)</label>
                <input
                  type="number"
                  value={minCancellationFee}
                  onChange={(e) => setMinCancellationFee(e.target.value)}
                  className="fare-input"
                  placeholder="Min cancel fee %"
                  min="0"
                  step="0.50"
                />
              </div>

              <div className="form-group-fare">
                <label>Delay Fee (Per min)</label>
                <input
                  type="number"
                  value={delayFee}
                  onChange={(e) => setDelayFee(e.target.value)}
                  className="fare-input"
                  placeholder="Delay / min"
                  min="0"
                  step="0.50"
                />
              </div>
            </div>

            <div className="price-input-group">
              <div className="form-group-fare">
                <label>Idle Fee (Per min)</label>
                <input
                  type="number"
                  value={idleFee}
                  onChange={(e) => setIdleFee(e.target.value)}
                  className="fare-input"
                  placeholder="Idle / min"
                  min="0"
                  step="0.50"
                />
              </div>

              <div className="form-group-fare">
                <label>Peak Hours (Per min)</label>
                <input
                  type="text"
                  value={peakHours}
                  onChange={(e) => setPeakHours(e.target.value)}
                  className="fare-input"
                  placeholder="peak hours"
                />
              </div>
            </div>
          </div>

          {/* Category Fare Toggle */}
          <div className="category-fare-toggle">
            <label className="toggle-label">CATEGORY FARE ENABLED</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={categoryFareEnabled}
                onChange={(e) => {
                  setCategoryFareEnabled(e.target.checked);
                  localStorage.setItem('categoryFareEnabled', JSON.stringify(e.target.checked));
                }}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-status">{categoryFareEnabled ? 'On' : 'Off'}</span>
          </div>

          {/* Current Fares Table - NEW STYLE */}
          <div className="fare-section-box">
            <h3 className="fare-section-title">CURRENT FARES</h3>
            
            <div className="fare-table-wrapper-new">
              <table className="fare-table-new">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>REGION</th>
                    <th>PROVINCE</th>
                    <th>VEHICLE TYPE</th>
                    <th>PRICE (Per KM)</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {renderFareTable()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fare-actions">
            <button className="btn-reset-fare" onClick={handleReset}>RESET</button>
            <button className="btn-save-fare" onClick={handleConfirm}>CONFIRM</button>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="fare-history-section">
          <h3 className="fare-section-title" style={{ marginBottom: '20px' }}>FARE SETUP HISTORY</h3>
          
          {fareHistory.length > 0 ? (
            <div className="fare-history-table-wrapper">
              <table className="fare-history-table">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>REGION</th>
                    <th>PROVINCE</th>
                    <th>VEHICLE TYPE</th>
                    <th>PRICE</th>
                    <th>SET BY (ADMIN)</th>
                    <th>DATE & TIME</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {fareHistory.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.region}</td>
                      <td>{item.province}</td>
                      <td>
                        <span className={`vehicle-badge ${item.vehicleType.toLowerCase()}`}>
                          {item.vehicleType}
                        </span>
                      </td>
                      <td className="price">฿{item.price.toFixed(2)}</td>
                      <td className="admin-name">{item.setBy}</td>
                      <td>{item.timestamp}</td>
                      <td>
                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-history">
              <p>No fare setup history yet</p>
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fare-modal-overlay">
          <div className="fare-delete-modal">
            <div className="fare-modal-icon">!</div>
            <h3>ARE YOU SURE ?</h3>
            {fareToDelete && (
              <p className="fare-modal-text">
                Remove fare for {fareToDelete.province} ({fareToDelete.vehicleType})?
              </p>
            )}
            <div className="fare-modal-actions">
              <button className="fare-modal-btn fare-modal-no" onClick={cancelDelete}>
                NO
              </button>
              <button className="fare-modal-btn fare-modal-yes" onClick={confirmDelete}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {showPriceModal && selectedFareDetail && (
        <div className="fare-modal-overlay">
          <div className="fare-detail-modal">
            <button className="fare-detail-close" onClick={closePriceModal}>×</button>
            <h3>FARE DETAILS</h3>
            <p className="fare-detail-context">
              {selectedFareDetail.region} / {selectedFareDetail.province} · {selectedFareDetail.vehicleType}
            </p>
            <div className="fare-detail-grid">
              <div className="fare-detail-item">
                <span className="label">Fare per KM</span>
                <span className="value">฿{selectedFareDetail.price?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Base Fare</span>
                <span className="value">฿{selectedFareDetail.baseFare?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Minimum Fare</span>
                <span className="value">฿{selectedFareDetail.minimumFare?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Cancellation Fee (%)</span>
                <span className="value">{selectedFareDetail.cancellationFee ?? 0}%</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Min Cancellation Fee (%)</span>
                <span className="value">{selectedFareDetail.minCancellationFee ?? 0}%</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Delay Fee (per min)</span>
                <span className="value">฿{selectedFareDetail.delayFee ?? 0}</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Idle Fee (per min)</span>
                <span className="value">฿{selectedFareDetail.idleFee ?? 0}</span>
              </div>
              <div className="fare-detail-item">
                <span className="label">Peak Hours</span>
                <span className="value">{selectedFareDetail.peakHours || '-'}</span>
              </div>
            </div>
            <div className="fare-detail-meta">
              <span>Updated by: {selectedFareDetail.updatedBy || 'Thunder@admin.com'}</span>
              <span>Last updated: {selectedFareDetail.lastUpdated || selectedFareDetail.createdAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareSetup;