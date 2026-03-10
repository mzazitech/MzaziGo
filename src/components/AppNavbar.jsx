import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NearMeIcon from '@mui/icons-material/NearMe';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Login from '../pages/User/LoginPage/Login';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { GOOGLE_API_KEY, GOOGLE_LIBRARIES } from './Systems/googleMapsConfig';

function AppNavbar() {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: GOOGLE_LIBRARIES
  });

  const [pickupValue, setPickupValue] = useState(null); // { lat, lng, address }
  const [pickupInput, setPickupInput] = useState('');

  const [destinationValue, setDestinationValue] = useState(null); // { lat, lng, address }
  const [destinationInput, setDestinationInput] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะ login

  const pickupAutoRef = useRef(null);
  const destAutoRef = useRef(null);

  // ตรวจสอบสถานะ login เมื่อ component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus(); // Check on mount

    // ฟังการเปลี่ยนแปลงใน localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn') {
        const loggedIn = e.newValue === 'true';
        setIsLoggedIn(loggedIn);
      }
    };

    // ฟัง custom event
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

  // ฟังก์ชันขออนุญาตตำแหน่งและกรอกสถานที่ปัจจุบัน
  const handlePickupIconClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // ใช้ Geocoder เพื่อแปลงพิกัดเป็นที่อยู่
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === 'OK' && results[0]) {
                const locationData = {
                  lat: pos.lat,
                  lng: pos.lng,
                  address: results[0].formatted_address
                };
                setPickupValue(locationData);
                setPickupInput(locationData.address);
              } else {
                alert('ไม่สามารถค้นหาที่อยู่ได้ กรุณาลองอีกครั้ง');
              }
            });
          } else {
            alert('Google Maps ยังไม่พร้อมใช้งาน กรุณารอสักครู่');
          }
        },
        (error) => {
          let errorMessage = 'ไม่สามารถเข้าถึงตำแหน่งของคุณได้';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'คุณไม่อนุญาตให้เข้าถึงตำแหน่ง กรุณาอนุญาตในเบราว์เซอร์';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
              break;
            case error.TIMEOUT:
              errorMessage = 'หมดเวลารอการระบุตำแหน่ง';
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง');
    }
  };

  // ฟังก์ชันจัดการเมื่อเลือกสถานที่จาก Autocomplete
  const handlePlaceChanged = (type) => {
    let autoRef = type === 'pickup' ? pickupAutoRef : destAutoRef;
    const place = autoRef.current?.getPlace();
    if (place && place.geometry) {
      const locationData = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name
      };

      if (type === 'pickup') {
        setPickupValue(locationData);
        setPickupInput(locationData.address);
      } else {
        setDestinationValue(locationData);
        setDestinationInput(locationData.address);
      }
    }
  };

  const handleConfirmClick = () => {
    if (!pickupValue || !destinationValue) {
      alert('กรุณากรอกจุดรับและจุดปลายทางให้ครบถ้วน');
      return;
    }

    navigate('/ride', {
      state: {
        pickup: pickupValue,
        destination: destinationValue,
      },
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 2, fontWeight: 'bold', fontSize: 28 }}>Request a ride</Box>

      {/* Pickup Location */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Autocomplete
          onLoad={(ref) => (pickupAutoRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged('pickup')}
          options={{ componentRestrictions: { country: "th" } }}
        >
          <TextField
            value={pickupInput}
            onChange={(e) => setPickupInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            placeholder="Pickup Location"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <Box
                    component="img"
                    src="/images/pick.png"
                    sx={{ width: 24, height: 24, objectFit: 'contain' }}
                  />
                </Box>
              ),
              sx: { backgroundColor: '#E5E5E5', borderColor: '#E5E5E5', height: 48 },
            }}
          />
        </Autocomplete>
        {/* Icon ชิดขวาแบบ absolute, ขอบขวา 2px, ขนาดเดิม */}
        <IconButton
          onClick={handlePickupIconClick}
          sx={{
            position: 'absolute',
            right: 2, // เว้นขอบขวา 2px
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: '#ECBD35',
            color: '#FFFFFF',
            borderRadius: 0,
            width: 24,
            height: 24,
            '&:hover': { bgcolor: '#d3a32e' },
            padding: 0,
            marginRight: 1,
          }}
          title="Use current location"
        >
          <NearMeIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Destination */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          onLoad={(ref) => (destAutoRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged('destination')}
          options={{ componentRestrictions: { country: "th" } }}
        >
          <TextField
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            placeholder="Destination"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <Box
                    component="img"
                    src="/images/Des.png"
                    sx={{ width: 24, height: 24, objectFit: 'contain' }}
                  />
                </Box>
              ),
              sx: { backgroundColor: '#E5E5E5', borderColor: '#E5E5E5', height: 48 },
            }}
          />
        </Autocomplete>
      </Box>

      {/* Confirm Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleConfirmClick}
        sx={{
          bgcolor: '#ECBD35',
          color: '#000000',
          fontWeight: 'bold',
          '&:hover': { bgcolor: '#d3a32e' },
          height: 35,
          width: 105,
          textTransform: 'none',
        }}
      >
        <Box sx={{ mb: 0, fontSize: 16 }}>Confirms</Box>
      </Button>

      {/* ข้อมูลอื่น ๆ */}
      <Box sx={{ mt: 4, fontSize: 24 }}>Turn your car into an income.</Box>
      <Box sx={{ mt: 1, fontSize: 12, color: '#585858' }}>
        Join our platform and earn by giving rides on your schedule. Register your car once, and start driving with full control—your time, your rules, your earnings.
      </Box>

      <Box sx={{ mt: 1 }}>
        <img
          src="./images/taxi 1.png"
          alt=""
          style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
        />
        <Button
          fullWidth
          onClick={() => window.location.href = 'https://your-api-or-page.com'}
          variant="contained"
          sx={{
            marginTop: 1,
            bgcolor: '#ECBD35',
            color: '#000000',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#d3a32e' },
            height: 30,
            width: 125,
            textTransform: 'none',
          }}
        >
          <Box sx={{ mb: 0, fontSize: 16 }}>Get Started</Box>
        </Button>
      </Box>

      <Box sx={{ mt: 4, fontSize: 24 }}>Ride with us.</Box>
      <Box sx={{ mt: 1 }}>
        <img
          src="./images/taxi 2.png"
          alt=""
          style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
        />
        <Box sx={{ mt: 2, fontSize: 12, color: '#585858' }}>
          Your safe, easy, and reliable way to get where you need to go. With trusted drivers and clear pricing, you can relax and enjoy the journey every time.
        </Box>
        <Button
          fullWidth
          onClick={() => {
            if (isLoggedIn) {
              navigate('/ride');
            } else {
              navigate('/login');
            }
          }}
          variant="contained"
          sx={{
            marginTop: 2,
            bgcolor: '#ECBD35',
            color: '#000000',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#d3a32e' },
            height: 30,
            width: 205,
            textTransform: 'none',
          }}
        >
          <Box sx={{ mt: 0, fontSize: 16 }}>{isLoggedIn ? 'Ride' : 'Log in to your account'}</Box>
        </Button>
      </Box>

      <Box sx={{ mt: 4, fontSize: 24 }}>We value your safety.</Box>
      <Box sx={{ mt: 1, mb: 10, fontSize: 12, color: '#585858' }}>
        Your safety comes first. Every driver is verified, every ride is tracked, and every trip is protected so you can ride with peace of mind, every time.
      </Box>
    </Box>
  );
}

export default AppNavbar;
