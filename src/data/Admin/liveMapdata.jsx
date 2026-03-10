// data/liveMapdata.jsx - Updated with 25 passengers (no document verification)

import { ensureCurrentFareData, DEFAULT_FARE_SETTINGS } from '../../utils/Admin/fareDefaults';
import { calculateDistance } from '../../utils/Admin/FareCalculator';
import { getStoredDrivers, getStoredPassengers } from '../../utils/Admin/entityStore';

export const liveMapData = {
  drivers: {
    all: [
      {
        id: 'D001',
        name: 'Somchai Jaidee',
        phone: '+66 81 234 5678',
        gender: 'Male',
        vehicle: 'Toyota Vios',
        plateNumber: 'กข 1234 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'CAR',
        location: { lat: 13.7563, lng: 100.5018 },
        destination: 'Siam Paragon',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 4.8,
        totalRides: 245,
        earning: 45820.00,
        joinDate: '15 Jan 2024',
        lastActive: '17 Nov 2025',
        totalCompleted: 245,
        totalCanceled: 12,
        totalActiveHours: 1840,
        documentVerified: false,
        reviews: [
          { customer: 'สมชาย ใจดี', rating: 5, comment: 'ขับดีมาก สุภาพ', date: '16 Nov 2025' },
          { customer: 'วรรณา สุขใจ', rating: 4, comment: 'ดีครับ แต่ขับเร็วไปนิด', date: '15 Nov 2025' }
        ],
        warnings: [
          { date: '10 Nov 2025', reason: 'ขับรถเร็วเกินไป', reportBy: 'นางสาว อรุณ' }
        ],
        documents: {
          driverLicense: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Driver+License',
          publicDriverLicense: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Public+License',
          idCard: 'https://via.placeholder.com/600x380/667eea/ffffff?text=National+ID+Card',
          criminalRecord: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Criminal+Record',
          vehicleRegistration: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vehicle+Registration',
          compulsoryInsurance: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Compulsory+Insurance',
          commercialInsurance: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Commercial+Insurance',
          eSticker: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=E-Sticker'
        },
        rideHistory: [
          { date: '17 Nov 2025 14:30', from: 'Siam', to: 'Asiatique', fare: 250, status: 'Completed' },
          { date: '17 Nov 2025 12:15', from: 'MBK', to: 'Central World', fare: 180, status: 'Completed' },
          { date: '16 Nov 2025 18:45', from: 'Victory Monument', to: 'Don Mueang', fare: 420, status: 'Completed' }
        ]
      },
      {
        id: 'D002',
        name: 'Pornthip Saengfang',
        phone: '+66 82 345 6789',
        gender: 'Female',
        vehicle: 'Honda City',
        plateNumber: 'คง 5678 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7468, lng: 100.5326 },
        avatar: 'https://i.pravatar.cc/150?img=47',
        rating: 4.9,
        totalRides: 312,
        earning: 58920.00,
        documentVerified: true
      },
      {
        id: 'D003',
        name: 'Wanchai Pattana',
        phone: '+66 83 456 7890',
        gender: 'Male',
        vehicle: 'Honda Wave',
        plateNumber: 'จฉ 9012 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'BIKE',
        location: { lat: 13.7650, lng: 100.5380 },
        destination: 'MBK Center',
        avatar: 'https://i.pravatar.cc/150?img=33',
        rating: 4.5,
        totalRides: 189,
        earning: 28450.00,
        documentVerified: false ,
        documents: {
          driverLicense: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Driver+License',
          publicDriverLicense: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Public+License',
          idCard: 'https://via.placeholder.com/600x380/667eea/ffffff?text=National+ID+Card',
          criminalRecord: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Criminal+Record',
          vehicleRegistration: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vehicle+Registration',
          compulsoryInsurance: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Compulsory+Insurance',
          commercialInsurance: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Commercial+Insurance',
          eSticker: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=E-Sticker'
        },
      },
      {
        id: 'D004',
        name: 'Kiattisak Phothanut',
        phone: '+66 84 567 8901',
        gender: 'Male',
        vehicle: 'Toyota Commuter',
        plateNumber: 'ชซ 3456 กรุงเทพ',
        status: 'idle',
        licenseType: 'VAN',
        location: { lat: 13.7367, lng: 100.5608 },
        avatar: 'https://i.pravatar.cc/150?img=52',
        rating: 4.7,
        totalRides: 156,
        earning: 42380.00,
        documentVerified: true
      },
      {
        id: 'D005',
        name: 'Narong Suksai',
        phone: '+66 85 678 9012',
        gender: 'Male',
        vehicle: 'Mazda 2',
        plateNumber: 'ฌญ 7890 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'CAR',
        location: { lat: 13.7278, lng: 100.5240 },
        destination: 'Central World',
        avatar: 'https://i.pravatar.cc/150?img=61',
        rating: 4.6,
        totalRides: 198,
        earning: 36750.00,
        documentVerified: true
      },
      {
        id: 'D006',
        name: 'Surasak Moonsom',
        phone: '+66 86 789 0123',
        gender: 'Male',
        vehicle: 'Yamaha Fino',
        plateNumber: 'ฎฏ 1234 กรุงเทพ',
        status: 'idle',
        licenseType: 'BIKE',
        location: { lat: 13.7564, lng: 100.5015 },
        avatar: 'https://i.pravatar.cc/150?img=14',
        rating: 4.4,
        totalRides: 142,
        earning: 21890.00,
        documentVerified: true
      },
      {
        id: 'D007',
        name: 'Anon Chaiyaporn',
        phone: '+66 87 890 1234',
        gender: 'Male',
        vehicle: 'Nissan Almera',
        plateNumber: 'ฐฑ 5678 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'CAR',
        location: { lat: 13.7440, lng: 100.5314 },
        destination: 'Terminal 21',
        avatar: 'https://i.pravatar.cc/150?img=68',
        rating: 4.8,
        totalRides: 267,
        earning: 49630.00,
        documentVerified: true
      },
      {
        id: 'D008',
        name: 'Preecha Wongkaew',
        phone: '+66 88 901 2345',
        gender: 'Male',
        vehicle: 'Toyota Hiace',
        plateNumber: 'ฒณ 9012 กรุงเทพ',
        status: 'idle',
        licenseType: 'VAN',
        location: { lat: 13.7308, lng: 100.5418 },
        avatar: 'https://i.pravatar.cc/150?img=56',
        rating: 4.9,
        totalRides: 203,
        earning: 55420.00,
        documentVerified: true
      },
      {
        id: 'D009',
        name: 'Chalerm Krungthep',
        phone: '+66 89 012 3456',
        gender: 'Male',
        vehicle: 'Honda Click',
        plateNumber: 'ดต 3456 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'BIKE',
        location: { lat: 13.7593, lng: 100.5468 },
        destination: 'Chatuchak Market',
        avatar: 'https://i.pravatar.cc/150?img=15',
        rating: 4.3,
        totalRides: 178,
        earning: 26340.00,
        documentVerified: true
      },
      {
        id: 'D010',
        name: 'Thanawat Siriporn',
        phone: '+66 90 123 4567',
        gender: 'Male',
        vehicle: 'Mitsubishi Attrage',
        plateNumber: 'ถท 7890 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7240, lng: 100.4930 },
        avatar: 'https://i.pravatar.cc/150?img=69',
        rating: 4.7,
        totalRides: 221,
        earning: 41290.00,
        documentVerified: true
      },
      {
        id: 'D011',
        name: 'Sompong Rattana',
        phone: '+66 91 234 5678',
        gender: 'Male',
        vehicle: 'Honda Civic',
        plateNumber: 'ธน 2345 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'CAR',
        location: { lat: 13.7454, lng: 100.5331 },
        destination: 'Platinum Mall',
        avatar: 'https://i.pravatar.cc/150?img=32',
        rating: 4.6,
        totalRides: 189,
        earning: 35670.00,
        documentVerified: true
      },
      {
        id: 'D012',
        name: 'Ratchanee Boonmee',
        phone: '+66 92 345 6789',
        gender: 'Female',
        vehicle: 'Toyota Yaris',
        plateNumber: 'บป 3456 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7264, lng: 100.5176 },
        avatar: 'https://i.pravatar.cc/150?img=10',
        rating: 4.9,
        totalRides: 298,
        earning: 56890.00,
        documentVerified: true
      },
      {
        id: 'D013',
        name: 'Manit Prakong',
        phone: '+66 93 456 7890',
        gender: 'Male',
        vehicle: 'Honda PCX',
        plateNumber: 'ผฝ 4567 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'BIKE',
        location: { lat: 13.7563, lng: 100.5387 },
        destination: 'Siam Square',
        avatar: 'https://i.pravatar.cc/150?img=59',
        rating: 4.4,
        totalRides: 167,
        earning: 24890.00,
        documentVerified: false,
        documents: {
          driverLicense: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Driver+License',
          publicDriverLicense: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Public+License',
          idCard: 'https://via.placeholder.com/600x380/667eea/ffffff?text=National+ID+Card',
          criminalRecord: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Criminal+Record',
          vehicleRegistration: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vehicle+Registration',
          compulsoryInsurance: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Compulsory+Insurance',
          commercialInsurance: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Commercial+Insurance',
          eSticker: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=E-Sticker'
        },
      },
      {
        id: 'D014',
        name: 'Suda Kaewta',
        phone: '+66 94 567 8901',
        gender: 'Female',
        vehicle: 'Suzuki Swift',
        plateNumber: 'พฟ 5678 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7297, lng: 100.5636 },
        avatar: 'https://i.pravatar.cc/150?img=44',
        rating: 4.8,
        totalRides: 234,
        earning: 44520.00,
        documentVerified: true
      },
      {
        id: 'D015',
        name: 'Vichai Somchai',
        phone: '+66 95 678 9012',
        gender: 'Male',
        vehicle: 'Isuzu D-Max',
        plateNumber: 'ภม 6789 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'VAN',
        location: { lat: 13.7348, lng: 100.5511 },
        destination: 'Future Park',
        avatar: 'https://i.pravatar.cc/150?img=54',
        rating: 4.7,
        totalRides: 176,
        earning: 48930.00,
        documentVerified: false,
        documents: {
          driverLicense: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Driver+License',
          publicDriverLicense: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Public+License',
          idCard: 'https://via.placeholder.com/600x380/667eea/ffffff?text=National+ID+Card',
          criminalRecord: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Criminal+Record',
          vehicleRegistration: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vehicle+Registration',
          compulsoryInsurance: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Compulsory+Insurance',
          commercialInsurance: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Commercial+Insurance',
          eSticker: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=E-Sticker'
        },
      },
      {
        id: 'D016',
        name: 'Apinya Namsai',
        phone: '+66 96 789 0123',
        gender: 'Female',
        vehicle: 'Mazda CX-3',
        plateNumber: 'ยร 7890 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7417, lng: 100.5654 },
        avatar: 'https://i.pravatar.cc/150?img=25',
        rating: 4.9,
        totalRides: 287,
        earning: 53780.00,
        documentVerified: true
      },
      {
        id: 'D017',
        name: 'Boonmee Chaiya',
        phone: '+66 97 890 1234',
        gender: 'Male',
        vehicle: 'Yamaha Aerox',
        plateNumber: 'รล 8901 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'BIKE',
        location: { lat: 13.7598, lng: 100.5436 },
        destination: 'JJ Market',
        avatar: 'https://i.pravatar.cc/150?img=67',
        rating: 4.5,
        totalRides: 154,
        earning: 23110.00,
        documentVerified: false,
        documents: {
          driverLicense: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Driver+License',
          publicDriverLicense: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Public+License',
          idCard: 'https://via.placeholder.com/600x380/667eea/ffffff?text=National+ID+Card',
          criminalRecord: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Criminal+Record',
          vehicleRegistration: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vehicle+Registration',
          compulsoryInsurance: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Compulsory+Insurance',
          commercialInsurance: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Commercial+Insurance',
          eSticker: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=E-Sticker'
        },
      },
      {
        id: 'D018',
        name: 'Chanida Pimpa',
        phone: '+66 98 901 2345',
        gender: 'Female',
        vehicle: 'Honda Jazz',
        plateNumber: 'ฤว 9012 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7186, lng: 100.5288 },
        avatar: 'https://i.pravatar.cc/150?img=31',
        rating: 4.8,
        totalRides: 245,
        earning: 46330.00,
        documentVerified: true
      },
      {
        id: 'D019',
        name: 'Kritsada Wongsa',
        phone: '+66 99 012 3456',
        gender: 'Male',
        vehicle: 'Toyota Fortuner',
        plateNumber: 'ศษ 0123 กรุงเทพ',
        status: 'on-trip',
        licenseType: 'VAN',
        location: { lat: 13.7355, lng: 100.5398 },
        destination: 'EmQuartier',
        avatar: 'https://i.pravatar.cc/150?img=70',
        rating: 4.6,
        totalRides: 192,
        earning: 52140.00,
        documentVerified: true
      },
      {
        id: 'D020',
        name: 'Sasithorn Meesuk',
        phone: '+66 80 234 5678',
        gender: 'Female',
        vehicle: 'Nissan March',
        plateNumber: 'สห 1234 กรุงเทพ',
        status: 'idle',
        licenseType: 'CAR',
        location: { lat: 13.7273, lng: 100.5142 },
        avatar: 'https://i.pravatar.cc/150?img=28',
        rating: 4.7,
        totalRides: 209,
        earning: 39670.00,
        documentVerified: true
      }
    ],
    onTrip: [],
    idle: []
  },

  // 25 Passengers - NO documentVerified field
  passengers: [
    {
      id: 'P001',
      name: 'Gojo Satoru',
      phone: '+66 91 234 5678',
      email: 'strongest.sensei@domain.com',
      gender: 'Male',
      dateOfBirth: '07/12/1989',
      pickupDate: '30 November 2568',
      pickupTime: '14:30',
      pickupLocation: 'Siam Square',
      destination: 'Asiatique',
      licenseType: 'BUS',
      location: { lat: 13.7470, lng: 100.5325 },
      avatar: 'https://i.pravatar.cc/150?img=5',
      totalRides: 45,
      totalSpent: 12859.00,
      totalCanceled: 2,
      joinDate: '15 Jan 2024',
      lastActive: '17 Nov 2025',
      identityType: 'Passport',
      identityNumber: '0123456789',
      username: 'gojo_satoru'
    },
    {
      id: 'P002',
      name: 'Naruto Uchiha',
      phone: '+66 92 345 6789',
      email: 'naruto.uzumaki@domain.com',
      gender: 'Male',
      dateOfBirth: '10/10/1999',
      pickupDate: '30 November 2568',
      pickupTime: '15:45',
      pickupLocation: 'MBK Center',
      destination: 'Don Mueang Airport',
      licenseType: 'TAXI',
      location: { lat: 13.7445, lng: 100.5300 },
      avatar: 'https://i.pravatar.cc/150?img=8',
      totalRides: 20,
      totalSpent: 4234.00,
      totalCanceled: 1,
      joinDate: '20 Mar 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '1234567890123',
      username: 'naruto_hero'
    },
    {
      id: 'P003',
      name: 'Pornthip Saengthong',
      phone: '+66 93 456 7890',
      email: 'pornthip.s@domain.com',
      gender: 'Female',
      dateOfBirth: '15/05/1995',
      pickupDate: '30 November 2568',
      pickupTime: '16:00',
      pickupLocation: 'Central World',
      destination: 'Sukhumvit Road',
      licenseType: 'CAR',
      location: { lat: 13.7472, lng: 100.5398 },
      avatar: 'https://i.pravatar.cc/150?img=9',
      totalRides: 5,
      totalSpent: 459.00,
      totalCanceled: 0,
      joinDate: '10 Nov 2025',
      lastActive: '17 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'AB1234567',
      username: 'pornthip_user'
    },
    {
      id: 'P004',
      name: 'Luffy Nami',
      phone: '+66 94 567 8901',
      email: 'luffy.pirate@domain.com',
      gender: 'Male',
      dateOfBirth: '05/05/2000',
      pickupDate: '30 November 2568',
      pickupTime: '16:15',
      pickupLocation: 'Chatuchak Park',
      destination: 'Lumpini Park',
      licenseType: 'BIKE',
      location: { lat: 13.7995, lng: 100.5507 },
      avatar: 'https://i.pravatar.cc/150?img=11',
      totalRides: 58,
      totalSpent: 14951.00,
      totalCanceled: 3,
      joinDate: '01 Feb 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Driving License',
      identityNumber: 'DL987654321',
      username: 'luffy_king'
    },
    {
      id: 'P005',
      name: 'Somsri Sabylung',
      phone: '+66 95 678 9012',
      email: 'somsri.happy@domain.com',
      gender: 'Female',
      dateOfBirth: '22/08/1992',
      pickupDate: '30 November 2568',
      pickupTime: '16:30',
      pickupLocation: 'Ari Station',
      destination: 'Victory Monument',
      licenseType: 'VAN',
      location: { lat: 13.7789, lng: 100.5418 },
      avatar: 'https://i.pravatar.cc/150?img=20',
      totalRides: 36,
      totalSpent: 7941.00,
      totalCanceled: 2,
      joinDate: '15 Apr 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '9876543210987',
      username: 'somsri36'
    },
    {
      id: 'P006',
      name: 'Lion King',
      phone: '+66 96 789 0123',
      email: 'lion.king@domain.com',
      gender: 'Male',
      dateOfBirth: '11/11/1988',
      pickupDate: '30 November 2568',
      pickupTime: '16:45',
      pickupLocation: 'Thong Lor',
      destination: 'Ekkamai',
      licenseType: 'BIKE',
      location: { lat: 13.7308, lng: 100.5839 },
      avatar: 'https://i.pravatar.cc/150?img=13',
      totalRides: 23,
      totalSpent: 5824.00,
      totalCanceled: 1,
      joinDate: '05 May 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'LK7654321',
      username: 'lion_roar'
    },
    {
      id: 'P007',
      name: 'Manima Pattaya',
      phone: '+66 97 890 1234',
      email: 'manima.beach@domain.com',
      gender: 'Female',
      dateOfBirth: '25/03/1997',
      pickupDate: '30 November 2568',
      pickupTime: '17:00',
      pickupLocation: 'Phrom Phong',
      destination: 'Asoke',
      licenseType: 'CAR',
      location: { lat: 13.7305, lng: 100.5698 },
      avatar: 'https://i.pravatar.cc/150?img=23',
      totalRides: 17,
      totalSpent: 4209.00,
      totalCanceled: 0,
      joinDate: '20 Jun 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '5432167890123',
      username: 'manima_sea'
    },
    {
      id: 'P008',
      name: 'Apinya Wongsuk',
      phone: '+66 98 901 2345',
      email: 'apinya.happy@domain.com',
      gender: 'Female',
      dateOfBirth: '18/06/1993',
      pickupDate: '30 November 2568',
      pickupTime: '17:15',
      pickupLocation: 'Silom Road',
      destination: 'Sathorn Road',
      licenseType: 'TAXI',
      location: { lat: 13.7244, lng: 100.5336 },
      avatar: 'https://i.pravatar.cc/150?img=24',
      totalRides: 12,
      totalSpent: 3156.00,
      totalCanceled: 1,
      joinDate: '15 Aug 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'AP9876543',
      username: 'apinya_smile'
    },
    {
      id: 'P009',
      name: 'Suda Kaewta',
      phone: '+66 99 012 3456',
      email: 'suda.green@domain.com',
      gender: 'Female',
      dateOfBirth: '30/09/1991',
      pickupDate: '30 November 2568',
      pickupTime: '17:30',
      pickupLocation: 'Ratchada',
      destination: 'Huai Khwang',
      licenseType: 'VAN',
      location: { lat: 13.7614, lng: 100.5740 },
      avatar: 'https://i.pravatar.cc/150?img=25',
      totalRides: 28,
      totalSpent: 7234.00,
      totalCanceled: 2,
      joinDate: '10 Jul 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '6789054321098',
      username: 'suda_nature'
    },
    {
      id: 'P010',
      name: 'Vichai Somchai',
      phone: '+66 80 123 4567',
      email: 'vichai.power@domain.com',
      gender: 'Male',
      dateOfBirth: '12/12/1985',
      pickupDate: '30 November 2568',
      pickupTime: '17:45',
      pickupLocation: 'Hua Lamphong',
      destination: 'Chinatown',
      licenseType: 'BIKE',
      location: { lat: 13.7373, lng: 100.5168 },
      avatar: 'https://i.pravatar.cc/150?img=26',
      totalRides: 41,
      totalSpent: 10250.00,
      totalCanceled: 3,
      joinDate: '25 Mar 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Driving License',
      identityNumber: 'VC1234567890',
      username: 'vichai_strong'
    },
    {
      id: 'P011',
      name: 'Wanida Klong',
      phone: '+66 81 345 6789',
      email: 'wanida.river@domain.com',
      gender: 'Female',
      dateOfBirth: '08/04/1994',
      pickupDate: '30 November 2568',
      pickupTime: '18:00',
      pickupLocation: 'Sukhumvit Soi 11',
      destination: 'Suvarnabhumi Airport',
      licenseType: 'CAR',
      location: { lat: 13.7319, lng: 100.5614 },
      avatar: 'https://i.pravatar.cc/150?img=27',
      totalRides: 15,
      totalSpent: 3890.00,
      totalCanceled: 0,
      joinDate: '01 Sep 2024',
      lastActive: '17 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'WD5678901',
      username: 'wanida_flow'
    },
    {
      id: 'P012',
      name: 'Teerawat Sukprasert',
      phone: '+66 82 456 7890',
      email: 'teerawat.success@domain.com',
      gender: 'Male',
      dateOfBirth: '20/02/1990',
      pickupDate: '30 November 2568',
      pickupTime: '18:15',
      pickupLocation: 'Rama IX',
      destination: 'Mega Bangna',
      licenseType: 'VAN',
      location: { lat: 13.7591, lng: 100.5651 },
      avatar: 'https://i.pravatar.cc/150?img=29',
      totalRides: 32,
      totalSpent: 8567.00,
      totalCanceled: 2,
      joinDate: '15 May 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '3456789012345',
      username: 'teerawat_win'
    },
    {
      id: 'P013',
      name: 'Patcharee Wongsuk',
      phone: '+66 83 567 8901',
      email: 'patcharee.lovely@domain.com',
      gender: 'Female',
      dateOfBirth: '14/07/1996',
      pickupDate: '30 November 2568',
      pickupTime: '18:30',
      pickupLocation: 'Ladprao',
      destination: 'Union Mall',
      licenseType: 'BIKE',
      location: { lat: 13.7952, lng: 100.5614 },
      avatar: 'https://i.pravatar.cc/150?img=30',
      totalRides: 19,
      totalSpent: 4856.00,
      totalCanceled: 1,
      joinDate: '22 Jun 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '7890123456789',
      username: 'patcharee_love'
    },
    {
      id: 'P014',
      name: 'Somkid Jitjumnong',
      phone: '+66 84 678 9012',
      email: 'somkid.joy@domain.com',
      gender: 'Male',
      dateOfBirth: '28/11/1987',
      pickupDate: '30 November 2568',
      pickupTime: '18:45',
      pickupLocation: 'Phra Khanong',
      destination: 'Srinakarin',
      licenseType: 'TAXI',
      location: { lat: 13.7197, lng: 100.5859 },
      avatar: 'https://i.pravatar.cc/150?img=34',
      totalRides: 67,
      totalSpent: 18234.00,
      totalCanceled: 4,
      joinDate: '10 Jan 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Driving License',
      identityNumber: 'SK8901234567',
      username: 'somkid_joy'
    },
    {
      id: 'P015',
      name: 'Jirapa Saengthong',
      phone: '+66 85 789 0123',
      email: 'jirapa.sunshine@domain.com',
      gender: 'Female',
      dateOfBirth: '03/02/1998',
      pickupDate: '30 November 2568',
      pickupTime: '19:00',
      pickupLocation: 'Bangrak',
      destination: 'Iconsiam',
      licenseType: 'BUS',
      location: { lat: 13.7225, lng: 100.5168 },
      avatar: 'https://i.pravatar.cc/150?img=35',
      totalRides: 8,
      totalSpent: 2145.00,
      totalCanceled: 0,
      joinDate: '05 Oct 2024',
      lastActive: '17 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'JP3456789',
      username: 'jirapa_sun'
    },
    {
      id: 'P016',
      name: 'Natthapong Pramuan',
      phone: '+66 86 890 1234',
      email: 'natthapong.brave@domain.com',
      gender: 'Male',
      dateOfBirth: '17/09/1991',
      pickupDate: '30 November 2568',
      pickupTime: '19:15',
      pickupLocation: 'Sathorn',
      destination: 'Rama III',
      licenseType: 'CAR',
      location: { lat: 13.7221, lng: 100.5253 },
      avatar: 'https://i.pravatar.cc/150?img=36',
      totalRides: 44,
      totalSpent: 11678.00,
      totalCanceled: 2,
      joinDate: '18 Mar 2024',
      lastActive: '16 Nov 2025',
      identityType: 'National ID',
      identityNumber: '4567890123456',
      username: 'natthapong_brave'
    },
    {
      id: 'P017',
      name: 'Nittaya Chaiwong',
      phone: '+66 87 901 2345',
      email: 'nittaya.smile@domain.com',
      gender: 'Female',
      dateOfBirth: '26/12/1994',
      pickupDate: '30 November 2568',
      pickupTime: '19:30',
      pickupLocation: 'Ratchathewi',
      destination: 'Phaya Thai',
      licenseType: 'BIKE',
      location: { lat: 13.7535, lng: 100.5323 },
      avatar: 'https://i.pravatar.cc/150?img=37',
      totalRides: 26,
      totalSpent: 6789.00,
      totalCanceled: 1,
      joinDate: '12 Apr 2024',
      lastActive: '17 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'NT6789012',
      username: 'nittaya_smile'
    },
    {
      id: 'P018',
      name: 'Panya Vitchasilp',
      phone: '+66 88 012 3456',
      email: 'panya.wisdom@domain.com',
      gender: 'Male',
      dateOfBirth: '09/05/1986',
      pickupDate: '30 November 2568',
      pickupTime: '19:45',
      pickupLocation: 'Siam',
      destination: 'National Stadium',
      licenseType: 'VAN',
      location: { lat: 13.7465, lng: 100.5344 },
      avatar: 'https://i.pravatar.cc/150?img=38',
      totalRides: 55,
      totalSpent: 15234.00,
      totalCanceled: 3,
      joinDate: '28 Feb 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Driving License',
      identityNumber: 'PY5678901234',
      username: 'panya_wise'
    },
    {
      id: 'P019',
      name: 'Supaporn Kaewmanee',
      phone: '+66 89 123 4567',
      email: 'supaporn.beauty@domain.com',
      gender: 'Female',
      dateOfBirth: '13/08/1997',
      pickupDate: '30 November 2568',
      pickupTime: '20:00',
      pickupLocation: 'Chit Lom',
      destination: 'Ploen Chit',
      licenseType: 'TAXI',
      location: { lat: 13.7440, lng: 100.5464 },
      avatar: 'https://i.pravatar.cc/150?img=39',
      totalRides: 11,
      totalSpent: 2987.00,
      totalCanceled: 0,
      joinDate: '19 Sep 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '8901234567890',
      username: 'supaporn_beauty'
    },
    {
      id: 'P020',
      name: 'Wichai Boonchoo',
      phone: '+66 90 234 5678',
      email: 'wichai.lucky@domain.com',
      gender: 'Male',
      dateOfBirth: '21/01/1989',
      pickupDate: '30 November 2568',
      pickupTime: '20:15',
      pickupLocation: 'Ari',
      destination: 'Mo Chit',
      licenseType: 'CAR',
      location: { lat: 13.7789, lng: 100.5418 },
      avatar: 'https://i.pravatar.cc/150?img=40',
      totalRides: 38,
      totalSpent: 9876.00,
      totalCanceled: 2,
      joinDate: '07 Apr 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'WC4567890',
      username: 'wichai_lucky'
    },
    {
      id: 'P021',
      name: 'Rattana Sukhum',
      phone: '+66 91 345 6789',
      email: 'rattana.gem@domain.com',
      gender: 'Female',
      dateOfBirth: '06/10/1993',
      pickupDate: '30 November 2568',
      pickupTime: '20:30',
      pickupLocation: 'Bearing',
      destination: 'Bangna',
      licenseType: 'BIKE',
      location: { lat: 13.6621, lng: 100.6075 },
      avatar: 'https://i.pravatar.cc/150?img=41',
      totalRides: 22,
      totalSpent: 5643.00,
      totalCanceled: 1,
      joinDate: '14 May 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '2345678901234',
      username: 'rattana_gem'
    },
    {
      id: 'P022',
      name: 'Kritsana Wongdee',
      phone: '+66 92 456 7890',
      email: 'kritsana.good@domain.com',
      gender: 'Male',
      dateOfBirth: '29/03/1990',
      pickupDate: '30 November 2568',
      pickupTime: '20:45',
      pickupLocation: 'Onnut',
      destination: 'Udom Suk',
      licenseType: 'VAN',
      location: { lat: 13.7055, lng: 100.5997 },
      avatar: 'https://i.pravatar.cc/150?img=42',
      totalRides: 49,
      totalSpent: 13567.00,
      totalCanceled: 3,
      joinDate: '23 Feb 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Driving License',
      identityNumber: 'KT9012345678',
      username: 'kritsana_good'
    },
    {
      id: 'P023',
      name: 'Siriporn Jaidee',
      phone: '+66 93 567 8901',
      email: 'siriporn.angel@domain.com',
      gender: 'Female',
      dateOfBirth: '11/06/1995',
      pickupDate: '30 November 2568',
      pickupTime: '21:00',
      pickupLocation: 'Bang Sue',
      destination: 'Chatuchak Weekend Market',
      licenseType: 'TAXI',
      location: { lat: 13.8044, lng: 100.5295 },
      avatar: 'https://i.pravatar.cc/150?img=45',
      totalRides: 34,
      totalSpent: 8934.00,
      totalCanceled: 2,
      joinDate: '09 Mar 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '5678901234567',
      username: 'siriporn_angel'
    },
    {
      id: 'P024',
      name: 'Chalerm Klangjai',
      phone: '+66 94 678 9012',
      email: 'chalerm.center@domain.com',
      gender: 'Male',
      dateOfBirth: '24/04/1988',
      pickupDate: '30 November 2568',
      pickupTime: '21:15',
      pickupLocation: 'Saphan Taksin',
      destination: 'Asiatique',
      licenseType: 'CAR',
      location: { lat: 13.7193, lng: 100.5104 },
      avatar: 'https://i.pravatar.cc/150?img=46',
      totalRides: 52,
      totalSpent: 14234.00,
      totalCanceled: 3,
      joinDate: '16 Jan 2024',
      lastActive: '16 Nov 2025',
      identityType: 'Passport',
      identityNumber: 'CL7890123',
      username: 'chalerm_center'
    },
    {
      id: 'P025',
      name: 'Wannee Sukjai',
      phone: '+66 95 789 0123',
      email: 'wannee.happy@domain.com',
      gender: 'Female',
      dateOfBirth: '18/07/1992',
      pickupDate: '30 November 2568',
      pickupTime: '21:30',
      pickupLocation: 'Thonglor',
      destination: 'Ekamai',
      licenseType: 'BIKE',
      location: { lat: 13.7308, lng: 100.5839 },
      avatar: 'https://i.pravatar.cc/150?img=48',
      totalRides: 29,
      totalSpent: 7456.00,
      totalCanceled: 1,
      joinDate: '21 Apr 2024',
      lastActive: '17 Nov 2025',
      identityType: 'National ID',
      identityNumber: '6789012345678',
      username: 'wannee_happy'
    }
  ]
};

const hasWindow = typeof window !== 'undefined';
const storage = hasWindow ? window.localStorage : null;

const isCategoryFareEnabled = () => {
  if (!storage) return false;
  const raw = storage.getItem('categoryFareEnabled');
  if (raw === null) {
    storage.setItem('categoryFareEnabled', JSON.stringify(false));
    return false;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return false;
  }
};

const hashPassengerIndex = (seedValue, length) => {
  if (length === 0) return 0;
  const seed = seedValue.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return seed % length;
};

const ensureServiceFields = () => {
  liveMapData.drivers.all.forEach((driver) => {
    driver.currentPassengerId = '';
    driver.currentPassengerName = '';
    driver.currentPassengerPickup = '';
    driver.currentPassengerDestination = '';
    driver.currentTripFare = null;
    driver.currentPassengerCoords = null;
  });

  liveMapData.passengers.forEach((passenger) => {
    passenger.currentDriverId = '';
    passenger.currentDriverName = '';
    passenger.currentTripFare = null;
  });
};

const selectFareConfig = (fareState, vehicleType, categoryEnabled) => {
  const defaultFare = { ...DEFAULT_FARE_SETTINGS, ...(fareState?.defaultFare || {}) };
  if (categoryEnabled && fareState?.categoryFares?.[vehicleType]) {
    return { ...defaultFare, ...fareState.categoryFares[vehicleType] };
  }
  return defaultFare;
};

