import React from "react";
import AppFooter from '../../components/AppFooter';
import AppHeader from '../../components/AppHeader';
import AppNavbar from '../../components/AppNavbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const ProfilePage = () => <h2>Welcome to your Profile!</h2>;
const MenuPage = () => <h2>This is the Menu page</h2>;
const HomePage = () => <h2>Home Page</h2>;

const Login_passenger = () => {
    return(
        
    <div>
      <AppHeader />
      <AppNavbar />

      <main>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/menu" element={<MenuPage />} /> */}
        </Routes>
      </main>

      <AppFooter />
    </div>
    
    )
}

export default Login_passenger
