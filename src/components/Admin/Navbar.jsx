import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeMenu, setActiveMenu, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const defaultAdminInfo = {
    username: 'ThunderAdmin',
    fullName: 'Thunder Ride Administrator',
    email: 'Thunder@admin.com',
    avatar: 'https://i.pravatar.cc/200?img=32'
  };

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', route: '/admin/dashboard' },
    { id: 'live-map', label: 'LIVE MAP', route: '/admin/live-map' },
    {
      id: 'driver-setup', label: 'DRIVER SETUP', submenu: [
        { id: 'driver-list', label: 'DRIVER LIST', route: '/admin/driver-list' },
        { id: 'add-new-driver', label: 'ADD NEW DRIVER', route: '/admin/add-driver' },
        { id: 'identity-request', label: 'IDENTITY REQUEST', route: '/admin/identity-request' },
      ]
    },
    {
      id: 'passenger-setup', label: 'PASSENGER SETUP', submenu: [
        { id: 'passenger-list', label: 'PASSENGER LIST', route: '/admin/passenger-list' },
        { id: 'add-passenger', label: 'ADD PASSENGER', route: '/admin/add-passenger' }
      ]
    },
    {
      id: 'transactions', label: 'TRANSACTIONS MANAGEMENT', submenu: [
        { id: 'fare-setup', label: 'FARE SETUP', route: '/admin/fare-setup' },
        { id: 'transactions', label: 'TRANSACTIONS', route: '/admin/transaction' }
      ]
    },
    {
      id: 'promotion', label: 'PROMOTION MANAGEMENT', submenu: [
        { id: 'coupon-setup', label: 'COUPON SETUP', route: '/admin/coupon-setup' },
      ]
    },
    {
      id: 'safety', label: 'SAFETY MANAGEMENT', submenu: [
        { id: 'safety-overview', label: 'SAFETY OVERVIEW', route: '/admin/safety-overview' },
        { id: 'chatting', label: 'CHATTING', route: '/admin/chatting' }
      ]
    }
  ];

  const [expandedMenus, setExpandedMenus] = useState(['dashboard', 'driver-setup', 'passenger-setup', 'transactions', 'promotion', 'safety']);
  const [adminInfo, setAdminInfo] = useState(defaultAdminInfo);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const adminPanelRef = useRef(null);

  useEffect(() => {
    const loadAdminProfile = () => {
      const storedProfile = localStorage.getItem('adminProfile');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          const usernameFromEmail = parsedProfile.email?.split('@')[0];
          const fullNameFromParts = [parsedProfile.firstName, parsedProfile.lastName]
            .filter(Boolean)
            .join(' ')
            .trim();
          setAdminInfo({
            ...defaultAdminInfo,
            ...parsedProfile,
            username: parsedProfile.username || usernameFromEmail || defaultAdminInfo.username,
            fullName: parsedProfile.fullName || fullNameFromParts || defaultAdminInfo.fullName,
            email: parsedProfile.email || defaultAdminInfo.email,
            avatar: parsedProfile.avatar || defaultAdminInfo.avatar
          });
          return;
        } catch (error) {
          console.error('Failed to parse admin profile', error);
        }
      }

      const storedEmail = localStorage.getItem('adminEmail');
      if (storedEmail) {
        setAdminInfo(prev => ({
          ...prev,
          email: storedEmail,
          username: storedEmail.split('@')[0]
        }));
      }
    };

    loadAdminProfile();
    window.__forceAdminReload = loadAdminProfile;
    window.addEventListener('adminProfileUpdated', loadAdminProfile);
    return () => {
      window.removeEventListener('adminProfileUpdated', loadAdminProfile);
      if (window.__forceAdminReload === loadAdminProfile) {
        delete window.__forceAdminReload;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminPanelRef.current && !adminPanelRef.current.contains(event.target)) {
        setShowAdminPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAdminClick = () => {
    setShowAdminPanel(prev => !prev);
  };

  const handleMenuClick = (item) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else {
      setActiveMenu(item.id);
      if (item.route) {
        navigate(item.route);
      }
      // Close mobile menu after navigation
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleSubmenuClick = (sub) => {
    setActiveMenu(sub.id);
    if (sub.route) {
      navigate(sub.route);
    }
    // Close mobile menu after navigation
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="logo">
        <span className="logo-thunder">THUNDER</span>
        <span className="logo-ride"> RIDE</span>
      </div>

      <div className="nav-admin-wrapper" ref={adminPanelRef}>
        <button
          className={`nav-email ${showAdminPanel ? 'open' : ''}`}
          onClick={handleAdminClick}
          type="button"
        >
          <img
            src={adminInfo.avatar || defaultAdminInfo.avatar}
            alt="Admin avatar"
            className="nav-admin-avatar"
          />
          <div className="nav-admin-text">
            <span className="admin-label">Administrator</span>
            <span className="admin-username">@{adminInfo.username}</span>
          </div>
        </button>
        <div className={`admin-slideout ${showAdminPanel ? 'visible' : ''}`}>
          <div className="admin-slideout-header">
            <img src={adminInfo.avatar || defaultAdminInfo.avatar} alt="Admin avatar" />
            <div>
              <p className="admin-detail-name">{adminInfo.fullName}</p>
              <span className="admin-detail-role">Platform Administrator</span>
            </div>
          </div>
          <div className="admin-slideout-row">
            <span>Email</span>
            <span>{adminInfo.email}</span>
          </div>
          <div className="admin-slideout-row">
            <span>Username</span>
            <span>@{adminInfo.username}</span>
          </div>
          <div className="admin-slideout-row">
            <span>Contact</span>
            <span>{adminInfo.phoneNumber || '+66 02 123 4567'}</span>
          </div>
          <div className="admin-slideout-row">
            <span>Gender</span>
            <span>{adminInfo.gender || 'N/A'}</span>
          </div>
          <div className="admin-slideout-row">
            <span>Date of Birth</span>
            <span>{adminInfo.dateOfBirth || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search Here"
        />
      </div>

      <nav className="nav-menu">
        {menuItems.map(item => (
          <div key={item.id}>
            <div
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span>{item.label}</span>
              {item.submenu && <span className="arrow">{expandedMenus.includes(item.id) ? '▼' : '▶'}</span>}
            </div>
            {item.submenu && expandedMenus.includes(item.id) && (
              <div className="submenu">
                {item.submenu.map(sub => (
                  <div
                    key={sub.id}
                    className={`submenu-item ${activeMenu === sub.id ? 'active' : ''}`}
                    onClick={() => handleSubmenuClick(sub)}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;