const buildTripFareSummary = (driver, passenger, fareState, categoryEnabled) => {
  const fareConfig = selectFareConfig(fareState, driver.licenseType, categoryEnabled);
  const pickupLocation = passenger.location || driver.location;
  const distance = calculateDistance(
    driver.location.lat,
    driver.location.lng,
    pickupLocation.lat,
    pickupLocation.lng
  );
  const tripDistance = Math.max(distance, 1.2);
  const estimatedDurationMinutes = Math.max(tripDistance * 4, 8);
  const perKm = fareConfig.farePerKm || DEFAULT_FARE_SETTINGS.farePerKm;

  let total = (fareConfig.baseFare || DEFAULT_FARE_SETTINGS.baseFare) + tripDistance * perKm;

  if (fareConfig.idleFee) {
    total += (estimatedDurationMinutes * fareConfig.idleFee) / 60;
  }

  if (fareConfig.peakHours) {
    total += (estimatedDurationMinutes * fareConfig.peakHours) / 60;
  }

  total = Math.max(total, fareConfig.minimumFare || DEFAULT_FARE_SETTINGS.minimumFare);

  return {
    currency: 'THB',
    estimatedFare: parseFloat(total.toFixed(2)),
    distanceKm: parseFloat(tripDistance.toFixed(2)),
    baseFare: fareConfig.baseFare || DEFAULT_FARE_SETTINGS.baseFare,
    farePerKm: perKm,
    idleFee: fareConfig.idleFee || 0,
    peakFeePerHour: fareConfig.peakHours || 0,
    source: fareConfig.label || (categoryEnabled ? `${driver.licenseType} Fare` : 'Default Fare'),
    lastUpdated: fareState.lastUpdated || new Date().toISOString(),
  };
};

