import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './output.css';

// --- User Imports ---
import LandingPage from './pages/User/LandingPage';
import Login from './pages/User/LoginPage/Login';
import Earn from "./pages/User/Earn";
import Profile from "./pages/User/Passenger/Profile";
import About from "./pages/User/About";
import Help from "./components/User/Passenger/Help";
import Notification from "./components/User/Passenger/Notification";
import RideFlow from "./components/User/Passenger/RideFlow";
import Profileinformation from "./pages/User/Passenger/Profileinformation";
import Coupon from "./pages/User/Passenger/Coupon";
import Security from "./pages/User/Security";
import History from "./pages/User/Passenger/History";
import Previous from "./components/User/Passenger/Previous";

// --- Admin Imports ---
import AdminLogin from './pages/Admin/AdminLogin';
import DashboardPage from './pages/Admin/DashboardPage';
import LiveMapPage from './pages/Admin/LiveMapPage';
import DriverSetupPage from './pages/Admin/DriverSetupPage';
import AddDriverPage from './pages/Admin/AddDriverPage';
import EditDriverPage from './pages/Admin/EditDriverPage';
import IdentityRequestPage from './pages/Admin/IdentityRequestPage';
import PassengerListPage from './pages/Admin/PassengerListPage';
import AddPassengerPage from './pages/Admin/AddPassengerPage';
import EditPassengerPage from './pages/Admin/EditPassengerPage';
import FareSetupPage from './pages/Admin/FareSetupPage';
import CouponSetupPage from './pages/Admin/CouponSetupPage';
import TransactionPage from './pages/Admin/TransactionPage';
import SafetyOverviewPage from './pages/Admin/SafetyOverviewPage';
import ChattingPage from './pages/Admin/ChattingPage';
import SettingsPage from './pages/Admin/SettingsPage';

function App() {
  // State for Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* ==============================
            Admin Routes (Prefix: /admin)
           ============================== */}

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            isAdminLoggedIn ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin setIsLoggedIn={setIsAdminLoggedIn} />
          }
        />

        {/* Protected Admin Routes */}
        {isAdminLoggedIn ? (
          <>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/live-map" element={<LiveMapPage />} />

            {/* Driver Management */}
            <Route path="/admin/driver-list" element={<DriverSetupPage />} />
            <Route path="/admin/add-driver" element={<AddDriverPage />} />
            <Route path="/admin/edit-driver" element={<EditDriverPage />} />
            <Route path="/admin/identity-request" element={<IdentityRequestPage />} />

            {/* Passenger Management */}
            <Route path="/admin/passenger-list" element={<PassengerListPage />} />
            <Route path="/admin/add-passenger" element={<AddPassengerPage />} />
            <Route path="/admin/edit-passenger" element={<EditPassengerPage />} />

            {/* System Setup */}
            <Route path="/admin/fare-setup" element={<FareSetupPage />} />
            <Route path="/admin/coupon-setup" element={<CouponSetupPage />} />

            {/* Other Admin Pages */}
            <Route path="/admin/transaction" element={<TransactionPage />} />
            <Route path="/admin/safety-overview" element={<SafetyOverviewPage />} />
            <Route path="/admin/chatting" element={<ChattingPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />

            {/* Admin Catch-all: Redirect to Dashboard */}
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          </>
        ) : (
          /* Redirect unauthenticated admin access to Admin Login */
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
        )}


        {/* ==============================
            User / Passenger Routes
           ============================== */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Main User Features */}
        <Route path="/ride" element={<RideFlow />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profileinformation" element={<Profileinformation />} />
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/security" element={<Security />} />
        <Route path="/history" element={<History />} />
        <Route path="/previous" element={<Previous />} />
        <Route path="/notifications" element={<Notification />} />

        {/* Global Catch-all: Redirect to Landing Page (or Login) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;