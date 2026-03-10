/**
 * Notification Manager Utility
 * จัดการการสร้างและเก็บ notifications ใน localStorage
 */

const NOTIFICATION_STORAGE_KEY = 'rideNotifications';

/**
 * สร้าง notification ใหม่
 * @param {Object} notificationData - ข้อมูล notification
 * @param {string} notificationData.name - ชื่อคนขับ
 * @param {string} notificationData.status - สถานะ (Arrived, Almost there, Cancel, Message)
 * @param {string} notificationData.detail - รายละเอียด
 * @param {string} notificationData.type - ประเภท (arrival, message, cancel)
 */
export function createNotification(notificationData) {
    const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: notificationData.name || "Unknown",
        status: notificationData.status || "Message",
        statusColor: getStatusColor(notificationData.status),
        statusBg: getStatusBg(notificationData.status),
        detail: notificationData.detail || "",
        type: notificationData.type || "message",
        read: false
    };

    // โหลด notifications ที่มีอยู่
    const existingNotifications = getNotifications();
    
    // เพิ่ม notification ใหม่ที่ด้านบน
    const updatedNotifications = [notification, ...existingNotifications];
    
    // เก็บไว้ใน localStorage (จำกัดไว้ 50 รายการล่าสุด)
    const limitedNotifications = updatedNotifications.slice(0, 50);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(limitedNotifications));
    
    // Dispatch event เพื่อแจ้งให้ Notification.jsx อัปเดต
    window.dispatchEvent(new CustomEvent('notificationAdded'));
    
    return notification;
}

/**
 * ดึง notifications ทั้งหมด
 */
export function getNotifications() {
    try {
        const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading notifications:', error);
        return [];
    }
}

/**
 * ทำเครื่องหมาย notification ว่าอ่านแล้ว
 */
export function markAsRead(notificationId) {
    const notifications = getNotifications();
    const updated = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
    );
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
}

/**
 * ลบ notification
 */
export function deleteNotification(notificationId) {
    const notifications = getNotifications();
    const filtered = notifications.filter(notif => notif.id !== notificationId);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
}

/**
 * ลบ notifications ทั้งหมด
 */
export function clearAllNotifications() {
    localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
}

/**
 * จำนวน notifications ที่ยังไม่อ่าน
 */
export function getUnreadCount() {
    const notifications = getNotifications();
    return notifications.filter(notif => !notif.read).length;
}

/**
 * กำหนดสีตามสถานะ
 */
function getStatusColor(status) {
    const statusColors = {
        'Arrived': '#21AE5B',
        'Almost there': '#D88F22',
        'Cancel': '#D86222',
        'Message': '#ECBD35'
    };
    return statusColors[status] || '#5D5C5D';
}

/**
 * กำหนดสีพื้นหลังตามสถานะ
 */
function getStatusBg(status) {
    const statusBgs = {
        'Arrived': '#D3F1E0',
        'Almost there': '#F8EBCC',
        'Cancel': '#F8D3CC',
        'Message': '#FFF3C4'
    };
    return statusBgs[status] || '#E5E5E5';
}

