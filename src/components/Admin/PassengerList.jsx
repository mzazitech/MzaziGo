import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveMapData } from '../../data/Admin/liveMapData';
import PassengerStatCard from './PassengerStatCard';
import TrashPassengerData from './TrashPassengerData';
import ViewPassenger from './ViewPassenger';
import '../../styles/Admin/PassengerList.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupsIcon from '@mui/icons-material/Groups';

const PassengerList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [showViewPassenger, setShowViewPassenger] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [deletedPassengers, setDeletedPassengers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState(null);

  // คำนวณสถิติ
  const stats = {
    newPassenger: liveMapData.passengers.filter(p => {
      const joinDate = new Date(p.joinDate || '2025-11-01');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate >= thirtyDaysAgo;
    }).length,
    activePassenger: liveMapData.passengers.filter(p => p.totalRides > 10).length,
    inactivePassenger: liveMapData.passengers.filter(p => p.totalRides <= 10).length,
    totalPassenger: liveMapData.passengers.length
  };

  // กรองข้อมูลตามหมวดหมู่
  const getFilteredPassengers = () => {
    let filtered = [...liveMapData.passengers];

    switch (selectedCategory) {
      case 'new':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(p => {
          const joinDate = new Date(p.joinDate || '2025-11-01');
          return joinDate >= thirtyDaysAgo;
        });
        break;
      case 'active':
        filtered = filtered.filter(p => p.totalRides > 10);
        break;
      case 'inactive':
        filtered = filtered.filter(p => p.totalRides <= 10);
        break;
      default:
        break;
    }

    // กรองคนที่ยังไม่ถูกลบ
    filtered = filtered.filter(p => !deletedPassengers.find(del => del.id === p.id));

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => (b.totalRides || 0) - (a.totalRides || 0));
  };

  const handleDeleteClick = (passenger) => {
    setPassengerToDelete(passenger);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (passengerToDelete) {
      const deletedInfo = {
        ...passengerToDelete,
        deletedBy: 'Thunder@admin.com',
        deletedDate: new Date().toLocaleDateString('th-TH')
      };
      setDeletedPassengers([...deletedPassengers, deletedInfo]);
      setShowDeleteModal(false);
      setPassengerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPassengerToDelete(null);
  };

  if (showTrash) {
    return <TrashPassengerData deletedPassengers={deletedPassengers} onBack={() => setShowTrash(false)} />;
  }

  if (showViewPassenger && selectedPassenger) {
    return <ViewPassenger passenger={selectedPassenger} onBack={() => {
      setShowViewPassenger(false);
      setSelectedPassenger(null);
    }} />;
  }

  const filteredPassengers = getFilteredPassengers();

  return (
    <div className="passenger-list-container">
      {/* Stat Cards */}
      <div className="passenger-stats-grid">
        <PassengerStatCard 
          icon={<PersonAddIcon />}
          count={stats.newPassenger} 
          label="NEW CUSTOMER"
          isActive={selectedCategory === 'new'}
          onClick={() => setSelectedCategory('new')}
        />
        <PassengerStatCard 
          icon={<CheckCircleIcon />}
          count={stats.activePassenger} 
          label="ACTIVE CUSTOMER"
          isActive={selectedCategory === 'active'}
          onClick={() => setSelectedCategory('active')}
        />
        <PassengerStatCard 
          icon={<CancelIcon />}
          count={stats.inactivePassenger} 
          label="INACTIVE CUSTOMER"
          isActive={selectedCategory === 'inactive'}
          onClick={() => setSelectedCategory('inactive')}
        />
        <PassengerStatCard 
          icon={<GroupsIcon />}
          count={stats.totalPassenger} 
          label="TOTAL CUSTOMER"
          isActive={selectedCategory === 'total'}
          onClick={() => setSelectedCategory('total')}
        />
      </div>

      {/* Passenger List Table */}
      <div className="passenger-list-section">
        <div className="passenger-list-header">
          <h2>CUSTOMER LIST</h2>
          <div className="passenger-list-actions">
            <button className="trash-btn" onClick={() => setShowTrash(true)}>
              <Trash2 size={18} />
              TRASH DATA
            </button>
            <button className="add-passenger-btn" onClick={() => navigate('/admin/add-passenger')}>
              + ADD CUSTOMER
            </button>
          </div>
        </div>

        <div className="passenger-list-search">
          <div className="search-box-passenger">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="total-count">TOTAL CUSTOMER : {filteredPassengers.length}</div>
        </div>

        {/* Table */}
        <div className="passenger-table-wrapper">
          <table className="passenger-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME</th>
                <th>CONTACT</th>
                <th>TOTAL RIDE</th>
                <th>ยอดเงินที่ใช้ไปทั้งหมด</th>
                <th>OTHER</th>
              </tr>
            </thead>
            <tbody>
              {filteredPassengers.map((passenger, index) => (
                <tr key={passenger.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="passenger-name-cell">
                      <span className="passenger-name">{passenger.name}</span>
                    </div>
                  </td>
                  <td>Phone : {passenger.phone}</td>
                  <td>{passenger.totalRides || 0}</td>
                  <td>{(passenger.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Info"
                        onClick={() => navigate('/admin/edit-passenger', { state: { passenger } })}
                      >
                        ✎
                      </button>
                      <button 
                        className="action-btn view-btn" 
                        title="View Info"
                        onClick={() => {
                          setSelectedPassenger(passenger);
                          setShowViewPassenger(true);
                        }}
                      >
                        👁
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Info"
                        onClick={() => handleDeleteClick(passenger)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-icon">!</div>
            <h3>ARE YOU SURE ?</h3>
            <div className="modal-actions">
              <button className="modal-btn no-btn" onClick={cancelDelete}>NO</button>
              <button className="modal-btn yes-btn" onClick={confirmDelete}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerList;