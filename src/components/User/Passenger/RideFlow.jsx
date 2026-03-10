import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import NearMeIcon from "@mui/icons-material/NearMe";
import PlaceIcon from "@mui/icons-material/Place";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import PersonIconSmall from "@mui/icons-material/Person";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Autocomplete, useLoadScript, Marker, DirectionsRenderer, Polyline, OverlayView } from '@react-google-maps/api';
import { GOOGLE_API_KEY, GOOGLE_LIBRARIES } from '../../Systems/googleMapsConfig';
import { mapStyles } from '../../Systems/mapStyles';
import { calculatePricesFromDirections, VEHICLE_CONFIG } from '../../../utils/pricingCalculator';
import { generateDriverInfo } from '../../../utils/driverGenerator';
import { createNotification } from '../../../utils/notificationManager';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0
};

const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

// Default rides (จะถูกคำนวณใหม่เมื่อมี route)
const getDefaultRides = () => {
    return Object.values(VEHICLE_CONFIG).map(config => ({
        id: config.id,
        name: config.name,
        price: config.minFare,
        distance: "0 km",
        image: config.image,
        passengers: config.passengers
    }));
};

const paymentOptions = [
    { id: 1, name: "Debit / Credit Card", image: "/images/debit-card.png", subText: "0123 45** **** 6789", showIcon: true },
    { id: 2, name: "TrueMoney-Wallet", image: "/images/truemoney.png", subText: "T••••••••••@gmail.com", showIcon: true },
    { id: 3, name: "Cash", image: "/images/cash.png", subText: "", showIcon: false },
    { id: 4, name: "Qr code", image: "/images/qr-code.png", subText: "", showIcon: false },
];

