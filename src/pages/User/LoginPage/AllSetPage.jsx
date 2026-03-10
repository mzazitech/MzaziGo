import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AllSetPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ตั้งค่า login status ใน localStorage เมื่อมาถึงหน้านี้
    localStorage.setItem('isLoggedIn', 'true');
    
    // ส่ง custom event เพื่อแจ้งให้ AppHeader อัพเดทสถานะ
    window.dispatchEvent(new Event('loginStatusChanged'));
    
    // Redirect ไปหน้า landing หลังจาก 2 วินาที
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box textAlign="center" mt={5}>
      <Typography sx={{ fontSize: 40, fontWeight: 500, mb: 2, mt: 30, textAlign: "center" }}>
        All set !!
      </Typography>
      <Typography sx={{ fontSize: 12, color: "grey.600" }}>
        You'll be signed in and your account momentarily.
      </Typography>
    </Box>
  );
}