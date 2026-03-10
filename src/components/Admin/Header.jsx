import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationData, getUnreadCount, markAsRead, markAllAsRead } from '../../data/Admin/NotificationMockData';
import '../../styles/Admin/Notification.css';

const Header = ({ setIsMobileMenuOpen, setActiveMenu }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminAvatar, setAdminAvatar] = useState('https://i.pravatar.cc/200?img=32');
  const [notifications, setNotifications] = useState(notificationData);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const loadAvatar = () => {
      const storedProfile = localStorage.getItem('adminProfile');
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          setAdminAvatar(parsed.avatar || 'https://i.pravatar.cc/200?img=32');
        } catch (error) {
          console.error('Failed to parse admin profile for header', error);
        }
      }
    };

    loadAvatar();
    window.addEventListener('adminProfileUpdated', loadAvatar);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('adminProfileUpdated', loadAvatar);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/admin/login';
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setNotifications([...notificationData]);
    setShowNotifications(false);
    if (notification.link) {
      navigate(`/admin/${notification.link}`); // Possible Bug
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    setNotifications([...notificationData]);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      case 'success': return '✅';
      default: return '🔔';
    }
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="header">
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(prev => !prev)}>
        <Menu size={24} />
      </button>
      <div className="header-right">
        <div className="notification-wrapper" ref={notificationRef}>
          <div
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ cursor: 'pointer' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="mark-all-read-btn">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="notification-icon-badge">
                        {getSeverityIcon(notif.severity)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notif.title}</div>
                        <div className="notification-message">{notif.message}</div>
                        <div className="notification-time">{notif.timestamp}</div>
                      </div>
                      {!notif.isRead && <div className="unread-dot"></div>}
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-menu-wrapper" ref={menuRef}>
          <div
            className="profile-icon"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img src={adminAvatar} alt="Admin avatar" />
          </div>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div
                className="profile-menu-item"
                onClick={() => {
                  setActiveMenu('settings');
                  setShowProfileMenu(false);
                }}
              >
                Settings
              </div>
              <div
                className="profile-menu-item"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;