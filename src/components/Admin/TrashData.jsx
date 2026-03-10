import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import '../../styles/Admin/DriverList.css';

const TrashData = ({ deletedDrivers, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const hasWindow = typeof window !== 'undefined';
  const NOTE_STORAGE_KEY = 'deletedDriverNotes';
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
      // ignore storage errors
    }
  };

  const filteredDrivers = deletedDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  const handleNoteChange = (driverId, value) => {
    setNotes(prev => {
      const next = { ...prev, [driverId]: value };
      updateNotesStorage(next);
      return next;
    });
  };

  return (
    <div className="trash-data-container">
      <div className="trash-header">
        <button className="back-to-list-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>DELETED DRIVER LIST</h2>
      </div>

      <div className="trash-search">
        <div className="search-box-driver">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Driver"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="total-count">TOTAL DRIVER : {filteredDrivers.length}</div>
      </div>

      <div className="driver-table-wrapper">
        <table className="driver-table trash-table">
          <thead>
            <tr>
              <th>NO.</th>
              <th>NAME</th>
              <th>CONTACT</th>
              <th>TOTAL RIDE</th>
              <th>EARNING</th>
              <th>DELETED BY</th>
              <th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{index + 1}</td>
                  <td>{driver.name}</td>
                  <td>Phone : {driver.phone}</td>
                  <td>{driver.totalRides}</td>
                  <td>{driver.earning.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>{driver.deletedBy}</td>
                  <td>
                    <textarea
                      className="note-cell-input"
                      value={notes[driver.id] ?? ''}
                      onChange={(e) => handleNoteChange(driver.id, e.target.value)}
                      placeholder="Type note..."
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-trash">
                  <div className="empty-message">
                    <p>No deleted drivers</p>
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

export default TrashData;