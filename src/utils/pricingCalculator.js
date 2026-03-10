/**
 * ระบบคำนวณราคารถแต่ละประเภท
 * คำนวณจาก: ระยะทางจริง, เวลา, base fare, ความหายากของรถ
 */

// ค่าคงที่สำหรับแต่ละประเภทรถ
export const VEHICLE_CONFIG = {
    Car: {
        id: 1,
        name: "Car",
        image: "/images/Car.png",
        passengers: 4,
        baseFare: 40,           // ราคาเริ่มต้น (บาท)
        perKm: 8,               // ราคาต่อกิโลเมตร (บาท)
        perMin: 1.5,            // ราคาต่อนาที (บาท)
        minFare: 50,            // ราคาขั้นต่ำ (บาท)
        rarity: 0.3,            // ความหายาก (0-1, ยิ่งสูงยิ่งหายาก) - 30% มีโอกาสเพิ่มราคา
        rarityMultiplier: 1.2,  // ตัวคูณเมื่อรถหายาก (เพิ่ม 20%)
        availability: 0.85      // ความพร้อมใช้งาน (0-1, ยิ่งสูงยิ่งมีรถมาก)
    },
    Taxi: {
        id: 2,
        name: "Taxi",
        image: "/images/Taxi.png",
        passengers: 4,
        baseFare: 35,
        perKm: 7,
        perMin: 1.2,
        minFare: 45,
        rarity: 0.2,            // 20% มีโอกาสเพิ่มราคา
        rarityMultiplier: 1.15,
        availability: 0.9
    },
    Motobike: {
        id: 3,
        name: "Motobike",
        image: "/images/Motobike.png",
        passengers: 1,
        baseFare: 25,
        perKm: 5,
        perMin: 0.8,
        minFare: 35,
        rarity: 0.4,            // 40% มีโอกาสเพิ่มราคา (รถมอเตอร์ไซค์หายากกว่า)
        rarityMultiplier: 1.25,
        availability: 0.7
    },
    Van: {
        id: 4,
        name: "Van",
        image: "/images/Van.png",
        passengers: 10,
        baseFare: 80,
        perKm: 12,
        perMin: 2.5,
        minFare: 120,
        rarity: 0.5,            // 50% มีโอกาสเพิ่มราคา (รถตู้หายากที่สุด)
        rarityMultiplier: 1.3,
        availability: 0.6
    }
};

/**
 * คำนวณราคาตามระยะทางและเวลา
 * @param {string} vehicleType - ประเภทรถ (Car, Taxi, Motobike, Van)
 * @param {number} distanceKm - ระยะทางเป็นกิโลเมตร
 * @param {number} durationMin - เวลาเป็นนาที
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @param {boolean} options.applyRarity - ใช้ความหายากในการคำนวณหรือไม่ (default: true)
 * @param {number} options.customRarity - กำหนดความหายากเอง (0-1, ถ้าไม่กำหนดจะสุ่ม)
 * @returns {Object} ข้อมูลราคาและรายละเอียด
 */
export function calculateRidePrice(vehicleType, distanceKm, durationMin, options = {}) {
    const config = VEHICLE_CONFIG[vehicleType];
    
    if (!config) {
        throw new Error(`Unknown vehicle type: ${vehicleType}`);
    }

    // คำนวณราคาพื้นฐาน
    let basePrice = config.baseFare + (distanceKm * config.perKm) + (durationMin * config.perMin);

    // ใช้ราคาขั้นต่ำ
    basePrice = Math.max(basePrice, config.minFare);

    // คำนวณความหายาก (Surge Pricing)
    let finalPrice = basePrice;
    let rarityApplied = false;
    let rarityFactor = 1.0;

    if (options.applyRarity !== false) {
        // สุ่มว่าความหายากจะเกิดขึ้นหรือไม่
        const rarityChance = options.customRarity !== undefined 
            ? options.customRarity 
            : Math.random();
        
        if (rarityChance < config.rarity) {
            // รถหายาก - เพิ่มราคา
            rarityFactor = config.rarityMultiplier;
            finalPrice = basePrice * rarityFactor;
            rarityApplied = true;
        }
    }

    // ปัดเศษเป็นจำนวนเต็ม
    finalPrice = Math.round(finalPrice);

    return {
        vehicleType,
        basePrice: Math.round(basePrice),
        finalPrice,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        durationMin: Math.round(durationMin),
        rarityApplied,
        rarityFactor: rarityFactor.toFixed(2),
        breakdown: {
            baseFare: config.baseFare,
            distanceCost: Math.round(distanceKm * config.perKm),
            timeCost: Math.round(durationMin * config.perMin),
            surgeMultiplier: rarityApplied ? rarityFactor : 1.0
        }
    };
}

/**
 * คำนวณราคาสำหรับรถทุกประเภท
 * @param {number} distanceKm - ระยะทางเป็นกิโลเมตร
 * @param {number} durationMin - เวลาเป็นนาที
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @returns {Array} อาร์เรย์ของราคาสำหรับรถแต่ละประเภท
 */
export function calculateAllRidePrices(distanceKm, durationMin, options = {}) {
    const vehicleTypes = Object.keys(VEHICLE_CONFIG);
    
    return vehicleTypes.map(vehicleType => {
        const priceData = calculateRidePrice(vehicleType, distanceKm, durationMin, options);
        const config = VEHICLE_CONFIG[vehicleType];
        
        return {
            id: config.id,
            name: config.name,
            price: priceData.finalPrice,
            basePrice: priceData.basePrice,
            distance: `${priceData.distanceKm} km`,
            duration: `${priceData.durationMin} min`,
            image: config.image,
            passengers: config.passengers,
            rarityApplied: priceData.rarityApplied,
            breakdown: priceData.breakdown
        };
    });
}

/**
 * คำนวณราคาจาก Google Maps Directions Result
 * @param {Object} directionsResult - ผลลัพธ์จาก Google Maps Directions API
 * @param {Object} options - ตัวเลือกเพิ่มเติม
 * @returns {Array} อาร์เรย์ของราคาสำหรับรถแต่ละประเภท
 */
export function calculatePricesFromDirections(directionsResult, options = {}) {
    if (!directionsResult || !directionsResult.routes || !directionsResult.routes[0]) {
        return [];
    }

    const leg = directionsResult.routes[0].legs[0];
    
    if (!leg || !leg.distance || !leg.duration) {
        return [];
    }

    // แปลงระยะทางจากเมตรเป็นกิโลเมตร
    const distanceKm = leg.distance.value / 1000;
    
    // แปลงเวลาจากวินาทีเป็นนาที
    const durationMin = Math.round(leg.duration.value / 60);

    return calculateAllRidePrices(distanceKm, durationMin, options);
}

/**
 * ฟอร์แมตราคาเป็นสตริง
 * @param {number} price - ราคา
 * @returns {string} ราคาที่ฟอร์แมตแล้ว
 */
export function formatPrice(price) {
    return `฿${price.toLocaleString('th-TH')}`;
}

/**
 * ตรวจสอบว่ารถพร้อมใช้งานหรือไม่ (ตาม availability)
 * @param {string} vehicleType - ประเภทรถ
 * @returns {boolean} true ถ้าพร้อมใช้งาน
 */
export function isVehicleAvailable(vehicleType) {
    const config = VEHICLE_CONFIG[vehicleType];
    if (!config) return false;
    
    // สุ่มตาม availability
    return Math.random() < config.availability;
}

