import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import '../../styles/Admin/PassengerList.css';

const TrashPassengerData = ({ deletedPassengers, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const hasWindow = typeof window !== 'undefined';
  const NOTE_STORAGE_KEY = 'deletedPassengerNotes';
  const [notes, setNotes] = useState(() => {
    if (!hasWindow) return {};
    try {
      return JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });

  const updateNotesStorage = (data) => {
    if (!hasWindow) return;
    try {
      localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage issues
    }
  };

  const filteredPassengers = deletedPassengers.filter(passenger =>
    passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passenger.phone.includes(searchTerm)
  );

  const handleNoteChange = (passengerId, value) => {
    setNotes(prev => {
      const next = { ...prev, [passengerId]: value };
      updateNotesStorage(next);
      return next;
    });
  };

  return (
    <div className="trash-data-container">
      <div className="trash-header">
        <button className="back-to-list-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Customer List
        </button>
        <h2>DELETED CUSTOMER LIST</h2>
      </div>

      <div className="trash-search">
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

      <div className="passenger-table-wrapper">
        <table className="passenger-table trash-table">
          <thead>
            <tr>
              <th>NO.</th>
              <th>NAME</th>
              <th>CONTACT</th>
              <th>TOTAL RIDE</th>
              <th>ยอดเงินที่ใช้ไปทั้งหมด</th>
              <th>DELETED BY</th>
              <th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            {filteredPassengers.length > 0 ? (
              filteredPassengers.map((passenger, index) => (
                <tr key={passenger.id}>
                  <td>{index + 1}</td>
                  <td>{passenger.name}</td>
                  <td>Phone : {passenger.phone}</td>
                  <td>{passenger.totalRides || 0}</td>
                  <td>{(passenger.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>{passenger.deletedBy}</td>
                  <td>
                    <textarea
                      className="note-cell-input"
                      value={notes[passenger.id] ?? ''}
                      onChange={(e) => handleNoteChange(passenger.id, e.target.value)}
                      placeholder="Type note..."
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-trash">
                  <div className="empty-message">
                    <p>No deleted passengers</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrashPassengerData;