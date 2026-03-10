import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Phone, User, Calendar, Clock, Car, X } from 'lucide-react';
import { liveMapData } from '../../data/Admin/liveMapData';
import '../../styles/Admin/LiveMap.css';
import { calculateDistance } from '../../utils/Admin/FareCalculator';

export const mapStyles = [
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const LiveMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowsRef = useRef({});
  const routeLinesRef = useRef({});
  const routeAnimationOffsetsRef = useRef({});

  const [activeTab, setActiveTab] = useState('driver');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLocationSearch, setMapLocationSearch] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [realtimePositions, setRealtimePositions] = useState({});
  const [driverRoutes, setDriverRoutes] = useState({});
  const [, forceRefresh] = useState(0);

  const refreshLiveMapData = useCallback(() => {
    if (typeof liveMapData.syncDynamicData === 'function') {
      liveMapData.syncDynamicData();
    }
    forceRefresh((prev) => prev + 1);
  }, [forceRefresh]);

  useEffect(() => {
    refreshLiveMapData();

    if (typeof window === 'undefined') {
      return undefined;
    }

    window.addEventListener('fare-data-updated', refreshLiveMapData);
    return () => window.removeEventListener('fare-data-updated', refreshLiveMapData);
  }, [refreshLiveMapData]);

  // Handle map location search with geocoding
  const handleLocationSearch = () => {
    if (!mapReady || !mapInstanceRef.current || !window.google?.maps) return;
    const query = mapLocationSearch.trim();
    if (!query) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const { location } = results[0].geometry;
        mapInstanceRef.current.panTo(location);
        mapInstanceRef.current.setZoom(15);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    });
  };

  // ดึงข้อมูลตาม tab และ filter
  const getCurrentList = () => {
    if (activeTab === 'driver') {
      return liveMapData.drivers.all;
    } else if (activeTab === 'onTrip') {
      return liveMapData.drivers.onTrip;
    } else if (activeTab === 'idle') {
      return liveMapData.drivers.idle;
    } else {
      return liveMapData.passengers;
    }
  };

  const filteredList = getCurrentList().filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load Google Map
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCq8MK_UBFrVt1IbwC6g8IfTdCgrSdasJg`;
    script.async = true;
    script.onload = () => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 13.7563, lng: 100.5018 }, // Bangkok center
          styles: mapStyles,
        });
        mapInstanceRef.current = map;
        setMapReady(true);
      }
    };
    document.head.appendChild(script);
  }, []);

  // Real-time position update simulation
  const getPointAlongRoute = (routeInfo, progress) => {
    if (!routeInfo || !routeInfo.segments || routeInfo.segments.length === 0) {
      return routeInfo?.path?.[routeInfo?.path.length - 1] || null;
    }
    const targetDistance = progress * routeInfo.totalDistance;
    const segment = routeInfo.segments.find(
      (seg) => targetDistance <= seg.cumulativeEnd
    ) || routeInfo.segments[routeInfo.segments.length - 1];

    if (!segment || segment.distance === 0) {
      return segment?.end || routeInfo.path[routeInfo.path.length - 1];
    }

    const segmentProgress =
      (targetDistance - segment.cumulativeStart) / segment.distance;

    return {
      lat: segment.start.lat + (segment.end.lat - segment.start.lat) * segmentProgress,
      lng: segment.start.lng + (segment.end.lng - segment.start.lng) * segmentProgress,
    };
  };

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const updatePositions = () => {
      const newPositions = {};

      filteredList.forEach(item => {
        const key = item.id;
        const current = realtimePositions[key] || {
          lat: item.location.lat,
          lng: item.location.lng,
          progress: 0
        };

        let newProgress = current.progress;
        if (item.status === 'on-trip' && item.destination) {
          newProgress = (current.progress + 0.01) % 1;
          const routeInfo = driverRoutes[item.id];
          if (routeInfo?.path?.length > 1) {
            const point = getPointAlongRoute(routeInfo, newProgress) || current;
            newPositions[key] = {
              lat: point.lat,
              lng: point.lng,
              progress: newProgress
            };
            return;
          }
        }

        newPositions[key] = current;
      });

      setRealtimePositions(newPositions);
    };

    const interval = setInterval(updatePositions, 2000);
    return () => clearInterval(interval);
  }, [mapReady, filteredList, realtimePositions, driverRoutes]);

  useEffect(() => {
    if (!mapReady || !window.google?.maps) return;

    let isCancelled = false;
    const directionsService = new window.google.maps.DirectionsService();
    const onTripDrivers = liveMapData.drivers.all.filter(
      (driver) => driver.status === 'on-trip' && driver.currentPassengerCoords
    );
    const activeIds = new Set(onTripDrivers.map((driver) => driver.id));

    const nextRoutes = {};
    let hasChanges = false;

    Object.keys(driverRoutes).forEach((driverId) => {
      if (!activeIds.has(driverId)) {
        hasChanges = true;
        return;
      }
      nextRoutes[driverId] = driverRoutes[driverId];
    });

    const requests = [];

    onTripDrivers.forEach((driver) => {
      const passengerCoords = driver.currentPassengerCoords;
      if (!passengerCoords) return;

      const routeKey = `${driver.id}_${driver.location.lat}_${driver.location.lng}_${passengerCoords.lat}_${passengerCoords.lng}`;
      const existing = driverRoutes[driver.id];

      if (existing && existing.routeKey === routeKey) {
        nextRoutes[driver.id] = existing;
        return;
      }

      requests.push(
        new Promise((resolve) => {
          directionsService.route(
            {
              origin: { lat: driver.location.lat, lng: driver.location.lng },
              destination: { lat: passengerCoords.lat, lng: passengerCoords.lng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (isCancelled) return resolve(null);

              if (status === window.google.maps.DirectionsStatus.OK && result.routes[0]) {
                const route = result.routes[0];
                const overviewPath = route.overview_path || [];
                const path = overviewPath.map((latLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                }));

                const segments = [];
                let cumulative = 0;
                for (let i = 0; i < path.length - 1; i += 1) {
                  const start = path[i];
                  const end = path[i + 1];
                  const distance =
                    calculateDistance(start.lat, start.lng, end.lat, end.lng) * 1000;
                  segments.push({
                    start,
                    end,
                    distance,
                    cumulativeStart: cumulative,
                    cumulativeEnd: cumulative + distance,
                  });
                  cumulative += distance;
                }

                nextRoutes[driver.id] = {
                  path,
                  segments,
                  totalDistance: cumulative || 1,
                  routeKey,
                  distanceText: route.legs?.[0]?.distance?.text || '',
                  durationText: route.legs?.[0]?.duration?.text || '',
                };
                hasChanges = true;
              }

              resolve(null);
            }
          );
        })
      );
    });

    if (!requests.length) {
      if (hasChanges) {
        setDriverRoutes(nextRoutes);
      }
      return () => {
        isCancelled = true;
      };
    }

    Promise.all(requests).then(() => {
      if (!isCancelled && hasChanges) {
        setDriverRoutes(nextRoutes);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [mapReady, driverRoutes, liveMapData.drivers.all]);

  // Update markers on map
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4,
      strokeColor: '#fbbf24',
    };

    filteredList.forEach(item => {
      const pos = realtimePositions[item.id] || {
        lat: item.location.lat,
        lng: item.location.lng
      };

      // Remove old marker
      if (markersRef.current[item.id]) {
        markersRef.current[item.id].setMap(null);
      }

      // Close old info window
      if (infoWindowsRef.current[item.id]) {
        infoWindowsRef.current[item.id].close();
      }

      // Create marker with custom icon
      const isDriver = item.id.startsWith('D');
      const isSelectedDriver = isDriver && selectedItem && selectedItem.id === item.id;
      const markerColor = isSelectedDriver
        ? '#ef4444'
        : item.status === 'on-trip'
          ? '#3b82f6'
          : '#10b981';
      const markerScale = isSelectedDriver ? 14 : 10;
      const strokeColor = isSelectedDriver ? '#991b1b' : '#ffffff';

      const marker = new window.google.maps.Marker({
        position: { lat: pos.lat, lng: pos.lng },
        map: mapInstanceRef.current,
        title: item.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: markerScale,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor,
          strokeWeight: 2,
        },
        zIndex: isSelectedDriver ? 1000 : undefined,
      });

      markersRef.current[item.id] = marker;

      const assignmentLine = isDriver
        ? `<p style="margin: 5px 0; font-size: 12px;"><strong>Passenger:</strong> ${item.currentPassengerName || '—'
        }</p>`
        : `<p style="margin: 5px 0; font-size: 12px;"><strong>Driver:</strong> ${item.currentDriverName || '—'
        }</p>`;
      const fareLine = item.currentTripFare
        ? `<p style="margin: 5px 0; font-size: 12px;"><strong>Fare:</strong> ฿${item.currentTripFare.estimatedFare}</p>`
        : '';

      // Create info window
      const infoContent = `
        <div style="padding: 12px; font-family: Arial; width: 280px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <img src="${item.avatar}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div>
              <h4 style="margin: 0; font-size: 14px; font-weight: 600;">${item.name}</h4>
              <p style="margin: 0; font-size: 11px; color: #6b7280;">${item.id}</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <p style="margin: 5px 0; font-size: 12px;"><strong>Status:</strong> ${item.status === 'on-trip' ? 'On Trip' : 'Idle'}</p>
            <p style="margin: 5px 0; font-size: 12px;"><strong>${isDriver ? 'Vehicle' : 'Location'}:</strong> ${isDriver ? item.vehicle : item.pickupLocation}</p>
            ${item.destination ? `<p style="margin: 5px 0; font-size: 12px;"><strong>Destination:</strong> ${item.destination}</p>` : ''}
            ${assignmentLine}
            ${fareLine}
            <p style="margin: 5px 0; font-size: 12px;"><strong>Phone:</strong> ${item.phone}</p>
          </div>
          <button onclick="window.handleMarkerClick('${item.id}')" style="width: 100%; margin-top: 10px; padding: 8px; background-color: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
            View Details
          </button>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener('click', () => {
        Object.values(infoWindowsRef.current).forEach(iw => iw.close());
        infoWindow.open(mapInstanceRef.current, marker);
      });

      infoWindowsRef.current[item.id] = infoWindow;

      if (isDriver && routeLinesRef.current[item.id]) {
        routeLinesRef.current[item.id].setMap(null);
        delete routeLinesRef.current[item.id];
      }

      const routeInfo = driverRoutes[item.id];

      const shouldShowRoute =
        isDriver &&
        item.status === 'on-trip' &&
        ((routeInfo && routeInfo.path && routeInfo.path.length > 1) ||
          (item.currentPassengerCoords &&
            item.currentPassengerCoords.lat &&
            item.currentPassengerCoords.lng));

      if (shouldShowRoute) {
        const path =
          routeInfo?.path?.length > 1
            ? routeInfo.path
            : [
              { lat: pos.lat, lng: pos.lng },
              { lat: item.currentPassengerCoords.lat, lng: item.currentPassengerCoords.lng },
            ];

        const currentOffset = routeAnimationOffsetsRef.current[item.id] || 0;

        const polyline = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#fbbf24',
          strokeOpacity: 0.7,
          strokeWeight: 4,
          map: mapInstanceRef.current,
          icons: [
            {
              icon: lineSymbol,
              offset: `${currentOffset}%`,
              repeat: '20px',
            },
          ],
        });

        routeLinesRef.current[item.id] = polyline;
        routeAnimationOffsetsRef.current[item.id] = currentOffset;
      }
    });

    // Remove markers not in current list
    Object.keys(markersRef.current).forEach(id => {
      if (!filteredList.find(item => item.id === id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });
    // Remove route lines for drivers not currently rendered or not on-trip
    Object.keys(routeLinesRef.current).forEach(id => {
      const driverInList = filteredList.find(
        item => item.id === id && item.id.startsWith('D') && item.status === 'on-trip'
      );
      if (!driverInList) {
        routeLinesRef.current[id].setMap(null);
        delete routeLinesRef.current[id];
        delete routeAnimationOffsetsRef.current[id];
      }
    });
  }, [filteredList, realtimePositions, mapReady, selectedItem, driverRoutes]);

  useEffect(() => {
    if (!mapReady) return;

    const interval = setInterval(() => {
      Object.entries(routeLinesRef.current).forEach(([id, polyline]) => {
        const nextOffset = ((routeAnimationOffsetsRef.current[id] || 0) + 2) % 100;
        routeAnimationOffsetsRef.current[id] = nextOffset;
        const icons = polyline.get('icons');
        if (icons && icons.length) {
          icons[0].offset = `${nextOffset}%`;
          polyline.set('icons', icons);
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, [mapReady]);

  // Handle marker click from info window
  useEffect(() => {
    window.handleMarkerClick = (itemId) => {
      const item = filteredList.find(i => i.id === itemId);
      if (item) setSelectedItem(item);
    };
  }, [filteredList]);

  useEffect(() => {
    if (!selectedItem || !selectedItem.id.startsWith('D')) return;
    if (!mapReady || !mapInstanceRef.current) return;

    const position =
      realtimePositions[selectedItem.id] || selectedItem.location || null;

    if (position) {
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(14);
    }
  }, [selectedItem, realtimePositions, mapReady]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        {['driver', 'onTrip', 'idle', 'passenger'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedItem(null);
            }}
            style={{
              flex: 1,
              padding: '15px 20px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === tab ? '#f59e0b' : '#6b7280',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid #f59e0b' : '3px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            {tab === 'driver' ? 'DRIVER' : tab === 'onTrip' ? 'ON-TRIP' : tab === 'idle' ? 'IDLE' : 'PASSENGER'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '350px',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          overflow: 'hidden',
        }}>
          {!selectedItem ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  {activeTab === 'passenger' ? 'PASSENGER LIST' : activeTab === 'onTrip' ? 'ON-TRIP DRIVER LIST' : activeTab === 'idle' ? 'IDLE DRIVER LIST' : 'DRIVER LIST'}
                </h3>
              </div>

              <div style={{ position: 'relative', padding: '15px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                <Search size={18} style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'passenger' ? 'Passenger' : 'Driver'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 35px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {filteredList.map((item, index) => (
                  <div
                    key={`${activeTab}-${item.id}`}
                    onClick={() => setSelectedItem(item)}
                    className="person-item animate-ontrip"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <img src={item.avatar} alt={item.name} className="avatar-image" style={{ width: '50px', height: '50px' }} />
                    <div className="person-info">
                      <div className="person-name">{item.name}</div>
                      <div className="person-meta">
                        {activeTab === 'passenger' ? item.pickupLocation : item.vehicle}
                      </div>
                    </div>
                    {(activeTab === 'driver' || activeTab === 'onTrip' || activeTab === 'idle') && item.status && (
                      <div className={`status-badge ${item.status}`}>
                        {item.status === 'on-trip' ? 'On Trip' : 'Idle'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="details-view">
              <div className="details-view-header">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="back-btn"
                >
                  ←
                </button>
                <h3>DETAILS</h3>
              </div>

              <div className="details-view-avatar">
                <div className="large-avatar">
                  <img src={selectedItem.avatar} alt={selectedItem.name} className="avatar-image-large" />
                </div>
                <h4 className="details-name">{selectedItem.name}</h4>
                <p className="details-id">{selectedItem.id}</p>
              </div>

              <div className="details-view-content">
                {activeTab === 'passenger' ? (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Booking Date:</span>
                      <span className="detail-value">{selectedItem.pickupDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{selectedItem.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedItem.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">License Type:</span>
                      <span className="detail-value">{selectedItem.licenseType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pickup Location:</span>
                      <span className="detail-value">{selectedItem.pickupLocation}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Destination:</span>
                      <span className="detail-value">{selectedItem.destination}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Current Driver:</span>
                      <span className="detail-value">{selectedItem.currentDriverName || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fare Estimate:</span>
                      <span className="detail-value">
                        {selectedItem.currentTripFare ? `฿${selectedItem.currentTripFare.estimatedFare}` : '—'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{selectedItem.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Vehicle:</span>
                      <span className="detail-value">{selectedItem.vehicle}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Plate Number:</span>
                      <span className="detail-value">{selectedItem.plateNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedItem.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">License Type:</span>
                      <span className="detail-value">{selectedItem.licenseType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-${selectedItem.status}`}>
                        {selectedItem.status === 'on-trip' ? 'On Trip' : 'Idle'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Current Passenger:</span>
                      <span className="detail-value">{selectedItem.currentPassengerName || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pickup:</span>
                      <span className="detail-value">{selectedItem.currentPassengerPickup || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Drop-off:</span>
                      <span className="detail-value">{selectedItem.currentPassengerDestination || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fare Estimate:</span>
                      <span className="detail-value">
                        {selectedItem.currentTripFare ? `฿${selectedItem.currentTripFare.estimatedFare}` : '—'}
                      </span>
                    </div>
                    {selectedItem.destination && (
                      <div className="detail-row">
                        <span className="detail-label">Destination:</span>
                        <span className="detail-value">{selectedItem.destination}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="livemap-map">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* Map Controls */}
          <div className="map-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search Location Here"
              value={mapLocationSearch}
              onChange={(e) => setMapLocationSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLocationSearch();
                }
              }}
              className="map-search-input"
            />
          </div>


          {/* Status Indicator */}
          <div className="map-status-legend">
            <div className="legend-item">
              <div className="legend-color on-trip"></div>
              <span>On Trip ({filteredList.filter(i => i.status === 'on-trip').length})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color idle"></div>
              <span>Idle ({filteredList.filter(i => i.status === 'idle').length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, statusColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f3f4f6' }}>
    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{label}:</span>
    <span style={{ fontSize: '13px', fontWeight: 600, color: statusColor || '#1f2937', textAlign: 'right' }}>{value}</span>
  </div>
);

export default LiveMap;