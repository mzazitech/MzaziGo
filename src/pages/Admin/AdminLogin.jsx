import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import taxiImg from "../../assets/nyc-yellow-taxi-in-times-square-hero.webp";
import "../../styles/Admin/Login.css";

export default function AdminLogin({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  {/* เซทรหัสผ่านไว้ */ }
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "Thunder@admin.com" && password === "Thunder888") {
      const username = email.split("@")[0];
      const adminProfile = {
        firstName: "Thunder",
        lastName: "Admin",
        email,
        phoneNumber: "+66 02 123 4567",
        dateOfBirth: "01/01/1990",
        gender: "other",
        username,
        password: "",
        confirmPassword: ""
      };

      localStorage.setItem("adminEmail", email);
      localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
      setIsLoggedIn(true);
      navigate("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };


  {/* พื้นที่ลอคอิน */ }
  {/* ภาพ taxi */ }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-img">
          <img src={taxiImg} alt="Taxi" />
        </div>

        {/* app name */}
        <div className="login-form">
          <div className="login-title">
            <h1><span>THUNDER</span> RIDE</h1>
            <p className="login-subtitle">Login with Email</p>
          </div>
          {/* ใส่เมลจ้า */}
          <div className="input-box">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>EMAIL</label>
          </div>
          {/* ใส่รหัสจ้า */}
          <div className="input-box password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>PASSWORD</label>
            {/* ดูรหัสผ่าน */}
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁‍🗨" : "👁"}
            </span>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot your password?</a>
          </div>

          <button className="login-button" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
