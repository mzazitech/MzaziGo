import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { liveMapData } from '../../data/Admin/liveMapData';
import { addRejectionMessage } from '../../data/Admin/ChatMockData';
import '../../styles/Admin/IdentityRequest.css';

const IdentityRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({});
  const hasWindow = typeof window !== 'undefined';
  const NOTE_STORAGE_KEY = 'identityRequestNotes';
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

  // ดึงเฉพาะคนขับที่ documentVerified = false
  const pendingDrivers = liveMapData.drivers.all.filter(driver => 
    driver.documentVerified === false && !verificationStatus[driver.id]
  );

  const filteredDocuments = pendingDrivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (driver) => {
    setSelectedDocument(driver);
    setShowDetailModal(true);
  };

  const handleApprove = (driver) => {
    const adminEmail = localStorage.getItem('adminEmail') || 'Thunder@admin.com';
    const now = new Date();
    const dateTime = now.toLocaleString('th-TH', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setVerificationStatus({
      ...verificationStatus,
      [driver.id]: {
        status: 'Approved',
        verifiedBy: adminEmail,
        verifiedAt: dateTime
      }
    });

    alert(`เอกสารของ ${driver.name} ได้รับการอนุมัติแล้ว!`);
    setShowDetailModal(false);
  };

  const handleReject = (driver) => {
    const reason = prompt('กรุณาระบุเหตุผลในการปฏิเสธ:');
    if (reason) {
      const adminEmail = localStorage.getItem('adminEmail') || 'Thunder@admin.com';
      const now = new Date();
      const dateTime = now.toLocaleString('th-TH', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      setVerificationStatus({
        ...verificationStatus,
        [driver.id]: {
          status: 'Rejected',
          verifiedBy: adminEmail,
          verifiedAt: dateTime,
          reason: reason
        }
      });

      addRejectionMessage(driver.id, reason);

      alert(`เอกสารของ ${driver.name} ถูกปฏิเสธ\nเหตุผล: ${reason}`);
      setShowDetailModal(false);
    }
  };

  const handleNoteChange = (driverId, value) => {
    setNotes(prev => {
      const next = { ...prev, [driverId]: value };
      updateNotesStorage(next);
      return next;
    });
  };

  return (
    <div className="identity-request-container">
      <div className="identity-header">
        <h2>DRIVER DOCUMENT VERIFICATION</h2>
        <div className="header-actions">
          <span className="total-items">TOTAL ITEMS: {filteredDocuments.length}</span>
          <button className="add-new-btn">+ ADD NEW</button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box-identity">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="documents-table-wrapper">
        <table className="documents-table">
          <thead>
            <tr>
              <th>NO.</th>
              <th>NAME</th>
              <th>CONTACT</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>NOTE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((driver, index) => (
              <tr key={driver.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="driver-name-cell">
                    <span className="driver-name-text">{driver.name}</span>
                    <span className="document-type">Driver ID: {driver.id}</span>
                  </div>
                </td>
                <td>Phone : {driver.phone}</td>
                <td>{driver.joinDate || 'N/A'}</td>
                <td>
                  <span className="status-badge-doc pending">
                    Pending
                  </span>
                </td>
                <td>
                  <textarea
                    className="note-cell-input"
                    value={notes[driver.id] ?? ''}
                    onChange={(e) => handleNoteChange(driver.id, e.target.value)}
                    placeholder="Type note..."
                  />
                  {verificationStatus[driver.id] && (
                    <div className="note-meta">
                      <div>ตรวจสอบโดย: {verificationStatus[driver.id].verifiedBy}</div>
                      <div>เมื่อ: {verificationStatus[driver.id].verifiedAt}</div>
                    </div>
                  )}
                </td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(driver)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredDocuments.length === 0 && (
              <tr>
                <td colSpan="7" className="no-pending-docs">
                  ไม่มีเอกสารรอตรวจสอบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDocument && (
        <div className="modal-overlay-identity" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>×</button>
            
            <div className="modal-header-identity">
              <h3>UPLOADED DOCUMENTS</h3>
              <div className="modal-header-actions">
                <span className="total-label">TOTAL ITEMS: {Object.keys(selectedDocument.documents).length}</span>
              </div>
            </div>

            <div className="modal-content-identity">
              <div className="documents-grid-modal">
                {selectedDocument.documents && Object.entries(selectedDocument.documents).map(([key, url], index) => (
                  <div key={key} className="document-preview-item">
                    <div className="document-preview-box">
                      <img src={url} alt={key} />
                    </div>
                    <div className="document-info">
                      <span className="doc-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="doc-date">{selectedDocument.joinDate || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {(!selectedDocument.documents || Object.keys(selectedDocument.documents).length === 0) && (
                <div className="no-documents">
                  <p className="no-docs-text">กดที่ click to view details</p>
                  <p className="no-docs-subtext">เมื่อเจอข้อมูลที่ผิดพลาด ยูมใด้</p>
                </div>
              )}
            </div>

            <div className="modal-actions-identity">
              <button className="reject-btn" onClick={() => handleReject(selectedDocument)}>
                REJECT
              </button>
              <button className="approve-btn" onClick={() => handleApprove(selectedDocument)}>
                APPROVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityRequest;