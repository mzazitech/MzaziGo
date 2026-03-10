import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveMapData } from '../../data/Admin/liveMapData';
import { incidentMapMarkers } from '../../data/Admin/SafetyMockData';
import { mapStyles } from './LiveMap';
import DriverStatCard from './DriverStatCard';
import TrashData from './TrashData';
import ViewDriver from './ViewDriver';
import '../../styles/Admin/DriverList.css';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

const GOOGLE_MAPS_API_SRC = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCq8MK_UBFrVt1IbwC6g8IfTdCgrSdasJg';
const INCIDENT_MAP_DEFAULT_CENTER = { lat: 13.7563, lng: 100.5018 };
const INCIDENT_SEVERITIES = ['low', 'medium', 'high', 'critical'];

const DriverList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [showViewDriver, setShowViewDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deletedDrivers, setDeletedDrivers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // คำนวณสถิติ
  const stats = {
    vanDriver: liveMapData.drivers.all.filter(d => d.licenseType === 'VAN').length,
    carDriver: liveMapData.drivers.all.filter(d => d.licenseType === 'CAR').length,
    bikeDriver: liveMapData.drivers.all.filter(d => d.licenseType === 'BIKE').length,
    activeDriver: liveMapData.drivers.all.filter(d => d.status === 'on-trip').length,
    inactiveDriver: liveMapData.drivers.all.filter(d => d.status === 'idle').length,
    totalDriver: liveMapData.drivers.all.length
  };

  // กรองข้อมูลตามหมวดหมู่ที่เลือก
  const getFilteredDrivers = () => {
    let filtered = [...liveMapData.drivers.all];

    // กรองตามหมวดหมู่
    switch (selectedCategory) {
      case 'van':
        filtered = filtered.filter(d => d.licenseType === 'VAN');
        break;
      case 'car':
        filtered = filtered.filter(d => d.licenseType === 'CAR');
        break;
      case 'bike':
        filtered = filtered.filter(d => d.licenseType === 'BIKE');
        break;
      case 'active':
        filtered = filtered.filter(d => d.status === 'on-trip');
        break;
      case 'inactive':
        filtered = filtered.filter(d => d.status === 'idle');
        break;
      default:
        // total - แสดงทั้งหมด
        break;
    }

    // กรองคนที่ยังไม่ถูกลบ
    filtered = filtered.filter(d => !deletedDrivers.find(del => del.id === d.id));

    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm)
      );
    }

    // เรียงตาม rating จากมากไปน้อย
    return filtered.sort((a, b) => b.rating - a.rating);
  };

  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (driverToDelete) {
      const deletedInfo = {
        ...driverToDelete,
        deletedBy: 'Thunder@admin.com',
        deletedDate: new Date().toLocaleDateString('th-TH')
      };
      setDeletedDrivers([...deletedDrivers, deletedInfo]);
      setShowDeleteModal(false);
      setDriverToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };

  // แสดงหน้า Trash Data
  if (showTrash) {
    return <TrashData deletedDrivers={deletedDrivers} onBack={() => setShowTrash(false)} />;
  }

  // แสดงหน้า View Driver
  if (showViewDriver && selectedDriver) {
    return <ViewDriver driver={selectedDriver} onBack={() => {
      setShowViewDriver(false);
      setSelectedDriver(null);
    }} />;
  }

  const filteredDrivers = getFilteredDrivers();

  // แสดงดาวเรทติ้ง
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    return stars;
  };

  return (
    <div className="driver-list-container">
      {/* Stat Cards */}
      <div className="driver-stats-grid">
        <DriverStatCard 
          icon={<AirportShuttleIcon />}
          count={stats.vanDriver} 
          label="VAN DRIVER"
          isActive={selectedCategory === 'van'}
          onClick={() => setSelectedCategory('van')}
        />
        <DriverStatCard 
          icon={<DirectionsCarIcon />}
          count={stats.carDriver} 
          label="CAR DRIVER"
          isActive={selectedCategory === 'car'}
          onClick={() => setSelectedCategory('car')}
        />
        <DriverStatCard 
          icon={<TwoWheelerIcon />}
          count={stats.bikeDriver} 
          label="BIKE DRIVER"
          isActive={selectedCategory === 'bike'}
          onClick={() => setSelectedCategory('bike')}
        />
        <DriverStatCard 
          icon={<CheckCircleIcon />}
          count={stats.activeDriver} 
          label="ACTIVE DRIVER"
          isActive={selectedCategory === 'active'}
          onClick={() => setSelectedCategory('active')}
        />
        <DriverStatCard 
          icon={<CancelIcon />}
          count={stats.inactiveDriver} 
          label="INACTIVE DRIVER"
          isActive={selectedCategory === 'inactive'}
          onClick={() => setSelectedCategory('inactive')}
        />
        <DriverStatCard 
          icon={<LocalTaxiIcon />}
          count={stats.totalDriver} 
          label="TOTAL DRIVER"
          isActive={selectedCategory === 'total'}
          onClick={() => setSelectedCategory('total')}
        />
      </div>

      {/* Driver List Table */}
      <div className="driver-list-section">
        <div className="driver-list-header">
          <h2>DRIVER LIST</h2>
          <div className="driver-list-actions">
            <button className="trash-btn" onClick={() => setShowTrash(true)}>
              <Trash2 size={18} />
              TRASH DATA
            </button>
            <button className="add-driver-btn" onClick={() => navigate('/admin/add-driver')}>
              + ADD DRIVER
            </button>
          </div>
        </div>

        <div className="driver-list-search">
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

        {/* Table */}
        <div className="driver-table-wrapper">
          <table className="driver-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>NAME</th>
                <th>CONTACT</th>
                <th>TOTAL RIDE</th>
                <th>EARNING</th>
                <th>OTHER</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="driver-name-cell">
                      <span className="driver-name">{driver.name}</span>
                      <div className="driver-rating">
                        {renderStars(driver.rating)}
                        <span className="rating-number">{driver.rating}</span>
                      </div>
                      {!driver.documentVerified && (
                        <span 
                          className="doc-unverified-badge"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/identity-request');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          เอกสารยังไม่ได้ตรวจสอบ (คลิกเพื่อตรวจสอบ)
                        </span>
                      )}
                    </div>
                  </td>
                  <td>Phone : {driver.phone}</td>
                  <td>{driver.totalRides}</td>
                  <td>{driver.earning.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Info"
                        onClick={() => navigate('/admin/edit-driver', { state: { driver } })}
                      >
                        ✎
                      </button>
                      <button 
                        className="action-btn view-btn" 
                        title="View Info"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowViewDriver(true);
                        }}
                      >
                        👁
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Info"
                        onClick={() => handleDeleteClick(driver)}
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

      <IncidentMapPanel />

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


const IncidentMapPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const filteredMarkers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return incidentMapMarkers.filter((marker) => {
      const matchesSearch =
        !normalizedTerm ||
        marker.name.toLowerCase().includes(normalizedTerm) ||
        marker.address.toLowerCase().includes(normalizedTerm) ||
        marker.incidentType.toLowerCase().includes(normalizedTerm);
      const matchesType = typeFilter === 'all' || marker.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || marker.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const severityCounts = useMemo(() => {
    const base = { low: 0, medium: 0, high: 0, critical: 0 };
    filteredMarkers.forEach((marker) => {
      base[marker.severity] = (base[marker.severity] || 0) + 1;
    });
    return base;
  }, [filteredMarkers]);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: INCIDENT_MAP_DEFAULT_CENTER,
        styles: mapStyles,
        disableDefaultUI: true,
      });
      setMapReady(true);
    };

    if (window.google && window.google.maps) {
      initMap();
      return undefined;
    }

    let script = document.getElementById('google-maps-sdk');
    const handleLoad = () => initMap();

    if (script) {
      script.addEventListener('load', handleLoad);
      return () => script?.removeEventListener('load', handleLoad);
    }

    script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = GOOGLE_MAPS_API_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.google?.maps) return;

    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = [];

    if (!filteredMarkers.length) {
      mapInstanceRef.current.setCenter(INCIDENT_MAP_DEFAULT_CENTER);
      mapInstanceRef.current.setZoom(11);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    filteredMarkers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.location,
        map: mapInstanceRef.current,
        title: `${markerData.name} - ${markerData.incidentType}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getMarkerColor(markerData.severity),
          fillOpacity: 0.95,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Inter', Arial, sans-serif; width: 240px;">
            <h4 style="margin: 0 0 6px; font-size: 14px; font-weight: 600;">${markerData.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">${markerData.address}</p>
            <p style="margin: 8px 0 0; font-size: 12px;"><strong>Incident:</strong> ${markerData.incidentType}</p>
            <p style="margin: 4px 0 0; font-size: 12px;"><strong>Status:</strong> ${markerData.status}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        markersRef.current.forEach(({ infoWindow: iw }) => iw.close());
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push({ marker, infoWindow });
      bounds.extend(markerData.location);
    });

    mapInstanceRef.current.fitBounds(bounds);
    if (filteredMarkers.length === 1) {
      mapInstanceRef.current.setZoom(14);
    }
  }, [filteredMarkers, mapReady]);

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#fbbf24';
      case 'high':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="driver-map-section">
      <div className="driver-map-header">
        <div>
          <h2>INCIDENT MAP</h2>
          <p>Live Google Map view with current safety reports</p>
        </div>
        <span className="driver-map-pill">
          {filteredMarkers.length} active incident{filteredMarkers.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="driver-map-wrapper">
        <div ref={mapRef} className="driver-map-canvas" />
        {!mapReady && (
          <div className="driver-map-loading">
            <AlertTriangle size={32} />
            <p>Loading map...</p>
          </div>
        )}

        <div className="driver-map-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search incident, location, or person"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="driver-map-filters">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="driver">Driver</option>
            <option value="passenger">Customer</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="driver-map-legend">
          <div className="legend-title">Severity</div>
          {INCIDENT_SEVERITIES.map((level) => (
            <div className="legend-item" key={level}>
              <span className={`legend-dot ${level}`} />
              <span className="legend-label">
                {level.charAt(0).toUpperCase() + level.slice(1)} ({severityCounts[level] || 0})
              </span>
            </div>
          ))}
          <div className="legend-summary">
            <MapPin size={16} />
            <span>{filteredMarkers.length} pins displayed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverList;