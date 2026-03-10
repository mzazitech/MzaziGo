// data/mockdata.jsx
export const mockData = {
  stats: {
    activeDriver: 82,
    activePassenger: 40,
    bookingRides: 22,
    canceledRides: 2,
    totalEarning: 29568,
    bikeEarning: 12895,
    carEarning: 48694,
    vanEarning: 8594
  },
  zones: [
    { name: 'Northern Zone' },
    { name: 'Northeastern Zone' },
    { name: 'Central Zone' },
    { name: 'Eastern Zone' },
    { name: 'Western Zone' },
    { name: 'Southern Zone' }
  ],
  // ข้อมูลแต่ละ zone สำหรับแต่ละ metric
  zoneData: {
    'Northern Zone': {
      activeDriver: { today: 5, yesterday: 8, last7days: 40, thisMonth: 120, lastMonth: 110, thisYear: 1000, lastYear: 900, allTime: 5000 },
      activePassenger: { today: 3, yesterday: 5, last7days: 25, thisMonth: 80, lastMonth: 75, thisYear: 800, lastYear: 700, allTime: 4000 },
      bookingRides: { today: 2, yesterday: 3, last7days: 18, thisMonth: 60, lastMonth: 55, thisYear: 600, lastYear: 550, allTime: 3000 },
      canceledRides: { today: 0, yesterday: 1, last7days: 3, thisMonth: 8, lastMonth: 7, thisYear: 80, lastYear: 75, allTime: 400 },
      totalEarning: { today: 2500, yesterday: 3000, last7days: 18000, thisMonth: 60000, lastMonth: 55000, thisYear: 600000, lastYear: 550000, allTime: 3000000 },
      bikeEarning: { today: 1200, yesterday: 1500, last7days: 9000, thisMonth: 30000, lastMonth: 28000, thisYear: 300000, lastYear: 280000, allTime: 1500000 },
      carEarning: { today: 1000, yesterday: 1200, last7days: 7000, thisMonth: 23000, lastMonth: 21000, thisYear: 230000, lastYear: 210000, allTime: 1200000 },
      vanEarning: { today: 300, yesterday: 300, last7days: 2000, thisMonth: 7000, lastMonth: 6000, thisYear: 70000, lastYear: 60000, allTime: 300000 }
    },
    'Northeastern Zone': {
      activeDriver: { today: 12, yesterday: 14, last7days: 60, thisMonth: 210, lastMonth: 200, thisYear: 1200, lastYear: 1100, allTime: 6000 },
      activePassenger: { today: 8, yesterday: 10, last7days: 45, thisMonth: 150, lastMonth: 140, thisYear: 1000, lastYear: 900, allTime: 5000 },
      bookingRides: { today: 6, yesterday: 7, last7days: 35, thisMonth: 110, lastMonth: 100, thisYear: 900, lastYear: 850, allTime: 4500 },
      canceledRides: { today: 1, yesterday: 1, last7days: 5, thisMonth: 15, lastMonth: 13, thisYear: 120, lastYear: 110, allTime: 600 },
      totalEarning: { today: 5000, yesterday: 5500, last7days: 35000, thisMonth: 115000, lastMonth: 105000, thisYear: 950000, lastYear: 900000, allTime: 5000000 },
      bikeEarning: { today: 2400, yesterday: 2700, last7days: 17000, thisMonth: 55000, lastMonth: 50000, thisYear: 450000, lastYear: 420000, allTime: 2400000 },
      carEarning: { today: 2000, yesterday: 2200, last7days: 14000, thisMonth: 45000, lastMonth: 42000, thisYear: 380000, lastYear: 360000, allTime: 2000000 },
      vanEarning: { today: 600, yesterday: 600, last7days: 4000, thisMonth: 15000, lastMonth: 13000, thisYear: 120000, lastYear: 120000, allTime: 600000 }
    },
    'Central Zone': {
      activeDriver: { today: 18, yesterday: 20, last7days: 90, thisMonth: 320, lastMonth: 300, thisYear: 1400, lastYear: 1300, allTime: 7000 },
      activePassenger: { today: 12, yesterday: 15, last7days: 70, thisMonth: 230, lastMonth: 220, thisYear: 1200, lastYear: 1100, allTime: 6000 },
      bookingRides: { today: 10, yesterday: 12, last7days: 60, thisMonth: 180, lastMonth: 170, thisYear: 1100, lastYear: 1000, allTime: 5500 },
      canceledRides: { today: 1, yesterday: 2, last7days: 8, thisMonth: 25, lastMonth: 22, thisYear: 150, lastYear: 140, allTime: 800 },
      totalEarning: { today: 8000, yesterday: 9000, last7days: 60000, thisMonth: 200000, lastMonth: 185000, thisYear: 1200000, lastYear: 1100000, allTime: 6500000 },
      bikeEarning: { today: 3800, yesterday: 4300, last7days: 29000, thisMonth: 95000, lastMonth: 88000, thisYear: 570000, lastYear: 530000, allTime: 3100000 },
      carEarning: { today: 3200, yesterday: 3600, last7days: 24000, thisMonth: 80000, lastMonth: 74000, thisYear: 480000, lastYear: 440000, allTime: 2600000 },
      vanEarning: { today: 1000, yesterday: 1100, last7days: 7000, thisMonth: 25000, lastMonth: 23000, thisYear: 150000, lastYear: 130000, allTime: 800000 }
    },
    'Eastern Zone': {
      activeDriver: { today: 9, yesterday: 10, last7days: 50, thisMonth: 180, lastMonth: 170, thisYear: 1100, lastYear: 1000, allTime: 5500 },
      activePassenger: { today: 6, yesterday: 7, last7days: 35, thisMonth: 120, lastMonth: 110, thisYear: 900, lastYear: 850, allTime: 4500 },
      bookingRides: { today: 4, yesterday: 5, last7days: 28, thisMonth: 90, lastMonth: 85, thisYear: 800, lastYear: 750, allTime: 4000 },
      canceledRides: { today: 0, yesterday: 1, last7days: 4, thisMonth: 12, lastMonth: 11, thisYear: 100, lastYear: 95, allTime: 500 },
      totalEarning: { today: 4000, yesterday: 4500, last7days: 28000, thisMonth: 95000, lastMonth: 88000, thisYear: 800000, lastYear: 750000, allTime: 4200000 },
      bikeEarning: { today: 1900, yesterday: 2200, last7days: 13500, thisMonth: 45000, lastMonth: 42000, thisYear: 380000, lastYear: 360000, allTime: 2000000 },
      carEarning: { today: 1600, yesterday: 1800, last7days: 11000, thisMonth: 38000, lastMonth: 35000, thisYear: 320000, lastYear: 300000, allTime: 1700000 },
      vanEarning: { today: 500, yesterday: 500, last7days: 3500, thisMonth: 12000, lastMonth: 11000, thisYear: 100000, lastYear: 90000, allTime: 500000 }
    },
    'Western Zone': {
      activeDriver: { today: 15, yesterday: 12, last7days: 70, thisMonth: 250, lastMonth: 240, thisYear: 1300, lastYear: 1200, allTime: 6500 },
      activePassenger: { today: 10, yesterday: 8, last7days: 50, thisMonth: 170, lastMonth: 160, thisYear: 1100, lastYear: 1000, allTime: 5500 },
      bookingRides: { today: 8, yesterday: 6, last7days: 42, thisMonth: 140, lastMonth: 130, thisYear: 1000, lastYear: 950, allTime: 5000 },
      canceledRides: { today: 1, yesterday: 0, last7days: 6, thisMonth: 18, lastMonth: 16, thisYear: 130, lastYear: 120, allTime: 700 },
      totalEarning: { today: 6500, yesterday: 5500, last7days: 42000, thisMonth: 145000, lastMonth: 135000, thisYear: 1000000, lastYear: 950000, allTime: 5500000 },
      bikeEarning: { today: 3100, yesterday: 2600, last7days: 20000, thisMonth: 69000, lastMonth: 64000, thisYear: 480000, lastYear: 450000, allTime: 2600000 },
      carEarning: { today: 2600, yesterday: 2200, last7days: 17000, thisMonth: 58000, lastMonth: 54000, thisYear: 400000, lastYear: 380000, allTime: 2200000 },
      vanEarning: { today: 800, yesterday: 700, last7days: 5000, thisMonth: 18000, lastMonth: 17000, thisYear: 120000, lastYear: 120000, allTime: 700000 }
    },
    'Southern Zone': {
      activeDriver: { today: 3, yesterday: 4, last7days: 20, thisMonth: 80, lastMonth: 70, thisYear: 900, lastYear: 800, allTime: 4000 },
      activePassenger: { today: 2, yesterday: 3, last7days: 15, thisMonth: 50, lastMonth: 45, thisYear: 700, lastYear: 650, allTime: 3500 },
      bookingRides: { today: 1, yesterday: 2, last7days: 12, thisMonth: 40, lastMonth: 35, thisYear: 500, lastYear: 480, allTime: 2500 },
      canceledRides: { today: 0, yesterday: 0, last7days: 2, thisMonth: 5, lastMonth: 4, thisYear: 60, lastYear: 55, allTime: 300 },
      totalEarning: { today: 1500, yesterday: 2000, last7days: 12000, thisMonth: 42000, lastMonth: 38000, thisYear: 500000, lastYear: 480000, allTime: 2500000 },
      bikeEarning: { today: 700, yesterday: 950, last7days: 5800, thisMonth: 20000, lastMonth: 18000, thisYear: 240000, lastYear: 230000, allTime: 1200000 },
      carEarning: { today: 600, yesterday: 800, last7days: 4800, thisMonth: 17000, lastMonth: 15000, thisYear: 200000, lastYear: 190000, allTime: 1000000 },
      vanEarning: { today: 200, yesterday: 250, last7days: 1400, thisMonth: 5000, lastMonth: 5000, thisYear: 60000, lastYear: 60000, allTime: 300000 }
    }
  }
};

export const statOptions = Object.keys(mockData.stats);
export const timeOptions = ['today','yesterday','last7days','thisMonth','lastMonth','thisYear','lastYear','allTime'];