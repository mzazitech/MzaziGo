// data/couponData.js

export const mockCouponList = [
  {
    id: 1,
    title: 'Welcome Discount',
    code: 'WELCOME10',
    type: 'Percentage',
    amount: '10%',
    duration: '09 Oct - 31 Oct',
    totalUsed: 123,
    applicableFor: 'New Riders',
    region: 'Bangkok',
    category: 'Taxi Ride',
    status: 'Active',
    startDate: '2025-10-09',
    endDate: '2025-10-31',
    minOrder: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    note: 'Welcome promotion for new riders'
  },
  {
    id: 2,
    title: 'Free Delivery',
    code: 'FRYDLVRY',
    type: 'Fixed Amount',
    amount: '฿50',
    duration: '05 Oct - 30 Nov',
    totalUsed: 88,
    applicableFor: 'All Users',
    region: 'Chiang Mai',
    category: 'Airport Transfer',
    status: 'Active',
    startDate: '2025-10-05',
    endDate: '2025-11-30',
    minOrder: 200,
    maxDiscount: 50,
    usageLimit: 2000,
    note: 'Free delivery for orders above 200 THB'
  },
  {
    id: 3,
    title: 'New Member Bonus',
    code: 'NEWUSER20',
    type: 'Percentage',
    amount: '20%',
    duration: '01 Nov - 30 Nov',
    totalUsed: 156,
    applicableFor: 'Members',
    region: 'Phuket',
    category: 'Premium Taxi',
    status: 'Active',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    minOrder: 100,
    maxDiscount: 200,
    usageLimit: 5000,
    note: 'Special bonus for new members'
  },
  {
    id: 4,
    title: 'Holiday Sale',
    code: 'HOLIDAY20',
    type: 'Percentage',
    amount: '20%',
    duration: '01 Dec - 25 Dec',
    totalUsed: 58,
    applicableFor: 'All Users',
    region: 'Bangkok',
    category: 'Standard Ride',
    status: 'Scheduled',
    startDate: '2025-12-01',
    endDate: '2025-12-25',
    minOrder: 75,
    maxDiscount: 150,
    usageLimit: 3000,
    note: 'Holiday season promotion'
  },
  {
    id: 5,
    title: 'Flash Deal',
    code: 'FLASH30',
    type: 'Percentage',
    amount: '30%',
    duration: '10 Oct - 15 Oct',
    totalUsed: 45,
    applicableFor: 'All Users',
    region: 'Pattaya',
    category: 'Daily Ride',
    status: 'Expired',
    startDate: '2025-10-10',
    endDate: '2025-10-15',
    minOrder: 60,
    maxDiscount: 120,
    usageLimit: 1500,
    note: 'Limited time flash deal'
  }
];

export const mockDeletedCouponList = [
  {
    id: 101,
    title: 'Weekend Promo',
    code: 'WEEKEND15',
    type: 'Percentage',
    amount: '15%',
    duration: '03 Oct - 08 Oct',
    totalUsed: 23,
    applicableFor: 'All Users',
    region: 'Bangkok',
    category: 'Taxi Ride',
    status: 'Inactive',
    deletedDate: '2025-10-15'
  },
  {
    id: 102,
    title: 'Year End Sale',
    code: 'YEAREND50',
    type: 'Fixed Amount',
    amount: '฿100',
    duration: '20 Dec - 31 Dec',
    totalUsed: 90,
    applicableFor: 'All Users',
    region: 'Chiang Mai',
    category: 'Airport Transfer',
    status: 'Inactive',
    deletedDate: '2025-10-20'
  },
  {
    id: 103,
    title: 'New Rider Bonus',
    code: 'NEWRIDER25',
    type: 'Percentage',
    amount: '25%',
    duration: '15 Jan - 15 Feb',
    totalUsed: 112,
    applicableFor: 'New Riders',
    region: 'Phuket',
    category: 'Premium Taxi',
    status: 'Inactive',
    deletedDate: '2025-10-25'
  },
  {
    id: 104,
    title: 'Lucky Spin',
    code: 'LUCKYSPIN',
    type: 'Percentage',
    amount: '15%',
    duration: '01 Sep - 15 Sep',
    totalUsed: 64,
    applicableFor: 'All Users',
    region: 'Pattaya',
    category: 'Daily Ride',
    status: 'Inactive',
    deletedDate: '2025-10-28'
  }
];

// สถิติคูปองสำหรับกราฟ - ช่วงเวลาต่างๆ

