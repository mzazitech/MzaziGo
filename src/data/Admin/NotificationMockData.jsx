// data/NotificationMockData.jsx

import { safetyIncidents } from './SafetyMockData';

// Generate notifications from safety incidents
export const notificationData = [
    // Critical/High severity incidents - unresolved
    {
        id: 'notif-001',
        type: 'safety',
        severity: 'high',
        title: '🚨 High Severity Incident Detected',
        message: `Sudden collision detected at Highway 21, near Central Mall. Driver: Somchai Jaidee. Immediate attention required.`,
        timestamp: '14:37 • Today',
        isRead: false,
        link: '/safety-overview',
        incidentId: 'INCIDENT-001'
    },
    {
        id: 'notif-002',
        type: 'safety',
        severity: 'medium',
        title: '⚠️ Safety Concern Reported',
        message: `Passenger safety concern on Sukhumvit Road, Soi 11. Reported by Gojo Satoru. Investigation ongoing.`,
        timestamp: '09:15 • Today',
        isRead: false,
        link: '/safety-overview',
        incidentId: 'INCIDENT-002'
    },
    {
        id: 'notif-003',
        type: 'safety',
        severity: 'medium',
        title: '⚠️ Aggressive Behavior Incident',
        message: `Driver Narong Suksai reported aggressive passenger behavior on Silom Road. Trip terminated for safety.`,
        timestamp: '18:30 • Yesterday',
        isRead: false,
        link: '/safety-overview',
        incidentId: 'INCIDENT-005'
    },
    {
        id: 'notif-004',
        type: 'identity',
        severity: 'normal',
        title: '📄 New Driver Verification Request',
        message: `3 new driver verification requests pending review. Please verify documents.`,
        timestamp: '10:00 • Today',
        isRead: false,
        link: '/identity-request'
    },
    {
        id: 'notif-005',
        type: 'chat',
        severity: 'normal',
        title: '💬 New Messages',
        message: `You have 5 unread messages from drivers. Latest from Alex Johnson.`,
        timestamp: '16:20 • Today',
        isRead: false,
        link: '/chatting'
    },
    {
        id: 'notif-006',
        type: 'safety',
        severity: 'success',
        title: '✅ Medical Emergency Resolved',
        message: `Medical emergency incident at Rama IX Road resolved. Passenger received medical attention and family notified.`,
        timestamp: '12:00 • Today',
        isRead: true,
        link: '/safety-overview',
        incidentId: 'INCIDENT-004'
    },
    {
        id: 'notif-007',
        type: 'safety',
        severity: 'low',
        title: '✅ Vehicle Breakdown Resolved',
        message: `Vehicle breakdown on Expressway near Don Mueang Airport has been resolved. Passenger transferred.`,
        timestamp: '17:30 • Yesterday',
        isRead: true,
        link: '/safety-overview',
        incidentId: 'INCIDENT-003'
    }
];

// Helper functions
export const getUnreadCount = () => {
    return notificationData.filter(n => !n.isRead).length;
};

export const getNotificationsByType = (type) => {
    return notificationData.filter(n => n.type === type);
};

export const getSafetyNotifications = () => {
    return notificationData.filter(n => n.type === 'safety');
};

export const getUnreadSafetyCount = () => {
    return notificationData.filter(n => n.type === 'safety' && !n.isRead).length;
};

export const getUnreadIdentityCount = () => {
    return notificationData.filter(n => n.type === 'identity' && !n.isRead).length;
};

export const getUnreadChatCount = () => {
    return notificationData.filter(n => n.type === 'chat' && !n.isRead).length;
};

export const markAsRead = (notificationId) => {
    const notification = notificationData.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
    }
};

export const markAllAsRead = () => {
    notificationData.forEach(n => {
        n.isRead = true;
    });
};
