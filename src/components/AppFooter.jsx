import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const AppFooter = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#ECBD35" }}>
        <Toolbar
          sx={{
            minHeight: 120,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            px: 3,
            py: 2,
            gap: 1,
          }}
        >
          {/* โลโก้ Thunder Ride */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              textAlign: 'left',
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

          {/* Inquiry */}
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/inquiry'}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ mt: 3,fontSize: 18 }}>Inquiry</Box>
          </Button>

          {/* Terms and Conditions */}
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/terms'}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ fontSize: 18 }}>Terms and Conditions</Box>
          </Button>
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/terms'}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ fontSize: 18 }}>About us</Box>
          </Button>
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/terms'}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ fontSize: 18 }}>Safety</Box>
          </Button>
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/terms'}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ fontSize: 18 }}>Help</Box>
          </Button>
          <Button
            variant="text"
            onClick={() => window.location.href = 'https://your-api-or-page.com/terms'}
            sx={{
              color: "#383838",
              textTransform: "none",
              fontWeight: "bold",
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            <Box sx={{ mt:1 ,fontSize: 12 }}>@ [Thunder Ride Credit].</Box>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppFooter;
