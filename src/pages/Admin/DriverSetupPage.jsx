import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import DriverList from '../../components/Admin/DriverList';
import Dashboard from '../../components/Admin/Dashboard';
import Settings from '../../components/Admin/Settings';

const DriverSetupPage = () => {
  const [activeMenu, setActiveMenu] = useState('driver-list');
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
          {activeMenu === 'driver-list' && <DriverList />}
          {activeMenu === 'settings' && <Settings />}
          {activeMenu !== 'dashboard' && activeMenu !== 'driver-list' && activeMenu !== 'settings' && (
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

export default DriverSetupPage;