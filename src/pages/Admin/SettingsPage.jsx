import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import Settings from '../../components/Admin/Settings';

const SettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('settings');
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
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