const linkDriversAndPassengers = () => {
  ensureServiceFields();

  const fareState = ensureCurrentFareData();
  const categoryEnabled = isCategoryFareEnabled();
  const availablePassengers = [...liveMapData.passengers];

  liveMapData.drivers.all.forEach((driver) => {
    if (driver.status !== 'on-trip') {
      driver.currentPassengerId = '';
      driver.currentPassengerName = '';
      driver.currentPassengerPickup = '';
      driver.currentPassengerDestination = '';
      driver.currentTripFare = null;
      driver.currentPassengerCoords = null;
      return;
    }

    if (availablePassengers.length === 0) {
      driver.currentPassengerId = '';
      driver.currentPassengerName = '';
      driver.currentPassengerPickup = '';
      driver.currentPassengerDestination = '';
      driver.currentTripFare = null;
      return;
    }

    const passengerIndex = hashPassengerIndex(driver.id, availablePassengers.length);
    const passenger = availablePassengers.splice(passengerIndex, 1)[0];

    driver.currentPassengerId = passenger.id;
    driver.currentPassengerName = passenger.name;
    driver.currentPassengerPickup = passenger.pickupLocation || '';
    driver.currentPassengerDestination = passenger.destination || '';
    driver.currentPassengerCoords = passenger.location || null;

    const fareSummary = buildTripFareSummary(driver, passenger, fareState, categoryEnabled);
    driver.currentTripFare = fareSummary;

    passenger.currentDriverId = driver.id;
    passenger.currentDriverName = driver.name;
    passenger.currentTripFare = fareSummary;
  });

  liveMapData.drivers.onTrip = liveMapData.drivers.all.filter((driver) => driver.status === 'on-trip');
  liveMapData.drivers.idle = liveMapData.drivers.all.filter((driver) => driver.status !== 'on-trip');
};

liveMapData.syncDynamicData = () => {
  linkDriversAndPassengers();
  return liveMapData;
};

const storedDrivers = getStoredDrivers();
if (storedDrivers.length) {
  liveMapData.drivers.all.push(...storedDrivers);
}

const storedPassengers = getStoredPassengers();
if (storedPassengers.length) {
  liveMapData.passengers.push(...storedPassengers);
}

liveMapData.syncDynamicData();