export const couponChartData = {
  today: [
    { time: '06:00', active: 2, expired: 0, total: 2 },
    { time: '08:00', active: 5, expired: 0, total: 5 },
    { time: '10:00', active: 8, expired: 1, total: 9 },
    { time: '12:00', active: 12, expired: 1, total: 13 },
    { time: '14:00', active: 15, expired: 2, total: 17 },
    { time: '16:00', active: 18, expired: 2, total: 20 },
    { time: '18:00', active: 22, expired: 3, total: 25 },
    { time: '20:00', active: 25, expired: 3, total: 28 },
    { time: '22:00', active: 28, expired: 4, total: 32 }
  ],
  yesterday: [
    { time: '06:00', active: 3, expired: 0, total: 3 },
    { time: '08:00', active: 6, expired: 0, total: 6 },
    { time: '10:00', active: 10, expired: 1, total: 11 },
    { time: '12:00', active: 14, expired: 1, total: 15 },
    { time: '14:00', active: 17, expired: 2, total: 19 },
    { time: '16:00', active: 20, expired: 2, total: 22 },
    { time: '18:00', active: 24, expired: 3, total: 27 },
    { time: '20:00', active: 27, expired: 3, total: 30 },
    { time: '22:00', active: 30, expired: 4, total: 34 }
  ],
  last7days: [
    { day: 'Mon', active: 28, expired: 4, total: 32 },
    { day: 'Tue', active: 32, expired: 5, total: 37 },
    { day: 'Wed', active: 35, expired: 6, total: 41 },
    { day: 'Thu', active: 38, expired: 6, total: 44 },
    { day: 'Fri', active: 42, expired: 7, total: 49 },
    { day: 'Sat', active: 45, expired: 8, total: 53 },
    { day: 'Sun', active: 48, expired: 9, total: 57 }
  ],
  thisMonth: [
    { week: 'Week 1', active: 32, expired: 4, total: 36 },
    { week: 'Week 2', active: 45, expired: 6, total: 51 },
    { week: 'Week 3', active: 52, expired: 8, total: 60 },
    { week: 'Week 4', active: 58, expired: 10, total: 68 }
  ],
  lastMonth: [
    { week: 'Week 1', active: 28, expired: 3, total: 31 },
    { week: 'Week 2', active: 38, expired: 5, total: 43 },
    { week: 'Week 3', active: 48, expired: 7, total: 55 },
    { week: 'Week 4', active: 55, expired: 9, total: 64 }
  ],
  thisYear: [
    { month: 'Jan', active: 12, expired: 2, total: 14 },
    { month: 'Feb', active: 19, expired: 3, total: 22 },
    { month: 'Mar', active: 25, expired: 5, total: 30 },
    { month: 'Apr', active: 32, expired: 4, total: 36 },
    { month: 'May', active: 28, expired: 6, total: 34 },
    { month: 'Jun', active: 35, expired: 7, total: 42 },
    { month: 'Jul', active: 41, expired: 8, total: 49 },
    { month: 'Aug', active: 38, expired: 9, total: 47 },
    { month: 'Sep', active: 45, expired: 11, total: 56 },
    { month: 'Oct', active: 52, expired: 13, total: 65 },
    { month: 'Nov', active: 58, expired: 15, total: 73 }
  ],
  lastYear: [
    { month: 'Jan', active: 8, expired: 1, total: 9 },
    { month: 'Feb', active: 12, expired: 2, total: 14 },
    { month: 'Mar', active: 18, expired: 3, total: 21 },
    { month: 'Apr', active: 24, expired: 4, total: 28 },
    { month: 'May', active: 20, expired: 3, total: 23 },
    { month: 'Jun', active: 28, expired: 5, total: 33 },
    { month: 'Jul', active: 32, expired: 6, total: 38 },
    { month: 'Aug', active: 30, expired: 5, total: 35 },
    { month: 'Sep', active: 36, expired: 7, total: 43 },
    { month: 'Oct', active: 42, expired: 8, total: 50 },
    { month: 'Nov', active: 48, expired: 10, total: 58 },
    { month: 'Dec', active: 55, expired: 12, total: 67 }
  ],
  allTime: [
    { year: '2021', active: 45, expired: 8, total: 53 },
    { year: '2022', active: 85, expired: 15, total: 100 },
    { year: '2023', active: 125, expired: 25, total: 150 },
    { year: '2024', active: 200, expired: 40, total: 240 },
    { year: '2025', active: 58, expired: 10, total: 68 }
  ]
};

export const couponStats = {
  totalCoupon: 82,
  activeCoupon: 65,
  totalAmount: '฿65,258',
  usageRate: '78%'
};

export const timeRangeOptions = [
  { value: 'today', label: 'today' },
  { value: 'yesterday', label: 'yesterday' },
  { value: 'last7days', label: 'last 7 days' },
  { value: 'thisMonth', label: 'this Month' },
  { value: 'lastMonth', label: 'last Month' },
  { value: 'thisYear', label: 'this Year' },
  { value: 'lastYear', label: 'last Year' },
  { value: 'allTime', label: 'all Time' }
];