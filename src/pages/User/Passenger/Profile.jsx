import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profileName, setProfileName] = useState("John Doe"); // ดึงจาก localStorage

  const blogs = [
    { img: "/images/profile4.png", title: "Profile", info: "Profile informations", path: "/profileinformation" },
    { img: "/images/coupon.png", title: "Coupons and Vouchers", info: "Check your promotions", path: "/coupon" },
    { img: "/images/security.png", title: "Security", info: "Account password and stuffs", path: "/security" },
    { img: "/images/history.png", title: "History", info: "Profile informations", path: "/history" },
  ];

  const bankBlogs = [
    { img: "/images/visa.png", title: "Debit / Credit card", info: "0123 45** **** 6789" },
    { img: "/images/true.png", title: "TrueMoney-Wallet", info: "0123 45** **** 6789" },
  ];

  // โหลดชื่อจาก localStorage เมื่อ component mount
  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const { name } = JSON.parse(savedData);
      if (name) setProfileName(name);
    }
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: "#F7F7F7", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 39,
            height: 39,
            border: "1.5px solid #D3D3D3",
            "&:hover": { backgroundColor: "#f0f0f0" },
            mr: 2,
            color: "black",
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          onClick={() => navigate("/notifications")}
          sx={{
            backgroundColor: "#ECBD35",
            color: "#fff",
            width: 35,
            height: 35,
            "&:hover": { backgroundColor: "#d6a92f" },
          }}
        >
          <NotificationsIcon />
        </IconButton>
      </Box>

      {/* Profile picture + Name */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Box
          component="img"
          src="/images/profile3.png"
          alt="profile"
          sx={{ width: 105, height: 100, borderRadius: "40%", mx: "auto" }}
        />
        <Typography sx={{ fontWeight: "bold", fontSize: 18, mt: 1 }}>{profileName}</Typography>
      </Box>

      {/* Personal info label */}
      <Typography sx={{ fontWeight: "bold", fontSize: 16, mb: 1, color: "#7B7B7B" }}>
        Personal info
      </Typography>

      {/* Blogs */}
      {blogs.map((blog, index) => (
        <Box
          key={index}
          onClick={() => navigate(blog.path)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
            p: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            height: 70,
            cursor: "pointer",
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={blog.img}
              alt={blog.title}
              sx={{ width: 50, height: 50, borderRadius: 2, mr: 2 }}
            />
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>{blog.title}</Typography>
              <Typography sx={{ color: "#5D5C5D", fontSize: 13 }}>{blog.info}</Typography>
            </Box>
          </Box>

          <NavigateNextIcon sx={{ color: "#5D5C5D" }} />
        </Box>
      ))}

      {/* Manage bank accounts & cards */}
      <Typography sx={{ fontWeight: "bold", fontSize: 16, mb: 1, mt: 2, color: "#7B7B7B" }}>
        Manage bank accounts & cards
      </Typography>

      {bankBlogs.map((blog, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
            p: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            height: 70,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={blog.img}
              alt={blog.title}
              sx={{ width: 55, height: 50, borderRadius: 2, mr: 2 }}
            />
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>{blog.title}</Typography>
              <Typography sx={{ color: "#5D5C5D", fontSize: 13 }}>{blog.info}</Typography>
            </Box>
          </Box>

          <NavigateNextIcon sx={{ color: "#5D5C5D" }} />
        </Box>
      ))}
    </Box>
  );
};

export default Profile;
