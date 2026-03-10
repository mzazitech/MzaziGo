import React from "react";
import { Box, IconButton, Typography, TextField, Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const Coupon = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3, bgcolor: "#F7F7F7", minHeight: "100vh" }}>
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

        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
          Vouchers
        </Typography>
      </Box>

      {/* Redeem Vouchers */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Redeem Vouchers</Typography>

      {/* กล่องสีเหลืองครอบ TextField + Button */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: "#ECBD35",
          borderRadius: 2,
          alignItems: "center",
          maxWidth: 500,
          width: "100%",
          height: 60,
        }}
      >
        <TextField
          placeholder="Enter Code here"
          variant="outlined"
          sx={{
            flex: 1,
            bgcolor: "#fff",
            borderRadius: 1,
          }}
          inputProps={{ style: { height: 40, padding: "0 8px" } }}
        />
        <Button
          variant="outlined"
          sx={{
            borderColor: "#000",
            color: "#000",
            bgcolor: "#fff",
            borderRadius: 1,
            height: 40,
            minWidth: 80,
            width: 100,
            maxWidth: 150,
          }}
        >
          Redeem
        </Button>
      </Box>

      {/* Available Vouchers */}
      <Typography sx={{ fontWeight: "bold", mb: 1 }}>Available Vouchers</Typography>

      {/* Blog สีเหลือง ครอบ Voucher */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: "#ECBD35", // สีเหลืองของ blog
          maxWidth: 500,
          width: "100%",
          minHeight: 500, // ความสูงขั้นต่ำ
          Height: 500, // ความสูงขั้นต่ำ
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* <Typography sx={{ fontWeight: "bold" }}>10% Off</Typography>
        <Typography sx={{ fontSize: 13 }}>Use code SAVE10 at checkout</Typography> */}
      </Box>

      {/* <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: "#FCD34D",
          maxWidth: 500,
          width: "100%",
          minHeight: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Free Delivery</Typography>
        <Typography sx={{ fontSize: 13 }}>Use code FREESHIP</Typography>
      </Box> */}
    </Box>
  );
};

export default Coupon;
