import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import LiveMap from '../../components/Admin/LiveMap';
import Settings from '../../components/Admin/Settings';
import Dashboard from '../../components/Admin/Dashboard';

const LiveMapPage = () => {
  const [activeMenu, setActiveMenu] = useState('live-map');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app">
      <Navbar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="main-content">
        <Header 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setActiveMenu={setActiveMenu}
        />
        <div className="content">
          {activeMenu === 'dashboard' && <Dashboard />}
          {activeMenu === 'live-map' && <LiveMap />}
          {activeMenu === 'settings' && <Settings />}
          {activeMenu !== 'dashboard' && activeMenu !== 'live-map' && activeMenu !== 'settings' && (
            <div className="placeholder">
              <h2>Coming Soon</h2>
              <p>This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMapPage;