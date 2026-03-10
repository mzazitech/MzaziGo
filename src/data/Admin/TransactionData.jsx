// data/transactionMockData.js

export const transactionStats = {
  totalTransactions: 1245,
  totalRevenue: 456789.50,
  totalFees: 45678.95,
  totalRefunds: 12340.00,
  pendingTransactions: 23,
  completedTransactions: 1198,
  failedTransactions: 24
};

export const mockTransactionList = [
  {
    id: 'TXN-000123',
    date: '2025-11-01',
    time: '14:30',
    driver: 'John D.',
    passenger: 'Alice P.',
    amount: 120.00,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 65.00,
      serviceFee: 15.00,
      tax: 5.00
    },
    fromLocation: 'Siam Square',
    toLocation: 'Asiatique',
    distance: '12.5 km',
    duration: '35 min'
  },
  {
    id: 'TXN-000124',
    date: '2025-11-01',
    time: '15:45',
    driver: 'John D.',
    passenger: 'Alice P.',
    amount: 120.00,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 65.00,
      serviceFee: 15.00,
      tax: 5.00
    },
    fromLocation: 'MBK Center',
    toLocation: 'Chatuchak',
    distance: '8.3 km',
    duration: '25 min'
  },
  {
    id: 'TXN-000125',
    date: '2025-11-01',
    time: '16:20',
    driver: 'John D.',
    passenger: 'Alice P.',
    amount: 120.00,
    status: 'Refunded',
    paymentMethod: 'Credit Card',
    transactionType: 'Refund',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 65.00,
      serviceFee: 15.00,
      tax: 5.00
    },
    refundReason: 'Driver cancelled',
    fromLocation: 'Victory Monument',
    toLocation: 'Don Mueang Airport',
    distance: '0 km',
    duration: '0 min'
  },
  {
    id: 'TXN-000126',
    date: '2025-11-02',
    time: '09:15',
    driver: 'John D.',
    passenger: 'Alice P.',
    amount: 120.00,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 65.00,
      serviceFee: 15.00,
      tax: 5.00
    },
    fromLocation: 'Sukhumvit Soi 11',
    toLocation: 'Siam Paragon',
    distance: '5.2 km',
    duration: '18 min'
  },
  {
    id: 'TXN-000127',
    date: '2025-11-02',
    time: '10:30',
    driver: 'John D.',
    passenger: 'Alice P.',
    amount: 120.00,
    status: 'Completed',
    paymentMethod: 'Cash',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 65.00,
      serviceFee: 15.00,
      tax: 5.00
    },
    fromLocation: 'Central World',
    toLocation: 'Terminal 21',
    distance: '3.8 km',
    duration: '15 min'
  },
  {
    id: 'TXN-000128',
    date: '2025-11-02',
    time: '12:00',
    driver: 'Sarah M.',
    passenger: 'Bob K.',
    amount: 280.50,
    status: 'Completed',
    paymentMethod: 'E-Wallet',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 210.00,
      serviceFee: 28.00,
      tax: 7.50
    },
    fromLocation: 'Suvarnabhumi Airport',
    toLocation: 'Pattaya',
    distance: '145 km',
    duration: '120 min'
  },
  {
    id: 'TXN-000129',
    date: '2025-11-02',
    time: '14:15',
    driver: 'Mike R.',
    passenger: 'Carol S.',
    amount: 85.00,
    status: 'Failed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    failReason: 'Payment declined',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 35.00,
      serviceFee: 10.00,
      tax: 5.00
    },
    fromLocation: 'Silom',
    toLocation: 'Sathorn',
    distance: '2.1 km',
    duration: '12 min'
  },
  {
    id: 'TXN-000130',
    date: '2025-11-03',
    time: '08:30',
    driver: 'David L.',
    passenger: 'Emma W.',
    amount: 450.00,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 50.00,
      distance: 320.00,
      serviceFee: 65.00,
      tax: 15.00
    },
    fromLocation: 'Bangkok',
    toLocation: 'Hua Hin',
    distance: '198 km',
    duration: '180 min'
  },
  {
    id: 'TXN-000131',
    date: '2025-11-03',
    time: '11:45',
    driver: 'Tom H.',
    passenger: 'Lisa P.',
    amount: 95.50,
    status: 'Completed',
    paymentMethod: 'E-Wallet',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 45.00,
      serviceFee: 10.00,
      tax: 5.50
    },
    fromLocation: 'Thonglor',
    toLocation: 'Ekkamai',
    distance: '4.2 km',
    duration: '15 min'
  },
  {
    id: 'TXN-000132',
    date: '2025-11-03',
    time: '13:20',
    driver: 'Anna K.',
    passenger: 'Mark T.',
    amount: 150.00,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 90.00,
      serviceFee: 18.00,
      tax: 7.00
    },
    fromLocation: 'Chatuchak Weekend Market',
    toLocation: 'Lumpini Park',
    distance: '12.8 km',
    duration: '40 min'
  },
  {
    id: 'TXN-000133',
    date: '2025-11-04',
    time: '07:15',
    driver: 'Peter C.',
    passenger: 'Nancy B.',
    amount: 180.00,
    status: 'Completed',
    paymentMethod: 'Cash',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 115.00,
      serviceFee: 22.00,
      tax: 8.00
    },
    fromLocation: 'Rama IX',
    toLocation: 'Mega Bangna',
    distance: '18.5 km',
    duration: '35 min'
  },
  {
    id: 'TXN-000134',
    date: '2025-11-04',
    time: '09:30',
    driver: 'Kevin S.',
    passenger: 'Rachel D.',
    amount: 75.00,
    status: 'Refunded',
    paymentMethod: 'E-Wallet',
    transactionType: 'Refund',
    refundReason: 'Service issue',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 28.00,
      serviceFee: 8.00,
      tax: 4.00
    },
    fromLocation: 'Ari',
    toLocation: 'Mo Chit',
    distance: '0 km',
    duration: '0 min'
  },
  {
    id: 'TXN-000135',
    date: '2025-11-04',
    time: '15:00',
    driver: 'James W.',
    passenger: 'Sophie L.',
    amount: 320.00,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 50.00,
      distance: 220.00,
      serviceFee: 40.00,
      tax: 10.00
    },
    fromLocation: 'Bangkok City',
    toLocation: 'Kanchanaburi',
    distance: '128 km',
    duration: '150 min'
  },
  {
    id: 'TXN-000136',
    date: '2025-11-05',
    time: '10:20',
    driver: 'Robert M.',
    passenger: 'Julia F.',
    amount: 110.00,
    status: 'Completed',
    paymentMethod: 'E-Wallet',
    transactionType: 'Ride Payment',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 58.00,
      serviceFee: 12.00,
      tax: 5.00
    },
    fromLocation: 'Bearing',
    toLocation: 'Bangna',
    distance: '7.5 km',
    duration: '22 min'
  },
  {
    id: 'TXN-000137',
    date: '2025-11-05',
    time: '12:45',
    driver: 'Chris P.',
    passenger: 'Maria G.',
    amount: 135.50,
    status: 'Failed',
    paymentMethod: 'Credit Card',
    transactionType: 'Ride Payment',
    failReason: 'Insufficient funds',
    fareBreakdown: {
      baseFare: 35.00,
      distance: 78.00,
      serviceFee: 16.00,
      tax: 6.50
    },
    fromLocation: 'Onnut',
    toLocation: 'Udom Suk',
    distance: '10.2 km',
    duration: '28 min'
  }
];

// Chart data for different time ranges
export const transactionChartData = {
  today: [
    { time: '00:00', revenue: 2500, transactions: 15 },
    { time: '06:00', revenue: 8900, transactions: 45 },
    { time: '12:00', revenue: 15200, transactions: 78 },
    { time: '18:00', revenue: 22400, transactions: 112 },
    { time: '23:59', revenue: 28900, transactions: 145 }
  ],
  week: [
    { day: 'Mon', revenue: 45800, transactions: 245 },
    { day: 'Tue', revenue: 52100, transactions: 278 },
    { day: 'Wed', revenue: 48900, transactions: 261 },
    { day: 'Thu', revenue: 55200, transactions: 295 },
    { day: 'Fri', revenue: 62500, transactions: 334 },
    { day: 'Sat', revenue: 58700, transactions: 312 },
    { day: 'Sun', revenue: 51200, transactions: 273 }
  ],
  month: [
    { week: 'Week 1', revenue: 185200, transactions: 989 },
    { week: 'Week 2', revenue: 198500, transactions: 1067 },
    { week: 'Week 3', revenue: 192800, transactions: 1034 },
    { week: 'Week 4', revenue: 178300, transactions: 956 }
  ],
  year: [
    { month: 'Jan', revenue: 587600, transactions: 3145 },
    { month: 'Feb', revenue: 536400, transactions: 2876 },
    { month: 'Mar', revenue: 621000, transactions: 3329 },
    { month: 'Apr', revenue: 591600, transactions: 3169 },
    { month: 'May', revenue: 603000, transactions: 3230 },
    { month: 'Jun', revenue: 578200, transactions: 3097 },
    { month: 'Jul', revenue: 645800, transactions: 3461 },
    { month: 'Aug', revenue: 612300, transactions: 3280 },
    { month: 'Sep', revenue: 598700, transactions: 3207 },
    { month: 'Oct', revenue: 634500, transactions: 3399 },
    { month: 'Nov', revenue: 456789, transactions: 2450 }
  ]
};

export const timeRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Refunded', label: 'Refunded' },
  { value: 'Failed', label: 'Failed' }
];

export const paymentMethodOptions = [
  { value: 'all', label: 'All Methods' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'E-Wallet', label: 'E-Wallet' }
];