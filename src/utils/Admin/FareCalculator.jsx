// utils/fareCalculator.js

/**
 * คำนวณค่าโดยสารจากระยะทางและการตั้งค่าค่าโดยสาร
 * @param {number} distance - ระยะทางในกิโลเมตร
 * @param {string} vehicleType - ประเภทรถ (BIKE, CAR, BUS)
 * @param {number} duration - ระยะเวลาในนาที
 * @param {boolean} isPeakHours - เป็นชั่วโมงเร่ง?
 * @returns {object} - ข้อมูลค่าโดยสาร
 */
export const calculateFare = (distance, vehicleType, duration = 0, isPeakHours = false) => {
  // ดึงข้อมูลค่าโดยสารจาก localStorage
  const fareData = JSON.parse(localStorage.getItem('currentFareData'));
  const categoryFareEnabled = JSON.parse(localStorage.getItem('categoryFareEnabled'));

  if (!fareData) {
    console.warn('No fare setup found');
    return null;
  }

  let fareConfig;

  // เลือกใช้ค่าโดยสารตามประเภทรถหรือค่าเริ่มต้น
  if (categoryFareEnabled && fareData.categoryFares && fareData.categoryFares[vehicleType]) {
    fareConfig = fareData.categoryFares[vehicleType];
  } else {
    fareConfig = fareData.defaultFare;
  }

  // คำนวณค่าโดยสารฐาน
  const baseFare = fareConfig.baseFare;
  const distanceFare = distance * fareConfig.farePerKm;
  let totalFare = baseFare + distanceFare;

  // เพิ่มค่าถ้านั่งรถนิ่ง (idle time)
  if (duration > 0) {
    const idleFare = (duration * fareConfig.idleFee) / 60; // แปลงนาทีเป็นชั่วโมง
    totalFare += idleFare;
  }

  // เพิ่มค่าในชั่วโมงเร่ง
  if (isPeakHours && duration > 0) {
    const peakFare = (duration * fareConfig.peakHours) / 60;
    totalFare += peakFare;
  }

  // ใช้ค่าโดยสารขั้นต่ำ
  const minimumFare = fareConfig.minimumFare;
  totalFare = Math.max(totalFare, minimumFare);

  return {
    baseFare,
    distanceFare: parseFloat(distanceFare.toFixed(2)),
    idleFare: duration > 0 ? parseFloat(((duration * fareConfig.idleFee) / 60).toFixed(2)) : 0,
    peakHoursFare: isPeakHours && duration > 0 ? parseFloat(((duration * fareConfig.peakHours) / 60).toFixed(2)) : 0,
    totalFare: parseFloat(totalFare.toFixed(2)),
    minimumFare,
    currencyCode: 'THB',
    vehicleType
  };
};

/**
 * คำนวณค่าโดยสารยกเลิก
 * @param {number} totalFare - ค่าโดยสารทั้งหมด
 * @returns {object} - ข้อมูลค่าโดยสารยกเลิก
 */
export const calculateCancellationFee = (totalFare) => {
  const fareData = JSON.parse(localStorage.getItem('currentFareData'));

  if (!fareData) {
    return null;
  }

  const fareConfig = fareData.defaultFare;
  const cancellationPercentage = fareConfig.cancellationFee / 100;
  const cancellationFee = totalFare * cancellationPercentage;
  const minimumCancellationFee = fareConfig.minimumCancellationFee;

  return {
    cancellationFee: Math.max(cancellationFee, minimumCancellationFee),
    percentage: fareConfig.cancellationFee,
    currencyCode: 'THB'
  };
};

/**
 * คำนวณระยะทางจากพิกัด (Haversine formula)
 * @param {number} lat1 - ละติจูด ที่มา
 * @param {number} lon1 - ลองจิจูด ที่มา
 * @param {number} lat2 - ละติจูด ปลายทาง
 * @param {number} lon2 - ลองจิจูด ปลายทาง
 * @returns {number} - ระยะทางในกิโลเมตร
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // รัศมีโลก (กิโลเมตร)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
};

/**
 * ดึงข้อมูลค่าโดยสารปัจจุบัน
 * @returns {object} - ข้อมูลค่าโดยสารทั้งหมด
 */
export const getCurrentFareData = () => {
  return JSON.parse(localStorage.getItem('currentFareData'));
};

/**
 * ตรวจสอบว่าเปิดใช้งานค่าโดยสารตามประเภทรถหรือไม่
 * @returns {boolean}
 */
export const isCategoryFareEnabled = () => {
  return JSON.parse(localStorage.getItem('categoryFareEnabled')) || false;
};

/**
 * ฟังก์ชันการประมาณค่าโดยสารทั้งหมด (รวมทุกอย่าง)
 * @param {object} tripData - ข้อมูลการเดินทาง
 * @returns {object} - ข้อมูลค่าโดยสารรวม
 */
export const estimateTotalFare = (tripData) => {
  const {
    distance,
    vehicleType,
    duration,
    isPeakHours = false
  } = tripData;

  const fareDetails = calculateFare(distance, vehicleType, duration, isPeakHours);

  if (!fareDetails) {
    return null;
  }

  return {
    ...fareDetails,
    estimatedFare: fareDetails.totalFare,
    breakdown: {
      baseFare: `฿${fareDetails.baseFare.toFixed(2)}`,
      distanceFare: `฿${fareDetails.distanceFare.toFixed(2)} (${distance}km × ฿${getCurrentFareData().defaultFare.farePerKm})`,
      idleFare: fareDetails.idleFare > 0 ? `฿${fareDetails.idleFare.toFixed(2)}` : 'N/A',
      peakHoursFare: fareDetails.peakHoursFare > 0 ? `฿${fareDetails.peakHoursFare.toFixed(2)}` : 'N/A'
    }
  };
};