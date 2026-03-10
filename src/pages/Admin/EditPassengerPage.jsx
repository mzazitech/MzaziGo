import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Admin/Navbar';
import Header from '../../components/Admin/Header';
import EditPassenger from '../../components/Admin/EditPassenger';
import Dashboard from '../../components/Admin/Dashboard';
import Settings from '../../components/Admin/Settings';

const EditPassengerPage = () => {
  const [activeMenu, setActiveMenu] = useState('edit-passenger');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const passengerData = location.state?.passenger;

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
          {activeMenu === 'edit-passenger' && <EditPassenger passenger={passengerData} />}
          {activeMenu === 'settings' && <Settings />}
          {activeMenu !== 'dashboard' && activeMenu !== 'edit-passenger' && activeMenu !== 'settings' && (
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

export default EditPassengerPage;