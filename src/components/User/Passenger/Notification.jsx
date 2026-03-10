import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useNavigate } from "react-router-dom";
import { getNotifications } from '../../../utils/notificationManager';

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // โหลด notifications จาก localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = getNotifications();
      setNotifications(storedNotifications);
    };

    loadNotifications();

    // ฟัง event เมื่อมี notification ใหม่
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('notificationAdded', handleNotificationUpdate);
    window.addEventListener('notificationUpdated', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notificationAdded', handleNotificationUpdate);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
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

        <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>Notification</Typography>
      </Box>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "#5D5C5D" }}>
          ยังไม่มีการแจ้งเตือน
        </Typography>
      ) : (
        notifications.map((note) => (
          <Box
            key={note.id}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 2,
              opacity: note.read ? 0.7 : 1,
            }}
          >
            {/* Top row: name + status */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>{note.name}</Typography>
              <Box
                sx={{
                  bgcolor: note.statusBg,
                  color: note.statusColor,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                {note.status}
              </Box>
            </Box>

            {/* Bottom row: icon + detail */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {note.type === 'message' ? (
                <ChatBubbleIcon sx={{ fontSize: 20, color: "#5D5C5D" }} />
              ) : (
                <AccessTimeIcon sx={{ fontSize: 20, color: "#5D5C5D" }} />
              )}
              <Typography sx={{ fontSize: 14, color: "#5D5C5D" }}>{note.detail}</Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Notification;
