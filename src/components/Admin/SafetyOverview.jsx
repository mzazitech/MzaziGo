// components/SafetyOverview.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, MapPin, AlertTriangle, Clock, User, Phone } from 'lucide-react';
import { safetyIncidents, incidentTypeOptions, statusOptions, severityOptions, incidentMapMarkers } from '../../data/Admin/SafetyMockData';
import { mapStyles } from './LiveMap';
import '../../styles/Admin/SafetyOverview.css';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

const GOOGLE_MAPS_API_SRC = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCq8MK_UBFrVt1IbwC6g8IfTdCgrSdasJg';
const SAFETY_MAP_DEFAULT_CENTER = { lat: 13.7563, lng: 100.5018 };

const SafetyOverview = () => {
  const [incidents, setIncidents] = useState(safetyIncidents);
  const [markerData, setMarkerData] = useState(incidentMapMarkers);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [activeStatCard, setActiveStatCard] = useState('total');
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowsRef = useRef({});

  const derivedStats = useMemo(() => {
    const resolved = incidents.filter((incident) => incident.status === 'resolved').length;
    const activeIncidents = incidents.filter((incident) => incident.status !== 'resolved');

    return {
      total: activeIncidents.length,
      driver: activeIncidents.filter((incident) => incident.type === 'driver').length,
      passenger: activeIncidents.filter((incident) => incident.type === 'passenger').length,
      resolved,
      pending: activeIncidents.filter((incident) => incident.status === 'pending').length,
    };
  }, [incidents]);

  const statCards = useMemo(() => ([
    { key: 'total', icon: <WarningAmberIcon />, label: 'Total Incidents', value: derivedStats.total },
    { key: 'driver', icon: <DirectionsCarIcon />, label: 'Driver Incidents', value: derivedStats.driver },
    { key: 'passenger', icon: <GroupsIcon />, label: 'Passenger Incidents', value: derivedStats.passenger },
    { key: 'resolved', icon: <CheckCircleIcon />, label: 'Resolved', value: derivedStats.resolved },
    { key: 'pending', icon: <HourglassTopIcon />, label: 'Pending', value: derivedStats.pending }
  ]), [derivedStats]);

  const handleStatCardClick = (cardKey) => {
    setActiveStatCard(cardKey);
    switch (cardKey) {
      case 'driver':
        setActiveTab('driver');
        setSelectedStatus('all');
        setSelectedSeverity('all');
        break;
      case 'passenger':
        setActiveTab('passenger');
        setSelectedStatus('all');
        setSelectedSeverity('all');
        break;
      case 'resolved':
        setActiveTab('all');
        setSelectedStatus('resolved');
        setSelectedSeverity('all');
        break;
      case 'pending':
        setActiveTab('all');
        setSelectedStatus('pending');
        setSelectedSeverity('all');
        break;
      default:
        setActiveTab('all');
        setSelectedStatus('all');
        setSelectedSeverity('all');
        break;
    }
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesTab = activeTab === 'all' || incident.type === activeTab;
    const matchesSearch =
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all'
        ? incident.status !== 'resolved'
        : incident.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;

    return matchesTab && matchesSearch && matchesStatus && matchesSeverity;
  });

  // Filter map markers
  const filteredMarkers = markerData.filter(marker => {
    const matchesTab = activeTab === 'all' || marker.type === activeTab;
    const matchesStatus =
      selectedStatus === 'all'
        ? marker.status !== 'resolved'
        : marker.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || marker.severity === selectedSeverity;
    return matchesTab && matchesStatus && matchesSeverity;
  });

  const severityCounts = useMemo(() => {
    return filteredMarkers.reduce(
      (acc, marker) => {
        acc[marker.severity] = (acc[marker.severity] || 0) + 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0, critical: 0 }
    );
  }, [filteredMarkers]);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: SAFETY_MAP_DEFAULT_CENTER,
        styles: mapStyles,
        disableDefaultUI: true,
      });
      setMapLoaded(true);
    };

    if (window.google?.maps) {
      initMap();
      return undefined;
    }

    let script = document.getElementById('google-maps-sdk');
    const handleLoad = () => initMap();

    if (script) {
      script.addEventListener('load', handleLoad);
      return () => script.removeEventListener('load', handleLoad);
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
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    Object.values(markersRef.current).forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = {};
    infoWindowsRef.current = {};

    if (!filteredMarkers.length) {
      mapInstanceRef.current.setCenter(SAFETY_MAP_DEFAULT_CENTER);
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
          <div style="padding: 10px; font-family: 'Inter', Arial, sans-serif;">
            <strong>${markerData.name}</strong>
            <p style="margin: 6px 0; font-size: 12px;">${markerData.address}</p>
            <p style="margin: 0; font-size: 12px;">${markerData.incidentType}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        Object.values(infoWindowsRef.current).forEach((iw) => iw.close());
        infoWindow.open(mapInstanceRef.current, marker);
        handleMarkerClick(markerData.id);
      });

      markersRef.current[markerData.id] = { marker, infoWindow };
      infoWindowsRef.current[markerData.id] = infoWindow;
      bounds.extend(markerData.location);
    });

    mapInstanceRef.current.fitBounds(bounds);
    if (filteredMarkers.length === 1) {
      mapInstanceRef.current.setZoom(14);
    }
  }, [filteredMarkers, mapLoaded]);



  // Get severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'low': return 'severity-low';
      case 'medium': return 'severity-medium';
      case 'high': return 'severity-high';
      case 'critical': return 'severity-critical';
      default: return '';
    }
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'investigating': return 'status-investigating';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  // Handle view details
  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  // Handle mark as solved
  const handleMarkAsSolved = (incidentId) => {
    if (!window.confirm('Are you sure you want to mark this incident as resolved?')) {
      return;
    }

    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: 'resolved' }
          : incident
      )
    );

    setMarkerData((prev) =>
      prev.map((marker) =>
        marker.id === incidentId ? { ...marker, status: 'resolved' } : marker
      )
    );

    setSelectedIncident((prev) =>
      prev && prev.id === incidentId ? { ...prev, status: 'resolved' } : prev
    );

    setShowDetailModal(false);
    alert('Incident marked as resolved');
  };

  // Get marker color
  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Handle marker click
  const handleMarkerClick = (markerId) => {
    const incident = safetyIncidents.find(inc => inc.id === markerId);
    if (incident) {
      setSelectedIncident(incident);
      setShowDetailModal(true);
    }
  };

  useEffect(() => {
    if (!selectedIncident || !mapLoaded || !mapInstanceRef.current) {
      return;
    }

    const coords = selectedIncident.location?.coordinates;
    if (coords?.lat && coords?.lng) {
      const position = { lat: coords.lat, lng: coords.lng };
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(14);
    }

    const markerEntry = markersRef.current[selectedIncident.id];
    if (markerEntry) {
      Object.values(infoWindowsRef.current).forEach((iw) => iw.close());
      markerEntry.infoWindow.open(mapInstanceRef.current, markerEntry.marker);
    }
  }, [selectedIncident, mapLoaded]);

  return (
    <div className="safety-overview-container">
      <div className="safety-overview-main">
        {/* HEADER */}
        <div className="safety-overview-header">
          <h1>SAFETY OVERVIEW</h1>
        </div>

        <div className="safety-content-wrapper">
          {/* LEFT PANEL - Incident List */}
          <div className="safety-left-panel">
            {/* STATISTICS CARDS */}
            <div className="safety-stats-grid">
              {statCards.map((card) => (
                <div
                  key={card.key}
                  className={`safety-stat-card ${activeStatCard === card.key ? 'stat-card-active' : ''}`}
                  onClick={() => handleStatCardClick(card.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      handleStatCardClick(card.key);
                    }
                  }}
                >
                  <div className="stat-icon-safety">{card.icon}</div>
                  <div className="stat-content-safety">
                    <div className="stat-label-safety">{card.label}</div>
                    <div className="stat-value-safety">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* INCIDENT LIST */}
            <div className="incident-list-section">
              <div className="incident-list-header">
                <h2>INCIDENT LIST</h2>
                <span className="incident-total-count">TOTAL INCIDENT : {filteredIncidents.length}</span>
              </div>

              <div className="incident-toolbar">
                <div className="incident-search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="incident-filter-group">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="filter-select-safety"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="filter-select-safety"
                  >
                    {severityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="incident-names-wrapper">
                {filteredIncidents.length > 0 ? (
                  <div className="incident-names-list">
                    {filteredIncidents.map((incident) => (
                      <button
                        key={incident.id}
                        className="incident-name-item"
                        onClick={() => handleViewDetails(incident)}
                      >
                        <div className="incident-name-main">
                          <div className="incident-name-avatar">
                            <img src={incident.reportedBy.avatar} alt={incident.reportedBy.name} />
                          </div>
                          <span className="incident-name-text">{incident.reportedBy.name}</span>
                          <span className={`incident-name-type ${incident.type}`}>
                            {incident.type === 'driver' ? 'Driver' : 'Customer'}
                          </span>
                        </div>
                        <span className={`incident-name-severity ${getSeverityClass(incident.severity)}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="incident-table-empty">
                    <AlertTriangle size={48} />
                    <p>No incidents found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* END LEFT PANEL */}

          {/* RIGHT PANEL - Map */}
          <div className="safety-right-panel">
            {/* Map Search */}
            <div className="map-search-safety">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search Location Here"
                className="map-search-input-safety"
              />
            </div>

            {/* Mock Map */}
            <div className="map-container-safety">
              <div ref={mapRef} className="safety-map-canvas" />
              {!mapLoaded && (
                <div className="map-loading-safety">
                  <AlertTriangle size={36} />
                  <p>Loading map...</p>
                </div>
              )}

              <div className="map-severity-legend">
                <h4>Severity</h4>
                <div className="legend-row">
                  <span className="legend-dot low" />
                  <span>Low ({severityCounts.low || 0})</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot medium" />
                  <span>Medium ({severityCounts.medium || 0})</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot high" />
                  <span>High ({severityCounts.high || 0})</span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot critical" />
                  <span>Critical ({severityCounts.critical || 0})</span>
                </div>
              </div>
            </div>

          </div>
          {/* END RIGHT PANEL */}
        </div>
        {/* END CONTENT WRAPPER */}

        {/* DETAIL MODAL */}
        {showDetailModal && selectedIncident && (
          <div className="modal-overlay-safety" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content-safety" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-safety">
                <h2>Incident Details</h2>
                <button
                  className="modal-close-safety"
                  onClick={() => setShowDetailModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body-safety">
                {/* Incident Information */}
                <div className="detail-section-safety">
                  <h3>Incident Information</h3>
                  <div className="detail-grid-safety">
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Incident ID:</span>
                      <span className="detail-value-safety">{selectedIncident.id}</span>
                    </div>
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Type:</span>
                      <span className={`incident-type-badge ${selectedIncident.type}`}>
                        {selectedIncident.type === 'driver' ? 'Driver' : 'Customer'}
                      </span>
                    </div>
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Status:</span>
                      <span className={`status-badge-safety ${getStatusClass(selectedIncident.status)}`}>
                        {selectedIncident.status.charAt(0).toUpperCase() + selectedIncident.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Severity:</span>
                      <span className={`severity-badge ${getSeverityClass(selectedIncident.severity)}`}>
                        {selectedIncident.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Reported Date:</span>
                      <span className="detail-value-safety">{selectedIncident.reportedDate} {selectedIncident.reportedTime}</span>
                    </div>
                    <div className="detail-item-safety">
                      <span className="detail-label-safety">Trip ID:</span>
                      <span className="detail-value-safety">{selectedIncident.tripId}</span>
                    </div>
                  </div>
                </div>

                {/* Reporter Information */}
                <div className="detail-section-safety">
                  <h3>Reported By</h3>
                  <div className="reporter-detail-card">
                    <img src={selectedIncident.reportedBy.avatar} alt={selectedIncident.reportedBy.name} className="reporter-avatar-large" />
                    <div className="reporter-detail-info">
                      <h4>{selectedIncident.reportedBy.name}</h4>
                      <p><User size={14} /> {selectedIncident.reportedBy.role}</p>
                      <p><Phone size={14} /> {selectedIncident.reportedBy.phone}</p>
                      <p>ID: {selectedIncident.reportedBy.id}</p>
                    </div>
                  </div>
                </div>

                {/* Related Driver */}
                {selectedIncident.type === 'passenger' && selectedIncident.relatedDriver && (
                  <div className="detail-section-safety">
                    <h3>Related Driver</h3>
                    <div className="reporter-detail-card">
                      <img src={selectedIncident.relatedDriver.avatar} alt={selectedIncident.relatedDriver.name} className="reporter-avatar-large" />
                      <div className="reporter-detail-info">
                        <h4>{selectedIncident.relatedDriver.name}</h4>
                        <p><Phone size={14} /> {selectedIncident.relatedDriver.phone}</p>
                        <p>ID: {selectedIncident.relatedDriver.id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Information */}
                <div className="detail-section-safety">
                  <h3>Location</h3>
                  <div className="location-info-safety">
                    <MapPin size={20} />
                    <span>{selectedIncident.location.address}</span>
                  </div>
                  <div className="map-placeholder-safety">
                    <div className="map-pin-safety">📍</div>
                    <p>Map showing incident location</p>
                    <small>Lat: {selectedIncident.location.coordinates.lat}, Lng: {selectedIncident.location.coordinates.lng}</small>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="detail-section-safety">
                  <h3>Incident Details</h3>
                  <div className="incident-info-box">
                    <p><strong>Type:</strong> {selectedIncident.incidentType}</p>
                    <p><strong>Injury Status:</strong> {selectedIncident.injuryStatus}</p>
                    <p><strong>Description:</strong> {selectedIncident.description}</p>
                    <p><strong>Response Time:</strong> {selectedIncident.responseTime}</p>
                    <p><strong>Assigned To:</strong> {selectedIncident.assignedTo}</p>
                  </div>
                </div>

                {/* Notes */}
                <div className="detail-section-safety">
                  <h3>Notes</h3>
                  <div className="notes-box-safety">
                    {selectedIncident.notes}
                  </div>
                </div>

                {/* Timeline */}
                <div className="detail-section-safety">
                  <h3>Timeline</h3>
                  <div className="timeline-safety">
                    {selectedIncident.timeline.map((item, index) => (
                      <div key={index} className="timeline-item-safety">
                        <div className="timeline-time">{item.time}</div>
                        <div className="timeline-dot"></div>
                        <div className="timeline-event">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer-safety">
                {selectedIncident.status !== 'resolved' && (
                  <button
                    className="modal-btn-resolve"
                    onClick={() => handleMarkAsSolved(selectedIncident.id)}
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  className="modal-btn-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyOverview;