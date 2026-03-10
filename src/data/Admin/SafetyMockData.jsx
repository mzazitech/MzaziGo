// data/safetyMockData.js

export const safetyStats = {
  totalIncidents: 5,
  driverIncidents: 3,
  passengerIncidents: 2,
  resolved: 2,
  pending: 3
};

export const safetyIncidents = [
  {
    id: 'INCIDENT-001',
    type: 'driver', // driver or passenger
    reportedBy: {
      id: 'D001',
      name: 'Somchai Jaidee',
      phone: '+66 81 234 5678',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Driver'
    },
    reportedDate: '20 November 2568',
    reportedTime: '14:37',
    incidentType: 'Sudden collision detected',
    location: {
      address: 'Highway 21, near Central Mall',
      coordinates: { lat: 13.7563, lng: 100.5018 }
    },
    tripId: 'TRIP-20985',
    status: 'pending', // pending, resolved, investigating
    severity: 'high', // low, medium, high, critical
    injuryStatus: 'Customer reported mild injury, ambulance dispatched',
    description: 'Driver reported sudden collision while on the way to pick up passenger. Emergency services have been notified.',
    responseTime: '2 mins',
    assignedTo: 'Safety Team A',
    notes: 'Emergency services contacted. Driver is safe but vehicle damaged.',
    attachments: [],
    timeline: [
      { time: '14:37', event: 'Incident detected automatically' },
      { time: '14:38', event: 'Driver confirmed emergency' },
      { time: '14:39', event: 'Emergency services contacted' }
    ]
  },
  {
    id: 'INCIDENT-002',
    type: 'passenger',
    reportedBy: {
      id: 'P001',
      name: 'Gojo Satoru',
      phone: '+66 91 234 5678',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Passenger'
    },
    relatedDriver: {
      id: 'D002',
      name: 'Pornthip Saengfang',
      phone: '+66 82 345 6789',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    reportedDate: '21 November 2568',
    reportedTime: '09:15',
    incidentType: 'Passenger safety concern',
    location: {
      address: 'Sukhumvit Road, Soi 11, Bangkok',
      coordinates: { lat: 13.7468, lng: 100.5326 }
    },
    tripId: 'TRIP-21034',
    status: 'investigating',
    severity: 'medium',
    injuryStatus: 'No injuries reported',
    description: 'Passenger reported feeling unsafe during the trip. Driver behavior under review.',
    responseTime: '5 mins',
    assignedTo: 'Safety Team B',
    notes: 'Investigating driver conduct. Passenger has been contacted and assured of safety measures.',
    attachments: [],
    timeline: [
      { time: '09:15', event: 'Incident reported by passenger' },
      { time: '09:17', event: 'Safety team notified' },
      { time: '09:20', event: 'Investigation initiated' }
    ]
  },
  {
    id: 'INCIDENT-003',
    type: 'driver',
    reportedBy: {
      id: 'D003',
      name: 'Wanchai Pattana',
      phone: '+66 83 456 7890',
      avatar: 'https://i.pravatar.cc/150?img=33',
      role: 'Driver'
    },
    reportedDate: '21 November 2568',
    reportedTime: '16:45',
    incidentType: 'Vehicle breakdown',
    location: {
      address: 'Expressway, near Don Mueang Airport',
      coordinates: { lat: 13.7650, lng: 100.5380 }
    },
    tripId: 'TRIP-21089',
    status: 'resolved',
    severity: 'low',
    injuryStatus: 'No injuries',
    description: 'Vehicle experienced engine failure on expressway. Driver safely pulled over.',
    responseTime: '3 mins',
    assignedTo: 'Roadside Assistance',
    notes: 'Tow truck dispatched. Passenger transferred to another vehicle. Resolved.',
    attachments: [],
    timeline: [
      { time: '16:45', event: 'Breakdown reported' },
      { time: '16:48', event: 'Tow truck dispatched' },
      { time: '17:15', event: 'Vehicle towed, passenger transferred' },
      { time: '17:30', event: 'Incident resolved' }
    ]
  },
  {
    id: 'INCIDENT-004',
    type: 'passenger',
    reportedBy: {
      id: 'P004',
      name: 'Luffy Nami',
      phone: '+66 94 567 8901',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Passenger'
    },
    relatedDriver: {
      id: 'D004',
      name: 'Kiattisak Phothanut',
      phone: '+66 84 567 8901',
      avatar: 'https://i.pravatar.cc/150?img=52'
    },
    reportedDate: '22 November 2568',
    reportedTime: '11:20',
    incidentType: 'Medical emergency',
    location: {
      address: 'Rama IX Road, near RCA',
      coordinates: { lat: 13.7367, lng: 100.5608 }
    },
    tripId: 'TRIP-21156',
    status: 'resolved',
    severity: 'high',
    injuryStatus: 'Passenger required medical attention',
    description: 'Passenger experienced medical emergency during trip. Driver immediately contacted emergency services.',
    responseTime: '1 min',
    assignedTo: 'Emergency Response Team',
    notes: 'Ambulance arrived promptly. Passenger received medical care. Family contacted.',
    attachments: [],
    timeline: [
      { time: '11:20', event: 'Medical emergency reported' },
      { time: '11:21', event: 'Emergency services contacted' },
      { time: '11:28', event: 'Ambulance arrived' },
      { time: '11:35', event: 'Passenger transported to hospital' },
      { time: '12:00', event: 'Family notified, incident closed' }
    ]
  },
  {
    id: 'INCIDENT-005',
    type: 'driver',
    reportedBy: {
      id: 'D005',
      name: 'Narong Suksai',
      phone: '+66 85 678 9012',
      avatar: 'https://i.pravatar.cc/150?img=61',
      role: 'Driver'
    },
    reportedDate: '22 November 2568',
    reportedTime: '18:30',
    incidentType: 'Aggressive passenger behavior',
    location: {
      address: 'Silom Road, near BTS Sala Daeng',
      coordinates: { lat: 13.7278, lng: 100.5240 }
    },
    tripId: 'TRIP-21203',
    status: 'pending',
    severity: 'medium',
    injuryStatus: 'Driver reported verbal threats',
    description: 'Driver reported aggressive and threatening behavior from passenger. Trip terminated for safety.',
    responseTime: '4 mins',
    assignedTo: 'Safety Team A',
    notes: 'Investigating passenger account. Driver has been provided support. Passenger account under review.',
    attachments: [],
    timeline: [
      { time: '18:30', event: 'Incident reported by driver' },
      { time: '18:34', event: 'Trip terminated' },
      { time: '18:40', event: 'Investigation initiated' }
    ]
  }
];

export const incidentTypeOptions = [
  { value: 'all', label: 'All Incidents' },
  { value: 'Sudden collision detected', label: 'Collision' },
  { value: 'Passenger safety concern', label: 'Safety Concern' },
  { value: 'Vehicle breakdown', label: 'Vehicle Issue' },
  { value: 'Medical emergency', label: 'Medical Emergency' },
  { value: 'Aggressive passenger behavior', label: 'Aggressive Behavior' }
];

export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' }
];

export const severityOptions = [
  { value: 'all', label: 'All Severity' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

// Map markers for incidents - กระจายตัวในพื้นที่กว้าง
export const incidentMapMarkers = [
  {
    id: 'INCIDENT-001',
    type: 'driver',
    name: 'Somchai Jaidee',
    location: { lat: 13.8878, lng: 100.6210 }, // Don Mueang Airport area
    address: 'Highway 21, near Central Mall',
    severity: 'high',
    status: 'pending',
    incidentType: 'Sudden collision detected',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'INCIDENT-002',
    type: 'passenger',
    name: 'Gojo Satoru',
    driver: 'Pornthip Saengfang',
    location: { lat: 13.7563, lng: 100.5018 }, // Central Bangkok
    address: 'Sukhumvit Road, Soi 11, Bangkok',
    severity: 'medium',
    status: 'investigating',
    incidentType: 'Passenger safety concern',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'INCIDENT-003',
    type: 'driver',
    name: 'Wanchai Pattana',
    location: { lat: 13.6897, lng: 100.7501 }, // East Bangkok - Bearing
    address: 'Expressway, near Don Mueang Airport',
    severity: 'low',
    status: 'resolved',
    incidentType: 'Vehicle breakdown',
    avatar: 'https://i.pravatar.cc/150?img=33'
  },
  {
    id: 'INCIDENT-004',
    type: 'passenger',
    name: 'Luffy Nami',
    driver: 'Kiattisak Phothanut',
    location: { lat: 13.7245, lng: 100.4930 }, // West Bangkok - Thonburi
    address: 'Rama IX Road, near RCA',
    severity: 'high',
    status: 'resolved',
    incidentType: 'Medical emergency',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 'INCIDENT-005',
    type: 'driver',
    name: 'Narong Suksai',
    location: { lat: 13.8264, lng: 100.5665 }, // North Bangkok - Chatuchak
    address: 'Silom Road, near BTS Sala Daeng',
    severity: 'medium',
    status: 'pending',
    incidentType: 'Aggressive passenger behavior',
    avatar: 'https://i.pravatar.cc/150?img=61'
  }
];