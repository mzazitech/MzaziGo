import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, TextField, Radio, FormControlLabel, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import AppleIcon from '@mui/icons-material/Apple';
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ตรวจสอบ login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setShowLoginModal(true);
      }
    };

    checkLoginStatus();

    // ฟัง event เมื่อ login status เปลี่ยน
    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleLoginStatusChange);
    window.addEventListener('loginStatusChanged', handleLoginStatusChange);

    return () => {
      window.removeEventListener('storage', handleLoginStatusChange);
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  useEffect(() => {
    // โหลดข้อมูล profile เฉพาะเมื่อ login แล้ว
    if (isLoggedIn) {
      const savedData = localStorage.getItem("profileData");
      if (savedData) {
        const { name, phone, email, gender, otherGender } = JSON.parse(savedData);
        setName(name || "");
        setPhone(phone || "");
        setEmail(email || "");
        setGender(gender || "");
        setOtherGender(otherGender || "");
      } else {
        setName("John Doe");
        setPhone("000-000-0000");
        setEmail("xxx@gmail.com");
        setGender("");
        setOtherGender("");
      }
    }
  }, [isLoggedIn]);

  const handleSave = () => {
    const data = { name, phone, email, gender, otherGender };
    localStorage.setItem("profileData", JSON.stringify(data));
    alert("Saved successfully!");
    navigate(-1);
  };

  const handleLogout = () => {
    // Remove login status from localStorage
    localStorage.removeItem('isLoggedIn');
    
    // Dispatch custom event to notify other components (e.g., AppHeader)
    window.dispatchEvent(new Event('loginStatusChanged'));
    
    // Navigate to landing page
    navigate('/');
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#F7F7F7", minHeight: "100vh", position: "relative" }}>
      {/* Login Required Modal */}
      {showLoginModal && (
        <Box 
          sx={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            bgcolor: "rgba(0,0,0,0.7)", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            zIndex: 10001,
            backdropFilter: "blur(4px)"
          }}
        >
          <Box 
            sx={{ 
              backgroundColor: "white", 
              borderRadius: 3, 
              p: 4, 
              width: "90%", 
              maxWidth: 400, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
            }}
          >
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: "50%", 
                bgcolor: "#FFF3C4", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                mb: 1
              }}
            >
              <PersonIcon sx={{ fontSize: 50, color: "#ECBD35" }} />
            </Box>
            <Typography sx={{ fontSize: 24, fontWeight: "bold", color: "#000", textAlign: "center" }}>
              ต้องเข้าสู่ระบบ
            </Typography>
            <Typography sx={{ fontSize: 16, color: "#666", textAlign: "center", mt: 1 }}>
              กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์
            </Typography>
            <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
              <Button 
                fullWidth 
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  borderColor: "#ddd",
                  color: "#666",
                  fontWeight: "bold",
                  py: 1.5,
                  "&:hover": { 
                    borderColor: "#bbb",
                    bgcolor: "#f5f5f5"
                  }
                }}
              >
                ยกเลิก
              </Button>
              <Button 
                fullWidth 
                variant="contained"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                sx={{ 
                  bgcolor: "#ECBD35", 
                  color: "#000", 
                  fontWeight: "bold",
                  py: 1.5,
                  "&:hover": { 
                    bgcolor: "#d3a32e" 
                  }
                }}
              >
                เข้าสู่ระบบ
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Overlay ที่ block การใช้งานเมื่อยังไม่ได้ login */}
      {!isLoggedIn && (
        <Box 
          sx={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            bgcolor: "rgba(0,0,0,0.3)", 
            zIndex: 10000,
            pointerEvents: "auto"
          }} 
        />
      )}

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 40,
            height: 40,
            border: "1.5px solid #D3D3D3",
            "&:hover": { backgroundColor: "#f0f0f0" },
            mr: 2,
            color: "black",
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Typography sx={{ fontWeight: "bold", fontSize: 22, flexGrow: 1 }}>Profile Information</Typography>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: "#ECBD35", color: "#fff", "&:hover": { bgcolor: "#d6a92f" } }}
        >
          Save
        </Button>
      </Box>

      {/* Profile Image */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Box
          component="img"
          src="/images/profile3.png"
          alt="profile"
          sx={{ width: 105, height: 100, borderRadius: "40%", mx: "auto" }}
        />
      </Box>

      {/* Name */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Name</Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
        inputProps={{ style: { height: 15 } }}
      />

      {/* Phone Number */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Phone Number</Typography>
      <TextField
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        variant="outlined"
        sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
        inputProps={{ style: { height: 15 } }}
      />

      {/* Email Address */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Email Address</Typography>
      <TextField
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        sx={{ mb: 2, bgcolor: "#fff", borderRadius: 2 }}
        inputProps={{ style: { height: 15 } }}
      />

      {/* Gender */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Gender</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        {/* Male */}
        <FormControlLabel
          control={
            <Radio
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
              icon={<RadioButtonUncheckedIcon sx={{ color: "#ccc", fontSize: 20 }} />}
              checkedIcon={<RadioButtonCheckedIcon sx={{ color: "#ECBD35", fontSize: 20 }} />}
            />
          }
          label="Male"
        />
        {/* Female */}
        <FormControlLabel
          control={
            <Radio
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
              icon={<RadioButtonUncheckedIcon sx={{ color: "#ccc", fontSize: 20 }} />}
              checkedIcon={<RadioButtonCheckedIcon sx={{ color: "#ECBD35", fontSize: 20 }} />}
            />
          }
          label="Female"
        />
        {/* Other + input */}
        <Box sx={{ display: "flex", alignItems: "center", p: 1, minWidth: 200 }}>
          <Radio
            checked={gender === "Other"}
            onChange={() => setGender("Other")}
            icon={<RadioButtonUncheckedIcon sx={{ color: "#ccc", fontSize: 20 }} />}
            checkedIcon={<RadioButtonCheckedIcon sx={{ color: "#ECBD35", fontSize: 20 }} />}
          />
          <TextField
            placeholder="Other"
            value={gender === "Other" ? otherGender : ""}
            onChange={(e) => setOtherGender(e.target.value)}
            variant="standard"
            sx={{
              ml: 1,
              width: "100%",
              color: gender === "Other" ? "black" : "#ECBD35",
            }}
            InputProps={{
              disableUnderline: true,
              readOnly: gender !== "Other",
              style: { height: 15 } // เพิ่ม height
            }}
          />
        </Box>
      </Box>

      {/* Linked Accounts */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Linked Accounts</Typography>

      {/* Google Account */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, bgcolor: "#", borderRadius: 2, mb: 1, height: 40, boxSizing: "border-box" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="img" src="/images/google.png" alt="Google" sx={{ width: 25, height: 25 }} />
          <Typography>Google Account</Typography>
        </Box>
        <Typography sx={{ color: "#515759" }}>Linked</Typography>
      </Box>

      {/* Apple ID */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, bgcolor: "#", borderRadius: 2, mb: 2, height: 40, boxSizing: "border-box" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppleIcon />
          <Typography>Apple ID</Typography>
        </Box>
        <Typography sx={{ color: "#515759" }}>Linked</Typography>
      </Box>

      {/* Logout */}
      <Button
        fullWidth
        variant="outlined"
        onClick={handleLogout}
        sx={{
          borderColor: "#D3D3D3",
          color: "#000",
          bgcolor: "#fff",
          "&:hover": { bgcolor: "#f0f0f0" },
          mt: 3,
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfileInformation;