const RideFlow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries: GOOGLE_LIBRARIES
    });

    // Steps: INPUT, PICKUP_MAP, CHOOSE_RIDE, PROCESSING, TRACKING
    const [step, setStep] = useState('INPUT');

    // Data State
    const [pickup, setPickup] = useState(null); // { lat, lng, address }
    const [pickupInput, setPickupInput] = useState("");
    const [destination, setDestination] = useState(null); // { lat, lng, address }
    const [destinationInput, setDestinationInput] = useState("");
    const [selectedRide, setSelectedRide] = useState(null);
    const [selectedRides, setSelectedRides] = useState([]);
    const [directions, setDirections] = useState(null);
    const [rides, setRides] = useState(getDefaultRides()); // รายการรถพร้อมราคาที่คำนวณแล้ว
    const [progress, setProgress] = useState(0);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(paymentOptions[2]); // Default to Cash
    const [showChatOverlay, setShowChatOverlay] = useState(false);
    const [showCallOverlay, setShowCallOverlay] = useState(false);
    const [chatMessages, setChatMessages] = useState([]); // Array of {sender: 'driver'|'passenger', text: string}
    const [chatInput, setChatInput] = useState("");
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const isChatOpenRef = useRef(false); // Ref to track chat open status for animation loop

    // Map State
    const mapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedMapLocation, setSelectedMapLocation] = useState(null);
    const [mapSelectingMode, setMapSelectingMode] = useState(null); // 'pickup' | 'destination' | null
    const pickupAutoRef = useRef(null);
    const destAutoRef = useRef(null);

    // Tracking State
    const [taxiPosition, setTaxiPosition] = useState(null);
    const [durationText, setDurationText] = useState("");
    const [driverPosition, setDriverPosition] = useState(null); // Random position near pickup
    const [pickupToDestRoute, setPickupToDestRoute] = useState(null); // Route from pickup to destination
    const [isPickingUp, setIsPickingUp] = useState(true); // True = going to pickup, False = going to destination
    const [isCancelLocked, setIsCancelLocked] = useState(false); // Lock cancel when driver is near
    const [remainingRoutePath, setRemainingRoutePath] = useState([]); // Path ที่เหลือจากตำแหน่งปัจจุบันไปยังปลายทาง
    const [driverInfo, setDriverInfo] = useState(null); // ข้อมูลคนขับ { name, licensePlate, phoneNumber, rating, vehicleModel, vehicleColor }
    const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะ login
    const [showLoginModal, setShowLoginModal] = useState(false); // แสดง popup login
    const [showReviewModal, setShowReviewModal] = useState(false); // แสดง popup review
    const [reviewStep, setReviewStep] = useState("review"); // review | tip | rate
    const [rating, setRating] = useState(0);
    const [selectedTip, setSelectedTip] = useState("");
    const [customTip, setCustomTip] = useState("");
    const [reason, setReason] = useState("");
    const animationRef = useRef({ frameId: null, startTime: null });
    const routeMetricsRef = useRef({ totalDistance: 0, segments: [] });
    const autoMessageSentRef = useRef(false); // Flag to prevent duplicate auto messages (using ref for synchronous check)
    const pickupMessageSentRef = useRef(false); // Flag for pickup confirmation message
    const reviewModalShownRef = useRef(false); // Flag to prevent duplicate review modal
    const notificationRefs = useRef({
        nearPickup: false, // Notification เมื่อรถใกล้มาถึง pickup (300m)
        arrivedPickup: false, // Notification เมื่อรถมาถึง pickup
        nearDestination: false, // Notification เมื่อรถใกล้มาถึง destination (500m)
        arrivedDestination: false, // Notification เมื่อรถมาถึง destination
        lastDriverMessageIndex: -1 // ติดตาม index ของข้อความคนขับล่าสุด
    });
    const trackingPolylineRef = useRef(null); // Reference for native Google Maps Polyline

    // ตรวจสอบสถานะ login เมื่อ component mount
    useEffect(() => {
        const checkLoginStatus = () => {
            const loginStatus = localStorage.getItem('isLoggedIn');
            const loggedIn = loginStatus === 'true';
            setIsLoggedIn(loggedIn);

            // ถ้ายังไม่ได้ login ให้แสดง popup
            if (!loggedIn) {
                setShowLoginModal(true);
            }
        };

        checkLoginStatus();

        // ฟังการเปลี่ยนแปลงใน localStorage
        const handleStorageChange = (e) => {
            if (e.key === 'isLoggedIn') {
                const loggedIn = e.newValue === 'true';
                setIsLoggedIn(loggedIn);
                if (loggedIn) {
                    setShowLoginModal(false);
                }
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

    // --- Handlers ---

    const handlePlaceChanged = (type) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        let autoRef = type === 'pickup' ? pickupAutoRef : destAutoRef;
        const place = autoRef.current?.getPlace();
        if (place && place.geometry) {
            const locationData = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || place.name
            };

            if (type === 'pickup') {
                setPickup(locationData);
                setPickupInput(locationData.address);
                setMapCenter({ lat: locationData.lat, lng: locationData.lng });
            } else {
                setDestination(locationData);
                setDestinationInput(locationData.address);
            }
        }
    };

    const calculateRoute = useCallback(() => {
        if (pickup && destination && window.google) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: pickup,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                        if (result.routes[0]?.legs[0]?.duration?.text) {
                            setDurationText(result.routes[0].legs[0].duration.text);
                        }

                        // คำนวณราคาสำหรับรถทุกประเภท
                        try {
                            const calculatedRides = calculatePricesFromDirections(result);
                            if (calculatedRides && calculatedRides.length > 0) {
                                setRides(calculatedRides);
                            }
                        } catch (error) {
                            console.error("Error calculating ride prices:", error);
                            // ใช้ค่า default ถ้าคำนวณไม่สำเร็จ
                            setRides(getDefaultRides());
                        }
                    } else {
                        // ถ้าคำนวณ route ไม่สำเร็จ ใช้ค่า default
                        setRides(getDefaultRides());
                    }
                }
            );
        }
    }, [pickup, destination]);

    // รับข้อมูลจาก AppNavbar เมื่อ navigate มาจากหน้า Landing
    useEffect(() => {
        if (location.state?.pickup) {
            setPickup(location.state.pickup);
            setPickupInput(location.state.pickup.address);
            if (location.state.pickup.lat && location.state.pickup.lng) {
                setMapCenter({ lat: location.state.pickup.lat, lng: location.state.pickup.lng });
            }
        }
        if (location.state?.destination) {
            setDestination(location.state.destination);
            setDestinationInput(location.state.destination.address);
        }
        // ถ้ามีทั้ง pickup และ destination ให้ไปหน้า CHOOSE_RIDE
        if (location.state?.pickup && location.state?.destination && isLoaded) {
            setStep('CHOOSE_RIDE');
        }
    }, [location.state, isLoaded]);

    // คำนวณราคาใหม่เมื่อ pickup หรือ destination เปลี่ยน
    useEffect(() => {
        if (pickup && destination && step === 'CHOOSE_RIDE') {
            calculateRoute();
        }
    }, [pickup, destination, step, calculateRoute]);

    const handleNextToChooseRide = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        if (pickup && destination) {
            setStep('CHOOSE_RIDE');
            calculateRoute();
        }
    };

    const handleOpenMap = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        // ตรวจสอบว่าช่องไหนว่าง และตั้งค่า mode
        let selectingMode = null;
        if (!pickup) {
            // ถ้าช่องต้นทางว่าง ให้เลือกต้นทางก่อน
            selectingMode = 'pickup';
        } else if (!destination) {
            // ถ้าช่องต้นทางมีแล้ว แต่ปลายทางว่าง ให้เลือกปลายทาง
            selectingMode = 'destination';
        } else {
            // ถ้าทั้งสองช่องมีแล้ว ให้เริ่มจากต้นทาง (ให้เลือกใหม่ได้)
            selectingMode = 'pickup';
        }

        setMapSelectingMode(selectingMode);
        setStep('PICKUP_MAP');

        // ตั้งค่า map center ตาม mode
        if (selectingMode === 'pickup' && pickup) {
            setMapCenter({ lat: pickup.lat, lng: pickup.lng });
            setSelectedMapLocation({ lat: pickup.lat, lng: pickup.lng });
        } else if (selectingMode === 'destination' && destination) {
            setMapCenter({ lat: destination.lat, lng: destination.lng });
            setSelectedMapLocation({ lat: destination.lat, lng: destination.lng });
        } else if (pickup) {
            setMapCenter({ lat: pickup.lat, lng: pickup.lng });
            setSelectedMapLocation({ lat: pickup.lat, lng: pickup.lng });
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMapCenter(pos);
                    setSelectedMapLocation(pos);

                    // ใช้ Geocoder เพื่อแปลง lat/lng เป็น address และตั้งค่า pickup
                    if (window.google) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: pos }, (results, status) => {
                            if (status === "OK" && results[0]) {
                                const locationData = {
                                    lat: pos.lat,
                                    lng: pos.lng,
                                    address: results[0].formatted_address
                                };
                                setPickup(locationData);
                                setPickupInput(locationData.address);
                            } else {
                                // ถ้า geocode ไม่สำเร็จ ให้ใช้ lat/lng เป็น address ชั่วคราว
                                const locationData = {
                                    lat: pos.lat,
                                    lng: pos.lng,
                                    address: `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`
                                };
                                setPickup(locationData);
                                setPickupInput(locationData.address);
                            }
                        });
                    } else {
                        // ถ้ายังไม่มี Google Maps API ให้ใช้ lat/lng เป็น address ชั่วคราว
                        const locationData = {
                            lat: pos.lat,
                            lng: pos.lng,
                            address: `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`
                        };
                        setPickup(locationData);
                        setPickupInput(locationData.address);
                    }
                },
                () => alert("Error getting location")
            );
        }
    };

    const handleMapClick = (e) => {
        setSelectedMapLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    const handleConfirmMapSelection = () => {
        if (selectedMapLocation && mapSelectingMode) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: selectedMapLocation }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const locationData = {
                        lat: selectedMapLocation.lat,
                        lng: selectedMapLocation.lng,
                        address: results[0].formatted_address
                    };

                    // ใส่ข้อมูลลงในช่องที่เลือก
                    if (mapSelectingMode === 'pickup') {
                        setPickup(locationData);
                        setPickupInput(locationData.address);
                    } else if (mapSelectingMode === 'destination') {
                        setDestination(locationData);
                        setDestinationInput(locationData.address);
                    }

                    // ตรวจสอบว่าควรเลือกช่องถัดไปหรือกลับไปหน้า INPUT
                    if (mapSelectingMode === 'pickup' && !destination) {
                        // ถ้าเลือกต้นทางแล้ว แต่ยังไม่มีปลายทาง ให้เลือกปลายทางต่อ
                        setMapSelectingMode('destination');
                        setSelectedMapLocation(null);
                    } else {
                        // ถ้าเลือกครบแล้ว หรือเลือกปลายทางแล้ว ให้กลับไปหน้า INPUT
                        setStep('INPUT');
                        setMapSelectingMode(null);
                        setSelectedMapLocation(null);
                    }
                } else {
                    // ถ้า geocode ไม่สำเร็จ ให้ใช้ lat/lng เป็น address ชั่วคราว
                    const locationData = {
                        lat: selectedMapLocation.lat,
                        lng: selectedMapLocation.lng,
                        address: `${selectedMapLocation.lat.toFixed(6)}, ${selectedMapLocation.lng.toFixed(6)}`
                    };

                    if (mapSelectingMode === 'pickup') {
                        setPickup(locationData);
                        setPickupInput(locationData.address);
                    } else if (mapSelectingMode === 'destination') {
                        setDestination(locationData);
                        setDestinationInput(locationData.address);
                    }

                    if (mapSelectingMode === 'pickup' && !destination) {
                        setMapSelectingMode('destination');
                        setSelectedMapLocation(null);
                    } else {
                        setStep('INPUT');
                        setMapSelectingMode(null);
                        setSelectedMapLocation(null);
                    }
                }
            });
        }
    };

    const handleConfirmRide = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        if (selectedRides.length > 0) {
            // Pick a random ride from selected rides as the final confirmed ride
            const finalRide = selectedRides[Math.floor(Math.random() * selectedRides.length)];
            setSelectedRide(finalRide);

            // สุ่มข้อมูลคนขับใหม่ทุกครั้งที่ยืนยัน ride
            const newDriverInfo = generateDriverInfo(finalRide.name);
            setDriverInfo(newDriverInfo);

            setStep('PROCESSING');
            // Simulate processing
            let p = 0;
            const interval = setInterval(() => {
                p += 2;
                setProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    setStep('TRACKING');
                    startTrackingAnimation();
                }
            }, 50);
        } else {
            alert("Please select at least one ride");
        }
    };

    const handleSendMessage = () => {
        if (chatInput.trim() === "") return;
        setChatMessages([...chatMessages, { sender: 'passenger', text: chatInput }]);
        setChatInput("");

        // สร้าง notification เมื่อผู้โดยสารส่งข้อความ (ถ้าต้องการ)
        // แต่อาจจะไม่จำเป็นเพราะ notification ควรมาจากคนขับ
    };

    const handleChatKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReviewConfirm = () => {
        // บันทึกประวัติการเดินทาง
        if (pickup && destination && selectedRide) {
            try {
                const rideHistoryItem = {
                    id: Date.now().toString(), // Unique ID
                    pickup: pickup,
                    destination: destination,
                    selectedRide: selectedRide,
                    driverInfo: driverInfo,
                    rating: rating,
                    tip: customTip || selectedTip || "0",
                    reason: reason,
                    timestamp: new Date().toISOString(),
                    formattedDate: new Date().toLocaleString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    // สำหรับแสดงใน History.jsx
                    name: destination.address,
                    detail: new Date().toLocaleString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) + "."
                };

                // โหลดประวัติเดิม
                const existingHistory = localStorage.getItem('rideHistory');
                let historyArray = [];

                if (existingHistory) {
                    try {
                        historyArray = JSON.parse(existingHistory);
                    } catch (e) {
                        console.error('Error parsing existing history:', e);
                    }
                }

                // เพิ่มประวัติใหม่
                historyArray.push(rideHistoryItem);

                // บันทึกลง localStorage
                localStorage.setItem('rideHistory', JSON.stringify(historyArray));

                // Dispatch custom event เพื่อแจ้ง History.jsx
                window.dispatchEvent(new CustomEvent('rideHistoryUpdated'));
            } catch (error) {
                console.error('Error saving ride history:', error);
            }
        }

        // Reset review states
        setReviewStep("review");
        setRating(0);
        setSelectedTip("");
        setCustomTip("");
        setReason("");
        setShowReviewModal(false);
        // Reset tracking states
        setTaxiPosition(null);
        setDriverPosition(null);
        setPickupToDestRoute(null);
        setIsPickingUp(true);
        setDirections(null);
        setSelectedRide(null);
        setSelectedRides([]);
        setPickup(null);
        setPickupInput("");
        setDestination(null);
        setDestinationInput("");
        reviewModalShownRef.current = false;

        // Navigate back to LandingPage after a short delay
        setTimeout(() => {
            navigate('/');
        }, 1000); // รอ 1 วินาทีเพื่อให้ modal ปิดก่อน
    };

    // Reset unread count when chat is opened
    useEffect(() => {
        isChatOpenRef.current = showChatOverlay;
        if (showChatOverlay) {
            setUnreadMessageCount(0);
        }
    }, [showChatOverlay]);

    // --- Tracking Logic ---
    const generateRandomDriverPosition = (pickupLocation) => {
        // Generate random position 0.5-1.5 km from pickup
        const minDistance = 0.5; // km
        const maxDistance = 1.5; // km
        const randomDistance = minDistance + Math.random() * (maxDistance - minDistance);
        const randomAngle = Math.random() * 2 * Math.PI;

        // Convert to lat/lng offset (approximate: 1 degree ≈ 111 km)
        const kmPerDegree = 111;
        const latOffset = (randomDistance * Math.cos(randomAngle)) / kmPerDegree;
        const lngOffset = (randomDistance * Math.sin(randomAngle)) / (kmPerDegree * Math.cos(pickupLocation.lat * Math.PI / 180));

        return {
            lat: pickupLocation.lat + latOffset,
            lng: pickupLocation.lng + lngOffset
        };
    };

    const haversineMeters = useCallback((a, b) => {
        const R = 6371000;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLng = toRad(b.lng - a.lng);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const sinDLat = Math.sin(dLat / 2);
        const sinDLng = Math.sin(dLng / 2);
        const aa = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
        const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
        return R * c;
    }, []);

    // ฟังก์ชันแปลงวินาทีเป็นรูปแบบ "X min" หรือ "X sec"
    const formatDuration = useCallback((seconds) => {
        if (seconds < 60) {
            return `${Math.round(seconds)} sec`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        if (remainingSeconds === 0) {
            return `${minutes} min`;
        }
        return `${minutes} min ${remainingSeconds} sec`;
    }, []);

    const startTrackingAnimation = () => {
        if (!pickup || !destination) return;

        // Random DRIVER POSITION
        const randomDriverPos = generateRandomDriverPosition(pickup);
        setDriverPosition(randomDriverPos);
        setIsPickingUp(true);
        setIsCancelLocked(false); // Reset cancel lock for new ride
        autoMessageSentRef.current = false; // Reset auto message flag for new ride
        pickupMessageSentRef.current = false; // Reset pickup message flag for new ride
        reviewModalShownRef.current = false; // Reset review modal flag for new ride
        setRemainingRoutePath([]); // Reset remaining route path
        // Reset notification refs
        notificationRefs.current = {
            nearPickup: false,
            arrivedPickup: false,
            nearDestination: false,
            arrivedDestination: false,
            lastDriverMessageIndex: -1
        };

        const directionsService = new window.google.maps.DirectionsService();

        // Calculate BOTH routes before starting animation
        const calculateRoute = (origin, dest) => {
            return new Promise((resolve, reject) => {
                directionsService.route(
                    {
                        origin: origin,
                        destination: dest,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            resolve(result);
                        } else {
                            reject(status);
                        }
                    }
                );
            });
        };

        // Calculate both routes in parallel
        Promise.all([
            calculateRoute(randomDriverPos, pickup),      // Driver -> Pickup
            calculateRoute(pickup, destination)           // Pickup -> Destination
        ]).then(([driverToPickupRoute, pickupToDestinationRoute]) => {
            // Save both routes
            setDirections(driverToPickupRoute);
            setPickupToDestRoute(pickupToDestinationRoute);

            // Now start the animation with both routes ready
            animateJourney(driverToPickupRoute, randomDriverPos, pickup, true, pickupToDestinationRoute);
        }).catch((error) => {
            console.error("Error calculating routes:", error);
        });
    };

    const animateJourney = (routeResult, startPos, endPos, isGoingToPickup, nextRoute = null) => {
        const overviewPath = routeResult.routes[0].overview_path;
        const routePath = overviewPath.map(p => ({ lat: p.lat(), lng: p.lng() }));

        if (routePath.length > 0) {
            const segments = [];
            let cumulative = 0;
            for (let i = 0; i < routePath.length - 1; i++) {
                const start = routePath[i];
                const end = routePath[i + 1];
                const length = haversineMeters(start, end);
                if (length === 0) continue;
                segments.push({ start, end, length, cumulativeStart: cumulative, cumulativeEnd: cumulative + length });
                cumulative += length;
            }
            routeMetricsRef.current = { totalDistance: cumulative, segments };
            setTaxiPosition(startPos);

            const speed = 200; // meters per second (ประมาณ 72 km/h)
            const animate = (timestamp) => {
                if (!animationRef.current.startTime) animationRef.current.startTime = timestamp;
                const elapsed = (timestamp - animationRef.current.startTime) / 1000;
                const travelled = Math.min(elapsed * speed, routeMetricsRef.current.totalDistance);

                const { segments: segs, totalDistance } = routeMetricsRef.current;
                if (travelled >= totalDistance) {
                    setTaxiPosition(endPos);
                    // อัพเดทเวลาเป็น 0 เมื่อถึงจุดหมาย
                    setDurationText("0 sec");

                    // If we just arrived at pickup, now go to destination
                    if (isGoingToPickup && nextRoute) {
                        setIsPickingUp(false);
                        setDirections(nextRoute); // Switch to pickup -> destination route

                        // Send pickup confirmation message
                        if (!pickupMessageSentRef.current) {
                            pickupMessageSentRef.current = true;
                            const pickupMessage = 'ผมได้รับคุณเรียบร้อยแล้วครับ กำลังนำท่านไปยังปลายทางตามที่ต้องการ';
                            setChatMessages(prev => [...prev, {
                                sender: 'driver',
                                text: pickupMessage
                            }]);

                            if (!isChatOpenRef.current) {
                                setUnreadMessageCount(prev => prev + 1);
                            }

                            // สร้าง notification เมื่อมาถึง pickup
                            if (driverInfo?.name && !notificationRefs.current.arrivedPickup) {
                                notificationRefs.current.arrivedPickup = true;
                                createNotification({
                                    name: driverInfo.name,
                                    status: 'Arrived',
                                    detail: `Arrived at ${pickup?.address || 'pickup location'}.`,
                                    type: 'arrival'
                                });
                            }
                        }

                        animationRef.current = { frameId: null, startTime: null };
                        setTimeout(() => {
                            animateJourney(nextRoute, pickup, destination, false, null);
                        }, 1000); // Wait 1 second at pickup
                    } else if (!isGoingToPickup) {
                        // Arrived at destination - show review modal
                        if (!reviewModalShownRef.current) {
                            reviewModalShownRef.current = true;

                            // สร้าง notification เมื่อมาถึง destination
                            if (driverInfo?.name && !notificationRefs.current.arrivedDestination) {
                                notificationRefs.current.arrivedDestination = true;
                                createNotification({
                                    name: driverInfo.name,
                                    status: 'Arrived',
                                    detail: `Arrived at ${destination?.address || 'destination'}.`,
                                    type: 'arrival'
                                });
                            }

                            setTimeout(() => {
                                setShowReviewModal(true);
                            }, 1000); // Wait 1 second after arrival
                        }
                    }
                    return;
                }

                let currentSegment = segs.find(s => travelled >= s.cumulativeStart && travelled <= s.cumulativeEnd) || segs[segs.length - 1];
                const segmentDist = travelled - currentSegment.cumulativeStart;
                const ratio = segmentDist / currentSegment.length;
                const lat = currentSegment.start.lat + (currentSegment.end.lat - currentSegment.start.lat) * ratio;
                const lng = currentSegment.start.lng + (currentSegment.end.lng - currentSegment.start.lng) * ratio;

                const currentTaxiPos = { lat, lng };
                setTaxiPosition(currentTaxiPos);

                // คำนวณเส้นทางที่เหลือจากตำแหน่งปัจจุบันไปยังปลายทาง
                const remainingPath = [];
                let foundCurrentSegment = false;

                // หา segment ที่รถอยู่
                for (let i = 0; i < segs.length; i++) {
                    const seg = segs[i];
                    if (!foundCurrentSegment && travelled >= seg.cumulativeStart && travelled <= seg.cumulativeEnd) {
                        foundCurrentSegment = true;
                        // เพิ่มจุดปัจจุบัน
                        remainingPath.push(currentTaxiPos);
                        // ถ้ายังไม่ถึงจุดปลายของ segment นี้ ให้เพิ่มจุดปลาย
                        if (travelled < seg.cumulativeEnd) {
                            remainingPath.push(seg.end);
                        }
                    } else if (foundCurrentSegment) {
                        // เพิ่มจุดเริ่มต้นของ segment ถ้ายังไม่มีใน path
                        if (remainingPath.length === 0 ||
                            remainingPath[remainingPath.length - 1].lat !== seg.start.lat ||
                            remainingPath[remainingPath.length - 1].lng !== seg.start.lng) {
                            remainingPath.push(seg.start);
                        }
                        // เพิ่มจุดปลายของ segment
                        remainingPath.push(seg.end);
                    }
                }

                // เพิ่มจุดปลายทางถ้ายังไม่มี
                if (remainingPath.length > 0) {
                    const lastPoint = remainingPath[remainingPath.length - 1];
                    if (Math.abs(lastPoint.lat - endPos.lat) > 0.0001 || Math.abs(lastPoint.lng - endPos.lng) > 0.0001) {
                        remainingPath.push(endPos);
                    }
                } else {
                    // ถ้าไม่มี path ที่เหลือ ให้ใช้จุดปัจจุบันและจุดปลายทาง
                    remainingPath.push(currentTaxiPos);
                    remainingPath.push(endPos);
                }

                // Update native polyline directly
                if (trackingPolylineRef.current) {
                    trackingPolylineRef.current.setPath(remainingPath);
                }

                // คำนวณเวลาที่เหลือแบบ real-time จากระยะทางที่เหลือใน route
                const remainingDistance = totalDistance - travelled;
                const remainingTimeSeconds = remainingDistance / speed;
                const formattedTime = formatDuration(remainingTimeSeconds);
                setDurationText(formattedTime);

                // Lock cancel button when driver is within 200m of pickup (only during pickup phase)
                if (isGoingToPickup && pickup) {
                    const distanceToPickup = haversineMeters(currentTaxiPos, pickup);

                    // Send auto message when driver is within 300m (use ref for synchronous check)
                    if (distanceToPickup <= 300 && !autoMessageSentRef.current) {
                        autoMessageSentRef.current = true; // Set immediately to prevent duplicates
                        const nearMessage = 'สวัสดีครับ ผมกำลังเดินทางไปรับคุณอยู่ ใกล้ถึงแล้วครับ 🚕';
                        setChatMessages(prev => [...prev, {
                            sender: 'driver',
                            text: nearMessage
                        }]);

                        if (!isChatOpenRef.current) {
                            setUnreadMessageCount(prev => prev + 1);
                        }

                        // สร้าง notification เมื่อรถใกล้มาถึง pickup
                        if (driverInfo?.name && !notificationRefs.current.nearPickup) {
                            notificationRefs.current.nearPickup = true;
                            createNotification({
                                name: driverInfo.name,
                                status: 'Almost there',
                                detail: `${Math.round(distanceToPickup)}m to pickup location.`,
                                type: 'arrival'
                            });
                        }
                    }

                    if (distanceToPickup <= 200 && !isCancelLocked) {
                        setIsCancelLocked(true);
                    }
                }

                // ตรวจสอบระยะทางไปยัง destination เมื่อกำลังเดินทางไปปลายทาง
                if (!isGoingToPickup && destination) {
                    const distanceToDestination = haversineMeters(currentTaxiPos, destination);

                    // สร้าง notification เมื่อรถใกล้มาถึง destination (500m)
                    if (distanceToDestination <= 500 && !notificationRefs.current.nearDestination) {
                        notificationRefs.current.nearDestination = true;
                        if (driverInfo?.name) {
                            createNotification({
                                name: driverInfo.name,
                                status: 'Almost there',
                                detail: `${Math.round(distanceToDestination)}m to destination.`,
                                type: 'arrival'
                            });
                        }
                    }
                }

                animationRef.current.frameId = requestAnimationFrame(animate);
            };
            animationRef.current.frameId = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current.frameId) cancelAnimationFrame(animationRef.current.frameId);
            if (trackingPolylineRef.current) {
                trackingPolylineRef.current.setMap(null);
                trackingPolylineRef.current = null;
            }
        };
    }, []);

    // Cleanup polyline when leaving TRACKING step
    useEffect(() => {
        if (step !== 'TRACKING' && trackingPolylineRef.current) {
            trackingPolylineRef.current.setMap(null);
            // Don't nullify ref here as we might return to TRACKING, 
            // but simpler to just recreate or reset in startTrackingAnimation
            // Let's just hide it.
        } else if (step === 'TRACKING') {
            // Initialize native Polyline if needed
            if (!trackingPolylineRef.current && window.google && mapRef.current) {
                trackingPolylineRef.current = new window.google.maps.Polyline({
                    strokeColor: '#ECBD35',
                    strokeWeight: 6,
                    strokeOpacity: 1.0,
                    zIndex: 2,
                    map: mapRef.current
                });
            } else if (trackingPolylineRef.current) {
                // Reset existing polyline
                trackingPolylineRef.current.setPath([]);
                trackingPolylineRef.current.setMap(mapRef.current);
            }
        }
    }, [step]);

    const taxiIcon = useMemo(() => {
        if (!window.google) return null;
        return {
            url: '/images/Taxi.png',
            scaledSize: new window.google.maps.Size(48, 48),
            anchor: new window.google.maps.Point(24, 24),
        };
    }, []);


    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <Box sx={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", p: 3 }}>
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
                            กรุณาเข้าสู่ระบบเพื่อใช้บริการจองรถ
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/')}
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

            {/* Overlay ที่ block การใช้งานเมื่อยังไม่ได้ login */}
            {!isLoggedIn && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 10000,
                        pointerEvents: "auto",
                        bgcolor: "rgba(0,0,0,0.3)"
                    }}
                    onClick={() => setShowLoginModal(true)}
                />
            )}

            {/* --- SHARED MAP BACKGROUND --- */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={mapCenter}
                    onLoad={map => mapRef.current = map}
                    onClick={step === 'PICKUP_MAP' && isLoggedIn && mapSelectingMode ? handleMapClick : undefined}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: step === 'PICKUP_MAP' && isLoggedIn,
                        draggable: isLoggedIn,
                        styles: mapStyles
                    }}
                >
                    {/* Markers based on step */}
                    {step === 'PICKUP_MAP' && selectedMapLocation && <Marker position={selectedMapLocation} />}

                    {/* แสดงเส้นทางเต็มสำหรับ CHOOSE_RIDE และ PROCESSING */}
                    {(step === 'CHOOSE_RIDE' || step === 'PROCESSING') && directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                    strokeColor: '#ECBD35', // สีเหลือง
                                    strokeWeight: 6, // ความหนา
                                    strokeOpacity: 1.0, // ความเข้ม
                                    zIndex: 1
                                }
                            }}
                        />
                    )}

                    {/* Custom Markers for CHOOSE_RIDE and PROCESSING */}
                    {(step === 'CHOOSE_RIDE' || step === 'PROCESSING') && directions && (
                        <>
                            {/* Pickup Marker - Yellow Dot */}
                            <Marker
                                position={pickup}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: "#ECBD35",
                                    fillOpacity: 1,
                                    strokeColor: "#000000",
                                    strokeWeight: 2,
                                }}
                                zIndex={2}
                            />

                            {/* Destination Marker - Black Dot with Duration */}
                            <OverlayView
                                position={destination}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)' }}>
                                    {/* Dot */}
                                    <Box sx={{ width: 16, height: 16, bgcolor: "black", borderRadius: "50%", border: "2px solid white", boxShadow: 2 }} />

                                    {/* Duration Text */}
                                    <Box sx={{ mt: 0.5, bgcolor: "white", px: 1, py: 0.5, borderRadius: 1, boxShadow: 1, whiteSpace: 'nowrap' }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: "bold", color: "#000" }}>
                                            {directions.routes[0].legs[0].duration.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            </OverlayView>
                        </>
                    )}

                    {/* แสดงเส้นทางที่เหลือสำหรับ TRACKING */}
                    {step === 'TRACKING' && directions && (
                        <>
                            {/* Native Polyline is handled via ref */}
                        </>
                    )}

                    {step === 'TRACKING' && (
                        <>
                            {isPickingUp && driverPosition && <Marker position={driverPosition} label="D" />}

                            {/* Pickup Marker - Yellow Dot */}
                            {pickup && (
                                <Marker
                                    position={pickup}
                                    icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 8,
                                        fillColor: "#ECBD35",
                                        fillOpacity: 1,
                                        strokeColor: "#000000",
                                        strokeWeight: 2,
                                    }}
                                    zIndex={2}
                                />
                            )}

                            {/* Destination Marker - Black Dot with Duration */}
                            {destination && (
                                <OverlayView
                                    position={destination}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                >
                                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translate(-50%, -50%)' }}>
                                        {/* Dot */}
                                        <Box sx={{ width: 16, height: 16, bgcolor: "black", borderRadius: "50%", border: "2px solid white", boxShadow: 2 }} />

                                        {/* Duration Text */}
                                        {/* Duration Text - Only show after pickup */}
                                        {!isPickingUp && (
                                            <Box sx={{ mt: 0.5, bgcolor: "white", px: 1, py: 0.5, borderRadius: 1, boxShadow: 1, whiteSpace: 'nowrap' }}>
                                                <Typography sx={{ fontSize: 12, fontWeight: "bold", color: "#000" }}>
                                                    {durationText}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </OverlayView>
                            )}

                            {taxiPosition && <Marker position={taxiPosition} icon={taxiIcon} zIndex={999} />}
                        </>
                    )}
                </GoogleMap>
            </Box>

            {/* --- HEADER (Shared) --- */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, zIndex: 10, position: 'relative', pointerEvents: 'none' }}>
                <Box sx={{ pointerEvents: 'auto' }}>
                    <IconButton
                        onClick={() => {
                            if (step === 'INPUT') navigate(-1);
                            else if (step === 'PICKUP_MAP') setStep('INPUT');
                            else if (step === 'CHOOSE_RIDE') setStep('INPUT');
                            else if (step === 'PROCESSING') setStep('CHOOSE_RIDE');
                            else if (step === 'TRACKING') setStep('INPUT');
                        }}
                        sx={{ bgcolor: "white", borderRadius: "50%", width: 39, height: 39, border: "1.5px solid #D3D3D3", "&:hover": { bgcolor: "#f0f0f0" }, mr: 2, color: "black", boxShadow: 1 }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <Box component="span" sx={{ color: "#ECBD35", WebkitTextStroke: "1px black", fontWeight: "bold", fontSize: 24, mr: 1 }}>THUNDER</Box>
                    <Box component="span" sx={{ color: "black", fontSize: 24 }}>RIDE</Box>
                </Typography>

                <Box sx={{ pointerEvents: 'auto', display: 'flex' }}>
                    <IconButton onClick={() => navigate("/notifications")} sx={{ bgcolor: "white", borderRadius: "50%", width: 30, height: 30, "&:hover": { bgcolor: "#f0f0f0" }, mr: 1, color: "#ECBD35", boxShadow: 1 }}>
                        <NotificationsIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton onClick={() => navigate("/profile")} sx={{ bgcolor: "white", borderRadius: "50%", width: 40, height: 40, "&:hover": { bgcolor: "#f0f0f0" }, color: "#ECBD35", boxShadow: 1 }}>
                        <PersonIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                </Box>
            </Box>


            {/* --- STEP CONTENT OVERLAYS --- */}

            {/* 1. INPUT STEP */}
            {step === 'INPUT' && (
                <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 2, mt: "auto", zIndex: 10, position: 'relative' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Call a Car</Typography>

                    {/* Pickup */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Autocomplete onLoad={ref => pickupAutoRef.current = ref} onPlaceChanged={() => handlePlaceChanged('pickup')} options={{ componentRestrictions: { country: "th" } }}>
                            <TextField
                                value={pickupInput}
                                onChange={(e) => setPickupInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                placeholder="Pickup Location"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ECBD35" }} /></InputAdornment>,
                                    endAdornment: <InputAdornment position="end"><IconButton onClick={getCurrentLocation}><NearMeIcon sx={{ color: "#ECBD35" }} /></IconButton></InputAdornment>,
                                    sx: { borderRadius: 2, bgcolor: "#f9f9f9" }
                                }}
                            />
                        </Autocomplete>
                    </Box>

                    {/* Destination */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Autocomplete onLoad={ref => destAutoRef.current = ref} onPlaceChanged={() => handlePlaceChanged('destination')} options={{ componentRestrictions: { country: "th" } }}>
                            <TextField
                                value={destinationInput}
                                onChange={(e) => setDestinationInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                placeholder="Destination"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#000" }} /></InputAdornment>,
                                    sx: { borderRadius: 2, bgcolor: "#f9f9f9" }
                                }}
                            />
                        </Autocomplete>
                    </Box>

                    <Box onClick={handleOpenMap} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, cursor: "pointer" }}>
                        <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PlaceIcon sx={{ color: "#ECBD35", fontSize: 20 }} />
                        </Box>
                        <Typography sx={{ fontWeight: "bold", color: "#555" }}>Set location on map</Typography>
                    </Box>

                    {pickup && destination && (
                        <Box onClick={handleNextToChooseRide} sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ECBD35", borderRadius: 2, cursor: "pointer", height: 45, "&:hover": { bgcolor: "#d3a32e" } }}>
                            <Typography sx={{ fontWeight: "bold", color: "#000", fontSize: 18 }}>Next</Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* 2. PICKUP MAP STEP */}
            {step === 'PICKUP_MAP' && (
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
                    {/* Header showing what we're selecting */}
                    <Box sx={{ bgcolor: 'white', p: 2, borderTopLeftRadius: 3, borderTopRightRadius: 3, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                            {mapSelectingMode === 'pickup' ? 'เลือกจุดต้นทาง' : mapSelectingMode === 'destination' ? 'เลือกจุดปลายทาง' : 'เลือกตำแหน่งบนแผนที่'}
                        </Typography>

                        {/* Mode selector buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Box
                                onClick={() => {
                                    setMapSelectingMode('pickup');
                                    setSelectedMapLocation(null);
                                    if (pickup) {
                                        setMapCenter({ lat: pickup.lat, lng: pickup.lng });
                                    }
                                }}
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    bgcolor: mapSelectingMode === 'pickup' ? '#FFF3C4' : '#f0f0f0',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    border: mapSelectingMode === 'pickup' ? '2px solid #ECBD35' : '1px solid #ddd',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Typography sx={{ fontWeight: 'bold', fontSize: 14, color: mapSelectingMode === 'pickup' ? '#000' : '#666' }}>
                                    ต้นทาง
                                </Typography>
                            </Box>
                            <Box
                                onClick={() => {
                                    setMapSelectingMode('destination');
                                    setSelectedMapLocation(null);
                                    if (destination) {
                                        setMapCenter({ lat: destination.lat, lng: destination.lng });
                                    } else if (pickup) {
                                        setMapCenter({ lat: pickup.lat, lng: pickup.lng });
                                    }
                                }}
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    bgcolor: mapSelectingMode === 'destination' ? '#FFF3C4' : '#f0f0f0',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    border: mapSelectingMode === 'destination' ? '2px solid #ECBD35' : '1px solid #ddd',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Typography sx={{ fontWeight: 'bold', fontSize: 14, color: mapSelectingMode === 'destination' ? '#000' : '#666' }}>
                                    ปลายทาง
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ bgcolor: 'white', px: 3, pb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Box
                            onClick={() => {
                                setStep('INPUT');
                                setMapSelectingMode(null);
                                setSelectedMapLocation(null);
                            }}
                            sx={{
                                p: 2,
                                bgcolor: '#ddd',
                                borderRadius: 2,
                                cursor: 'pointer',
                                minWidth: 100,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            ยกเลิก
                        </Box>
                        <Box
                            onClick={handleConfirmMapSelection}
                            sx={{
                                p: 2,
                                bgcolor: selectedMapLocation ? '#ECBD35' : '#ccc',
                                borderRadius: 2,
                                cursor: selectedMapLocation ? 'pointer' : 'not-allowed',
                                fontWeight: 'bold',
                                minWidth: 150,
                                textAlign: 'center',
                                opacity: selectedMapLocation ? 1 : 0.6
                            }}
                        >
                            ยืนยันตำแหน่ง
                        </Box>
                    </Box>
                </Box>
            )}

            {/* 3. CHOOSE RIDE STEP */}
            {step === 'CHOOSE_RIDE' && (
                <Box sx={{ bgcolor: "white", borderRadius: 3, p: 2, boxShadow: 2, mt: "auto", zIndex: 10, position: 'relative', maxHeight: '50vh', overflowY: 'auto' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", fontSize: 20 }}>Choose your ride</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {rides.map((ride) => {
                            const isSelected = selectedRides.some(r => r.id === ride.id);
                            return (
                                <Box
                                    key={ride.id}
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelectedRides(selectedRides.filter(r => r.id !== ride.id));
                                        } else {
                                            setSelectedRides([...selectedRides, ride]);
                                        }
                                    }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        bgcolor: isSelected ? "#FFF3C4" : "#F9F9F9",
                                        borderRadius: 2,
                                        p: 1.5,
                                        border: isSelected ? "2px solid #ECBD35" : "1px solid #ddd",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <img src={ride.image} alt={ride.name} style={{ width: 60, height: 35, objectFit: "contain" }} />
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>{ride.name}</Typography>
                                                {ride.rarityApplied && (
                                                    <Typography sx={{ fontSize: 10, color: '#FF6B35', fontWeight: 'bold', bgcolor: '#FFF3E0', px: 0.5, borderRadius: 1 }}>
                                                        SURGE
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: ride.rarityApplied ? '#FF6B35' : '#000' }}>
                                                ฿{ride.price}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <PersonIconSmall sx={{ fontSize: 14, color: '#555' }} />
                                                    <Typography sx={{ fontSize: 12, color: '#555' }}>{ride.passengers}</Typography>
                                                </Box>
                                                {ride.distance && (
                                                    <Typography sx={{ fontSize: 11, color: '#888' }}>• {ride.distance}</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                    {isSelected ? <CheckBoxIcon sx={{ color: "#ECBD35" }} /> : <CheckBoxOutlineBlankIcon sx={{ color: "#ccc" }} />}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Payment Box */}
                    <Box onClick={() => setShowPaymentModal(true)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #ddd", borderRadius: 2, px: 1, py: 0.5, width: '100%', mt: 1, bgcolor: "#f9f9f9", cursor: "pointer", "&:hover": { bgcolor: "#FFF8DC" } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <img src={selectedPayment.image} alt={selectedPayment.name} style={{ width: selectedPayment.id <= 2 ? 50 : 30, height: selectedPayment.id <= 2 ? 35 : 30, borderRadius: 5, objectFit: "contain" }} />
                            <Typography sx={{ fontSize: 15, color: "#555" }}>{selectedPayment.name}</Typography>
                        </Box>
                        {selectedPayment.showIcon && <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "#555" }} />}
                    </Box>

                    <Box onClick={handleConfirmRide} sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ECBD35", borderRadius: 1, cursor: "pointer", height: 35, "&:hover": { bgcolor: "#d3a32e" } }}>
                        <Typography sx={{ fontWeight: "bold", color: "#000", fontSize: 16 }}>Confirm</Typography>
                    </Box>
                </Box>
            )}

            {/* 4. PROCESSING STEP */}
            {step === 'PROCESSING' && (
                <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 2, mt: "auto", zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: 20 }}>Connecting you to a driver</Typography>
                    <Box sx={{ width: "115%", height: 5, borderRadius: 5, bgcolor: "#fff4d4", mt: 1, overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right, #ECBD35)", transition: "width 0.05s linear" }} />
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                        <img src="/images/profile.png" alt="Profile" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover" }} />
                    </Box>
                    <Box onClick={() => setStep('CHOOSE_RIDE')} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 0.5, cursor: "pointer" }}>
                        <img src="/images/cancelride.png" alt="Cancel Ride" style={{ width: 50, height: 50, objectFit: "contain" }} />
                        <Typography sx={{ mt: 0.1, fontWeight: "bold", color: "#555" }}>Cancel ride</Typography>
                    </Box>
                    <Box sx={{ width: "115%", height: 7, bgcolor: "#ccc", borderRadius: 1, mt: 0.5 }} />

                    {/* My Route */}
                    <Box sx={{ width: "100%", pl: 1 }}>
                        <Typography sx={{ mt: 0.5, fontWeight: "bold", color: "#555", fontSize: 20 }}>My route</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <RadioButtonCheckedIcon sx={{ color: "#ECBD35", fontSize: 18 }} />
                                    <Box sx={{ width: 2, height: 40, bgcolor: "#ccc" }} />
                                </Box>
                                <Typography sx={{ fontWeight: "bold", color: "#555", fontSize: 15, mt: 0.5, wordBreak: 'break-word' }}>{pickup?.address}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0 }}>
                                <RadioButtonUncheckedIcon sx={{ color: "#ccc", fontSize: 18 }} />
                                <Typography sx={{ fontWeight: "bold", color: "#555", fontSize: 15, wordBreak: 'break-word' }}>{destination?.address}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* 5. TRACKING STEP */}
            {step === 'TRACKING' && (
                <Box sx={{ bgcolor: "white", borderRadius: 3, p: 3, boxShadow: 2, mt: "auto", zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <img src="/images/profile.png" alt="Driver" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "#555" }}>
                                        {driverInfo?.name || "กำลังโหลด..."}
                                    </Typography>
                                    {driverInfo?.rating && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <StarRateIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                                            <Typography sx={{ fontSize: 20, fontWeight: "bold", color: "#555" }}>
                                                {driverInfo.rating}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                {driverInfo?.licensePlate && (
                                    <Typography sx={{ fontSize: 12, color: "#888", mt: 0.5 }}>
                                        ทะเบียน: {driverInfo.licensePlate}
                                    </Typography>
                                )}
                                {driverInfo?.vehicleModel && (
                                    <Typography sx={{ fontSize: 12, color: "#555", fontWeight: "bold" }}>
                                        {driverInfo.vehicleModel} {driverInfo.vehicleColor && `(${driverInfo.vehicleColor})`}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        {/* ราคา */}
                        {selectedRide && (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                <Typography sx={{ fontSize: 12, color: "#888", mb: 0.5 }}>
                                    ราคาโดยประมาณ
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Typography sx={{ fontSize: 24, fontWeight: "bold", color: selectedRide.rarityApplied ? "#FF6B35" : "#000" }}>
                                        ฿{selectedRide.price}
                                    </Typography>
                                    {selectedRide.rarityApplied && (
                                        <Typography sx={{ fontSize: 10, color: '#FF6B35', fontWeight: 'bold', bgcolor: '#FFF3E0', px: 0.5, borderRadius: 1 }}>
                                            SURGE
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Typography sx={{ fontSize: 20, color: "#000", mt: 0.1, mb: 0.5, alignSelf: "flex-start", pl: 1 }}>
                        {isPickingUp
                            ? `คนขับกำลังเดินทางมาหาคุณ (${durationText || "กำลังคำนวณ..."})`
                            : `กำลังเดินทางไปยังปลายทาง (${durationText || "กำลังคำนวณ..."})`}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 1 }}>
                        <Box onClick={() => setShowChatOverlay(true)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ECBD35", borderRadius: 2, cursor: "pointer", height: 35, flexBasis: "32%", "&:hover": { bgcolor: "#d3a32e" }, position: "relative" }}>
                            <ChatBubbleIcon sx={{ color: "#fff", mr: 1 }} />
                            <Typography sx={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Chat</Typography>
                            {unreadMessageCount > 0 && (
                                <Box sx={{ position: "absolute", top: -5, right: -5, bgcolor: "red", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>
                                    {unreadMessageCount}
                                </Box>
                            )}
                        </Box>
                        <Box onClick={() => setShowCallOverlay(true)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#ECBD35", borderRadius: 2, cursor: "pointer", height: 35, flexBasis: "32%", "&:hover": { bgcolor: "#999" } }}>
                            <LocalPhoneIcon sx={{ color: "#fff", mr: 1 }} />
                            <Typography sx={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Call</Typography>
                        </Box>
                        <Box
                            onClick={() => !isCancelLocked && setShowCancelModal(true)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: isCancelLocked ? "#999" : "#EE4426",
                                borderRadius: 2,
                                cursor: isCancelLocked ? "not-allowed" : "pointer",
                                height: 35,
                                flexBasis: "30%",
                                "&:hover": { bgcolor: isCancelLocked ? "#999" : "#d33b20" },
                                opacity: isCancelLocked ? 0.6 : 1,
                                position: "relative"
                            }}
                            title={isCancelLocked ? "Cannot cancel - driver is nearby" : "Cancel ride"}
                        >
                            <Typography sx={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Cancel</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
                    <Box sx={{ backgroundColor: "white", borderRadius: 3, p: 3, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <img src="/images/cancelride.png" alt="Cancel Ride" style={{ width: 80, height: 80 }} />
                        <Typography sx={{ fontSize: 20, fontWeight: "bold", mt: 0.5 }}>Cancel ride</Typography>
                        <Box sx={{ display: "flex", gap: 1, width: "100%", mt: 1 }}>
                            <Box onClick={() => { setShowCancelModal(false); setStep('INPUT'); }} sx={{ flex: 1, backgroundColor: "#EE4426", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 2, fontSize: "16px", height: 35, fontWeight: "bold", cursor: "pointer", "&:hover": { backgroundColor: "#d33b20" } }}>Confirm</Box>
                            <Box onClick={() => setShowCancelModal(false)} sx={{ flex: 1, backgroundColor: "#E6E6E6", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 2, fontSize: "16px", height: 35, cursor: "pointer", fontWeight: "bold", "&:hover": { backgroundColor: "#bfbfbf" } }}>Cancel</Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Payment Method Selection Modal */}
            {showPaymentModal && (
                <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
                    <Box sx={{ backgroundColor: "white", borderRadius: 3, p: 2, width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", fontSize: 20 }}>Choose Payment Method</Typography>

                        {paymentOptions.map((option) => (
                            <Box
                                key={option.id}
                                onClick={() => {
                                    setSelectedPayment(option);
                                    setShowPaymentModal(false);
                                }}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "60px 1fr 20px",
                                    alignItems: "center",
                                    backgroundColor: selectedPayment.id === option.id ? "#FFF3C4" : "#F9F9F9",
                                    borderRadius: 2,
                                    p: 1.5,
                                    border: selectedPayment.id === option.id ? "2px solid #ECBD35" : "1px solid #ddd",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#FFF8DC" }
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <img src={option.image} alt={option.name} style={{ width: 40, height: 35, borderRadius: 5, objectFit: "contain" }} />
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>{option.name}</Typography>
                                    {option.subText && <Typography sx={{ fontSize: 12, color: "#555", mt: 0.5 }}>{option.subText}</Typography>}
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {option.showIcon && <KeyboardArrowRightIcon sx={{ fontSize: 20, color: "#555" }} />}
                                </Box>
                            </Box>
                        ))}

                        <Box onClick={() => setShowPaymentModal(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#E6E6E6", borderRadius: 1, cursor: "pointer", height: 40, "&:hover": { backgroundColor: "#bfbfbf" }, mt: 1 }}>
                            <Typography sx={{ fontWeight: "bold", color: "#000" }}>Cancel</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Chat Overlay */}
            {showChatOverlay && (
                <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 10000 }}>
                    {/* Header */}
                    <Box sx={{ position: "relative", bgcolor: "white", p: 2 }}>
                        <IconButton onClick={() => setShowChatOverlay(false)} sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", backgroundColor: "white", borderRadius: "50%", width: 39, height: 39, border: "1.5px solid #D3D3D3", "&:hover": { backgroundColor: "#f0f0f0" }, color: "black" }}>
                            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Box component="img" src="/images/call1.png" alt="call" onClick={() => { setShowChatOverlay(false); setShowCallOverlay(true); }} sx={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 50, height: 55, cursor: "pointer" }} />
                        <Box sx={{ textAlign: "center" }}>
                            <Box component="img" src="/images/profile1.png" alt="profile" sx={{ width: 60, height: 60, borderRadius: "50%", mx: "auto" }} />
                            <Box sx={{ fontSize: 16, fontWeight: "bold", mt: 1 }}>
                                {driverInfo?.name || "กำลังโหลด..."}
                            </Box>
                            {driverInfo?.licensePlate && (
                                <Box sx={{ fontSize: 12, color: "#888", mt: 0.5 }}>
                                    {driverInfo.licensePlate}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Chat messages area */}
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                        {chatMessages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1.5,
                                    bgcolor: msg.sender === 'driver' ? "#E8E8E8" : "#ECBD35",
                                    borderRadius: 5,
                                    alignSelf: msg.sender === 'driver' ? "flex-start" : "flex-end",
                                    maxWidth: "80%",
                                    display: "inline-block",
                                    wordBreak: "break-word"
                                }}
                            >
                                <Typography sx={{ color: msg.sender === 'driver' ? "#000" : "#fff", fontSize: 14 }}>{msg.text}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Bottom input area */}
                    <Box sx={{ display: "flex", alignItems: "center", p: 1, bgcolor: "white", gap: 1 }}>
                        <IconButton sx={{ bgcolor: "#8C8C8C", color: "white", width: 22, height: 22, "&:hover": { bgcolor: "#707070" } }}>
                            <AddIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                        <TextField
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleChatKeyPress}
                            fullWidth
                            variant="outlined"
                            placeholder=""
                            sx={{
                                height: 36,
                                "& .MuiOutlinedInput-root": {
                                    height: "100%",
                                    bgcolor: "#fff",
                                    borderRadius: 20,
                                    "& fieldset": { borderColor: "#C8C8CC" },
                                    "&:hover fieldset": { borderColor: "#C8C8CC" },
                                    "&.Mui-focused fieldset": { borderColor: "#C8C8CC" },
                                    paddingRight: 0,
                                },
                                input: { padding: "6px 12px", height: "100%", boxSizing: "border-box" },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Box component="img" src="/images/micro.png" alt="micro" sx={{ width: 25, height: 25, cursor: "pointer", mr: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            )}

            {/* Call Overlay */}
            {showCallOverlay && (
                <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
                    <Box sx={{ backgroundColor: "#fff", borderRadius: 3, p: 3, width: 300, textAlign: "center" }}>
                        <Box component="img" src="/images/call.png" alt="call" sx={{ width: 75, height: 60, mx: "auto", mb: 0.5 }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
                            Call {driverInfo?.name || "กำลังโหลด..."}
                        </Typography>
                        {driverInfo?.licensePlate && (
                            <Typography sx={{ fontSize: 16, color: "#22232F", mt: 0.5, fontWeight: "bold" }}>
                                ({driverInfo.licensePlate})
                            </Typography>
                        )}
                        {driverInfo?.phoneNumber && (
                            <Typography sx={{ fontSize: 16, color: "#22232F", mt: 0.5, fontWeight: "bold" }}>
                                {driverInfo.phoneNumber}
                            </Typography>
                        )}
                        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                            <Button fullWidth variant="contained" sx={{ backgroundColor: "#ECBD35", color: "#000", fontWeight: "bold", "&:hover": { backgroundColor: "#d6a92f" } }} onClick={() => alert("Calling...")}>
                                Call
                            </Button>
                            <Button fullWidth variant="contained" sx={{ backgroundColor: "#EDEDED", color: "#000", fontWeight: "bold", "&:hover": { backgroundColor: "#dcdcdc" } }} onClick={() => setShowCallOverlay(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Review Modal - STEP 1: Review Question */}
            {showReviewModal && reviewStep === "review" && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10001,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 3,
                            p: 3,
                            width: 320,
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                            Review
                        </Typography>
                        <Typography sx={{ fontSize: 16, color: "#666", mt: 1 }}>
                            Do you want to rate {driverInfo?.name || "คนขับ"} ?
                        </Typography>

                        <Box
                            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#EDEDED",
                                    color: "#000",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#dcdcdc" },
                                }}
                                onClick={() => setReviewStep("tip")}
                            >
                                No
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#ECBD35",
                                    color: "#000",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#d6a92f" },
                                }}
                                onClick={() => setReviewStep("rate")}
                            >
                                Yes
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Review Modal - STEP 2: Tip */}
            {showReviewModal && reviewStep === "tip" && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10001,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 3,
                            p: 3,
                            width: 340,
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                            Would you like to tip the driver?
                        </Typography>

                        {/* Amount + Quick Buttons */}
                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
                                Amount (THB)
                            </Typography>
                            {["10", "20", "50", "100"].map((amount) => (
                                <Box
                                    key={amount}
                                    onClick={() => {
                                        setSelectedTip(amount);
                                        setCustomTip(amount);
                                    }}
                                    sx={{
                                        border: "1px solid #AFAFAF",
                                        borderRadius: 2,
                                        px: 0.7,
                                        py: 0.5,
                                        color: selectedTip === amount ? "#000" : "#AFAFAF",
                                        bgcolor: selectedTip === amount ? "#F9E6A2" : "#fff",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        fontSize: 14,
                                    }}
                                >
                                    ฿{amount}
                                </Box>
                            ))}
                        </Box>

                        {/* Custom Tip Input */}
                        <TextField
                            variant="outlined"
                            value={customTip}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                setCustomTip(onlyNumbers);
                            }}
                            placeholder="฿00.00"
                            fullWidth
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            sx={{
                                mt: 2,
                                "& .MuiOutlinedInput-root": {
                                    height: 45,
                                    bgcolor: "#fff",
                                    borderRadius: 2,
                                    border: "1px solid #AFAFAF",
                                    pr: 1,
                                },
                                "& .MuiOutlinedInput-input": {
                                    textAlign: "right",
                                    color: "#AFAFAF",
                                    fontWeight: "bold",
                                },
                            }}
                        />

                        {/* Buttons */}
                        <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: "#ECBD35",
                                    color: "#000",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    "&:hover": { backgroundColor: "#d6a92f" },
                                }}
                                onClick={handleReviewConfirm}
                            >
                                Confirm
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: "#EDEDED",
                                    color: "#000",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    "&:hover": { backgroundColor: "#dcdcdc" },
                                }}
                                onClick={handleReviewConfirm}
                            >
                                Skip
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Review Modal - STEP 3: Rate */}
            {showReviewModal && reviewStep === "rate" && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        zIndex: 10001,
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "100%",
                            bgcolor: "#fff",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            p: 3,
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                            Review
                        </Typography>

                        {/* Star Image */}
                        <Box
                            component="img"
                            src="/images/star.png"
                            alt="stars"
                            sx={{ width: 120, height: 100, mx: "auto", mt: 1 }}
                        />

                        {/* Profile + Name + Stars */}
                        <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 2 }}>
                            <Box
                                component="img"
                                src="/images/profile.png"
                                alt="profile"
                                sx={{ width: 95, height: 80, borderRadius: "50%", flexShrink: 0 }}
                            />
                            <Box sx={{ textAlign: "left", flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: "bold", fontSize: 18, pl: 0.7 }}>
                                    {driverInfo?.name || "คนขับ"}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                    {[1, 2, 3, 4, 5].map((num) =>
                                        num <= rating ? (
                                            <StarIcon
                                                key={num}
                                                onClick={() => setRating(num)}
                                                sx={{ color: "#FFD700", cursor: "pointer" }}
                                            />
                                        ) : (
                                            <StarBorderIcon
                                                key={num}
                                                onClick={() => setRating(num)}
                                                sx={{ color: "#FFD700", cursor: "pointer" }}
                                            />
                                        )
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Reason */}
                        <Typography
                            sx={{ fontSize: 14, color: "#667080", mt: 2, textAlign: "left" }}
                        >
                            Write down the reason
                        </Typography>

                        <TextField
                            multiline
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Placeholder text"
                            fullWidth
                            minRows={3}
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "#EEF1F4",
                                    borderRadius: 2,
                                    border: "1px solid #EEF1F4",
                                    height: 125,
                                    boxSizing: "border-box",
                                    "&:hover fieldset": { borderColor: "#EEF1F4" },
                                },
                                input: {
                                    color: "#667080",
                                    padding: "8px",
                                    height: "100%",
                                    boxSizing: "border-box",
                                },
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: "#ECBD35",
                                color: "#000",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "#d6a92f" },
                            }}
                            onClick={() => setReviewStep("tip")}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            )}

        </Box>
    );
};

export default RideFlow;