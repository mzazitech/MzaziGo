import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

const paymentOptions = [
  {
    id: 1,
    name: "Debit / Credit Card",
    image: "/images/debit-card.png",
    subText: "0123 45** **** 6789",
    showIcon: true,
  },
  {
    id: 2,
    name: "TrueMoney-Wallet",
    image: "/images/truemoney.png",
    subText: "T••••••••••@gmail.com",
    showIcon: true,
  },
  {
    id: 3,
    name: "Cash",
    image: "/images/cash.png",
    subText: "",
    showIcon: false,
  },
  {
    id: 4,
    name: "Qr code",
    image: "/images/qr-code.png",
    subText: "",
    showIcon: false,
  },
];

const Payments = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].id);

  const handleSelectPayment = (id) => {
    setSelectedPayment(id);
  };

  const handleConfirmPayment = () => {
    const selected = paymentOptions.find((p) => p.id === selectedPayment);

    // กลับไปหน้า Chooseride.jsx ทุกกรณี
    navigate("/ride/chooseride", {
      state:
        selected.name === "Cash"
          ? null // ถ้าเป็นเงินสด ไม่ส่งข้อมูลพิเศษ
          : { selectedPayment: selected },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url('./images/field.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
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

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
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

        <IconButton
          onClick={() => navigate("/notifications")}
          sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 30,
            height: 30,
            "&:hover": { backgroundColor: "#f0f0f0" },
            mr: 1,
            color: "#ECBD35",
          }}
        >
          <NotificationsIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          onClick={() => navigate("/profile")}
          sx={{
            backgroundColor: "white",
            borderRadius: "50%",
            width: 40,
            height: 40,
            "&:hover": { backgroundColor: "#f0f0f0" },
            color: "#ECBD35",
          }}
        >
          <PersonIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Payment Options */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          p: 2,
          boxShadow: 2,
          mt: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 1,
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Choose Payment Method
        </Typography>

        {paymentOptions.map((option) => (
          <Box
            key={option.id}
            onClick={() => handleSelectPayment(option.id)}
            sx={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 20px",
              alignItems: "center",
              backgroundColor:
                selectedPayment === option.id ? "#FFF3C4" : "#F9F9F9",
              borderRadius: 2,
              p: 1.5,
              border:
                selectedPayment === option.id
                  ? "2px solid #ECBD35"
                  : "1px solid #ddd",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#FFF8DC" },
              width: option.id === 1 || option.id === 2 ? "95%" : "100%",
              alignSelf: "center",
            }}
          >
            {/* image */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={option.image}
                alt={option.name}
                style={{
                  width: 40,
                  height: 35,
                  borderRadius: 5,
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* text */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                {option.name}
              </Typography>
              {option.subText && (
                <Typography sx={{ fontSize: 12, color: "#555", mt: 0.5 }}>
                  {option.subText}
                </Typography>
              )}
            </Box>

            {/* icon */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {option.showIcon && (
                <KeyboardArrowRightIcon sx={{ fontSize: 20, color: "#555" }} />
              )}
            </Box>
          </Box>
        ))}

        {/* Confirm Button */}
        <Box
          onClick={handleConfirmPayment}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ECBD35",
            borderRadius: 1,
            cursor: "pointer",
            height: 40,
            "&:hover": { backgroundColor: "#d3a32e" },
            mt: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#000000ff" }}>
            Confirm Payment
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Payments;
