import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  // ตรวจสอบสถานะ login จาก localStorage เมื่อ component mount
  React.useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true');
    };

    // ตรวจสอบครั้งแรก
    checkLoginStatus();

    // ฟังการเปลี่ยนแปลงใน localStorage (สำหรับกรณีที่ login จากหน้าอื่น)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };

    // ฟัง custom event สำหรับกรณีที่ login ในหน้าเดียวกัน
    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStatusChanged', handleLoginStatusChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      // ถ้า login แล้วให้ไปหน้า profile
      navigate("/profile");
    } else {
      // ถ้ายังไม่ได้ login ให้ไปหน้า login
      navigate("/login");
    }
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  // ปุ่มเมนูอื่น ๆ
  // const menuItems = ["Earn", "Profile", "About", "Help"];

  return (
    <>
      {/* 🔶 Header Bar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#ECBD35" }}>
          <Toolbar sx={{ minHeight: 80 }}>
            {/* โลโก้ */}
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#ECBD35",
                  WebkitTextStroke: "1px black",
                  fontWeight: "bold",
                  fontSize: 24,
                  mr: 1,
                }}
              >
                THUNDER
              </Box>
              <Box component="span" sx={{ color: "black", fontSize: 24 }}>
                RIDE
              </Box>
            </Typography>

            {/* ปุ่ม LOGIN/Notification */}
            {isLoggedIn ? (
              <IconButton
                onClick={() => navigate("/notifications")}
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 28 }} />
              </IconButton>
            ) : (
              <Button
                variant="outlined"
                onClick={handleUserClick}
                sx={{
                  color: "black",
                  borderColor: "white",
                  borderRadius: "20px",
                  backgroundColor: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 2,
                  py: 0.5,
                }}
              >
                LOGIN
              </Button>
            )}

            {/* ปุ่ม Toggle เมนู */}
            <IconButton
              size="large"
              edge="end"
              aria-label="menu"
              sx={{ ml: 1, color: "black" }}
              onClick={handleMenuToggle}
            >
              {showMenu ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      {/* 🔽 Slide Menu */}
      <Slide direction="down" in={showMenu} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 0,
            width: "100%",
            height: "calc(100vh - 80px)",
            backgroundColor: "#f7f7f7",
            p: 3,
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              pl: 1.25,
              gap: 1.5,
            }}
          >
            {/* Ride + Notification */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/ride");
                }}
              >
                Ride
              </Button>

              {/* <IconButton
                size="medium" // ทำให้ปุ่มใหญ่ขึ้น
                sx={{
                  // bgcolor: "#ffff",
                  color: "#ECBD35", // ไอคอนสีเหลือง
                  pr: 1.25,
                  
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/notifications");
                }}
              >
                <NotificationsIcon sx={{ fontSize: 25 }} /> ขนาดไอคอนปรับเองได้ */}
                {/* ปรับขนาดไอคอน */}
              {/* </IconButton> */}
            </Box>

            <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/earn");
                }}
              >
                Earn
              </Button>

              <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setShowMenu(false);
                  if (isLoggedIn) {
                    navigate("/profile");
                  } else {
                    setShowLoginModal(true);
                  }
                }}
              >
                Profile
              </Button>

              <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/about");
                }}
              >
                About
              </Button>

              <Button
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate("/help");
                }}
              >
                Help
              </Button>
            {/* ปุ่มเมนูอื่น ๆ
            {menuItems.map((item) => (
              <Button
                key={item}
                variant="text"
                disableRipple
                sx={{
                  color: "black",
                  fontSize: "25px", // ปรับขนาดใหญ่ขึ้น
                  fontWeight: 700, // ปรับให้เข้มขึ้น
                  textTransform: "none",
                  justifyContent: "flex-start",
                  width: "100%",
                  pr: 1.25,
                  "&:hover": { backgroundColor: "#eaeaea" },
                }}
                onClick={() => {
                  setShowMenu(false);
                  navigate(`/${item.toLowerCase()}`);
                }}
              >
                {item}
              </Button>
            ))} */}
          </Box>
        </Box>
      </Slide>

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
                onClick={() => setShowLoginModal(false)}
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
    </>
  );
};

export default AppHeader;
