import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, DirectionsRenderer, Marker, useLoadScript } from '@react-google-maps/api';
import { GOOGLE_API_KEY, GOOGLE_LIBRARIES } from '../../Systems/googleMapsConfig';
import { mapStyles } from '../../Systems/mapStyles';

const mapContainerStyle = {
  width: '100%',
  height: 180,
  borderRadius: 8,
};

const Previous = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: GOOGLE_LIBRARIES
  });

  // รับข้อมูลการเดินทางจาก History.jsx
  const rideData = location.state?.rideData || null;
  
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 13.7563, lng: 100.5018 }); // Default Bangkok

  // คำนวณเส้นทางเมื่อมีข้อมูล
  useEffect(() => {
    if (rideData && rideData.pickup && rideData.destination && window.google && isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: rideData.pickup.lat, lng: rideData.pickup.lng },
          destination: { lat: rideData.destination.lat, lng: rideData.destination.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            // ตั้งค่า map center ระหว่าง pickup และ destination
            const bounds = result.routes[0].bounds;
            const center = bounds.getCenter();
            setMapCenter({ lat: center.lat(), lng: center.lng() });
          }
        }
      );
    }
  }, [rideData, isLoaded]);

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

        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
          {rideData?.formattedDate || rideData?.detail || "ไม่มีข้อมูล"}
        </Typography>
      </Box>

      {/* Blog 1 - Booking ID */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 15, color: "#333" }}>Booking ID</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>
          {rideData?.id ? rideData.id.slice(-8).toUpperCase() : "XXXXXXXX"}
        </Typography>
      </Box>

      {/* Blog 2 - Driver Info */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 15, color: "#333" }}>Driver</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>
          {rideData?.driverInfo?.name || "ไม่มีข้อมูล"}
        </Typography>
      </Box>

      {/* Blog 3 - Payment + Map */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          mb: 2,
        }}
      >
        {/* Payment method section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            component="img"
            src="/images/cash.png"
            alt="Payment"
            sx={{ width: 24, height: 24 }}
          />
          <Typography sx={{ fontSize: 15 }}>Cash</Typography>
        </Box>

        <Divider sx={{ bgcolor: "#D3D3D3", my: 2 }} />

        {/* Price row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 15, color: "#333" }}>Price</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "bold", color: rideData?.selectedRide?.rarityApplied ? "#FF6B35" : "#000" }}>
            ฿{rideData?.selectedRide?.price || "150"}
            {rideData?.selectedRide?.rarityApplied && (
              <Typography component="span" sx={{ fontSize: 10, color: '#FF6B35', fontWeight: 'bold', bgcolor: '#FFF3E0', px: 0.5, borderRadius: 1, ml: 0.5 }}>
                SURGE
              </Typography>
            )}
          </Typography>
        </Box>
        
        {/* Tip section (if exists) */}
        {rideData?.tip && rideData.tip !== "0" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 15, color: "#333" }}>Tip</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "bold", color: "#ECBD35" }}>
              ฿{rideData.tip}
            </Typography>
          </Box>
        )}

        {/* Google Map */}
        {loadError ? (
          <Box
            component="img"
            src="/images/field.png"
            alt="Map Preview"
            sx={{
              width: "100%",
              height: 180,
              borderRadius: 2,
              objectFit: "cover",
              mb: 2,
            }}
          />
        ) : !isLoaded ? (
          <Box
            sx={{
              width: "100%",
              height: 180,
              borderRadius: 2,
              bgcolor: "#E5E5E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography sx={{ color: "#888" }}>กำลังโหลดแผนที่...</Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: 180, borderRadius: 2, overflow: "hidden", mb: 2, position: "relative" }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={mapCenter}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
                styles: mapStyles
              }}
              onLoad={map => mapRef.current = map}
            >
              {directions && (
                <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />
              )}
              {rideData?.pickup && (
                <Marker position={{ lat: rideData.pickup.lat, lng: rideData.pickup.lng }} label="S" />
              )}
              {rideData?.destination && (
                <Marker position={{ lat: rideData.destination.lat, lng: rideData.destination.lng }} label="E" />
              )}
            </GoogleMap>
          </Box>
        )}

        {/* Pickup Location */}
        <TextField
          sx={{ mb: 2 }}
          value={rideData?.pickup?.address || ""}
          variant="outlined"
          fullWidth
          disabled
          inputProps={{
            style: { height: 15 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <Box
                  sx={{
                    bgcolor: "#ECBD35",
                    borderRadius: "8px",
                    p: 0.7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(90deg)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                </Box>
              </InputAdornment>
            ),
            sx: {
              backgroundColor: "#E5E5E5",
              borderColor: "#E5E5E5",
              height: 48,
            },
          }}
          InputLabelProps={{ shrink: false }}
        />

        {/* Destination */}
        <TextField
          sx={{ mb: 0 }}
          value={rideData?.destination?.address || ""}
          variant="outlined"
          fullWidth
          disabled
          inputProps={{
            style: { height: 15 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <Box
                  sx={{
                    bgcolor: "#ECBD35",
                    borderRadius: "8px",
                    p: 0.7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(270deg)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                </Box>
              </InputAdornment>
            ),
            sx: {
              backgroundColor: "#E5E5E5",
              borderColor: "#E5E5E5",
              height: 48,
            },
          }}
          InputLabelProps={{ shrink: false }}
        />
      </Box>

      {/* 🟨 Blog 4 - Ride Experience */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: rideData?.reason ? 2 : 0 }}>
          <Typography sx={{ fontSize: 15, color: "#333" }}>
            Ride Experience
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {[1, 2, 3, 4, 5].map((num) =>
              num <= (rideData?.rating || 0) ? (
                <StarIcon key={num} sx={{ color: "#FFD700", fontSize: 24 }} />
              ) : (
                <StarBorderIcon key={num} sx={{ color: "#DDD", fontSize: 24 }} />
              )
            )}
          </Box>
        </Box>
        
        {/* Reason (if exists) */}
        {rideData?.reason && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 14, color: "#666", fontStyle: "italic" }}>
              "{rideData.reason}"
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Previous;
