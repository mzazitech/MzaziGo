import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import AddDriver from '../../components/Admin/AddDriver';
import Dashboard from '../../components/Admin/Dashboard';
import Settings from '../../components/Admin/Settings';

const AddDriverPage = () => {
  const [activeMenu, setActiveMenu] = useState('add-new-driver');
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
          {activeMenu === 'add-new-driver' && <AddDriver />}
          {activeMenu === 'settings' && <Settings />}
          {activeMenu !== 'dashboard' && activeMenu !== 'add-new-driver' && activeMenu !== 'settings' && (
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

export default AddDriverPage;