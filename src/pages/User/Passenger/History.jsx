import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);

  // โหลดประวัติการเดินทางจาก localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('rideHistory');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          // เรียงลำดับตามวันที่ล่าสุดก่อน
          const sortedHistory = history.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          setHistoryItems(sortedHistory);
        }
      } catch (error) {
        console.error('Error loading ride history:', error);
      }
    };

    loadHistory();

    // ฟัง custom event เมื่อมีการเพิ่มประวัติใหม่
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener('rideHistoryUpdated', handleHistoryUpdate);

    return () => {
      window.removeEventListener('rideHistoryUpdated', handleHistoryUpdate);
    };
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

        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>
          Previous Ride
        </Typography>
      </Box>

      {/* History list */}
      {historyItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography sx={{ fontSize: 16, color: '#888' }}>
            ยังไม่มีประวัติการเดินทาง
          </Typography>
        </Box>
      ) : (
        historyItems.map((item, index) => (
          <Box
            key={item.id || index}
            onClick={() => navigate("/previous", { state: { rideData: item } })} // ✅ ส่งข้อมูลการเดินทางไปหน้า Previous
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.15s ease",
            "&:hover": {
              transform: "scale(1.02)",
              bgcolor: "#f9f9f9",
            },
          }}
        >
          {/* Left: Image + info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src="/images/ride.png"
              alt="Ride"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                {item.destination?.address || item.name || "ปลายทาง"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: "#5D5C5D" }} />
                <Typography sx={{ fontSize: 14, color: "#5D5C5D" }}>
                  {item.detail || item.formattedDate || new Date(item.timestamp).toLocaleString('th-TH', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: Rebook icon */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RestartAltIcon sx={{ color: "#ECBD35", fontSize: 28 }} />
            <Typography
              sx={{
                fontSize: 12,
                color: "#515759",
                fontWeight: "bold",
                mt: 0.3,
              }}
            >
              Rebook
            </Typography>
          </Box>
        </Box>
        ))
      )}
    </Box>
  );
};

export default History;
