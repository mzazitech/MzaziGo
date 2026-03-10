// pages/SafetyOverviewPage.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import SafetyOverview from '../../components/Admin/SafetyOverview';
import Dashboard from '../../components/Admin/Dashboard';
import Settings from '../../components/Admin/Settings';

const SafetyOverviewPage = () => {
  const [activeMenu, setActiveMenu] = useState('safety-overview');
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
          {activeMenu === 'safety-overview' && <SafetyOverview />}
          {activeMenu === 'settings' && <Settings />}
          {activeMenu !== 'dashboard' && activeMenu !== 'safety-overview' && activeMenu !== 'settings' && (
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

export default SafetyOverviewPage;