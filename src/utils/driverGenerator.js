/**
 * ระบบสุ่มข้อมูลคนขับ
 * สุ่มชื่อคนขับ, ทะเบียนรถ, เบอร์โทร, และ rating
 */

// รายชื่อคนขับ (ชื่อไทย)
const THAI_FIRST_NAMES = [
    "สมหมาย", "สมชาย", "สมศักดิ์", "ประเสริฐ", "วิชัย", "วราวุธ", "สุรชัย", "ธนพล",
    "กิตติ", "อรรถพล", "ธีรพงษ์", "พงศ์เทพ", "อานนท์", "ชาญชัย", "วิเชียร", "สมบูรณ์",
    "ประยุทธ์", "สุรศักดิ์", "ธนวัฒน์", "กฤษณะ", "อภิชัย", "ธีระ", "พงษ์ศักดิ์", "อานุภาพ",
    "ชัยวัฒน์", "วิศรุต", "สมเกียรติ", "ประพันธ์", "สุรินทร์", "ธนกฤต", "กิตติพงษ์", "อรรถกร"
];

const THAI_LAST_NAMES = [
    "วงศ์สวัสดิ์", "ศรีสุข", "ทองดี", "ใจดี", "สุขสวัสดิ์", "วัฒนา", "ประเสริฐ", "เจริญ",
    "สมบูรณ์", "รุ่งเรือง", "สุขเจริญ", "วัฒนานนท์", "ประทุม", "ศรีนวล", "ทองคำ", "ใจใส",
    "สุขใจ", "เจริญสุข", "ประเสริฐสุข", "วัฒนสุข", "สมบูรณ์สุข", "รุ่งเรืองสุข", "เจริญดี", "ประเสริฐดี"
];

// จังหวัดสำหรับทะเบียนรถ (ย่อ)
const PROVINCES = [
    "กท", "นน", "ปท", "สม", "ชบ", "นฐ", "อย", "สระบุรี",
    "ลบ", "ฉช", "ปราจีนบุรี", "สระแก้ว", "จันทบุรี", "ตราด", "ระยอง", "ชลบุรี",
    "รบ", "กพ", "นครสวรรค์", "อุทัยธานี", "ตาก", "กำแพงเพชร", "พิษณุโลก", "เพชรบูรณ์",
    "พิจิตร", "สุโขทัย", "อุตรดิตถ์", "แพร่", "น่าน", "พะเยา", "เชียงราย", "เชียงใหม่",
    "ลำปาง", "ลำพูน", "แม่ฮ่องสอน", "ตาก", "กาญจนบุรี", "ราชบุรี", "เพชรบุรี", "ประจวบ",
    "ชุมพร", "ระนอง", "สุราษฎร์ธานี", "นครศรีธรรมราช", "พังงา", "ภูเก็ต", "กระบี่", "ตรัง",
    "สตูล", "สงขลา", "ปัตตานี", "ยะลา", "นราธิวาส", "มุกดาหาร", "นครพนม", "สกลนคร",
    "กาฬสินธุ์", "มหาสารคาม", "ร้อยเอ็ด", "ยโสธร", "อำนาจเจริญ", "อุบลราชธานี", "ศรีสะเกษ", "สุรินทร์",
    "บุรีรัมย์", "นครราชสีมา", "ชัยภูมิ", "ขอนแก่น", "อุดรธานี", "เลย", "หนองคาย", "หนองบัวลำภู"
];

/**
 * สุ่มชื่อคนขับ
 * @returns {string} ชื่อคนขับ
 */
export function generateDriverName() {
    const firstName = THAI_FIRST_NAMES[Math.floor(Math.random() * THAI_FIRST_NAMES.length)];
    const lastName = THAI_LAST_NAMES[Math.floor(Math.random() * THAI_LAST_NAMES.length)];
    return `${firstName} ${lastName}`;
}

/**
 * สุ่มทะเบียนรถ (รูปแบบ: XX-XXXX หรือ XXX-XXXX)
 * @returns {string} ทะเบียนรถ
 */
export function generateLicensePlate() {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];

    // สุ่มตัวเลข 4 หลัก
    const numbers = Math.floor(1000 + Math.random() * 9000).toString();

    // บางจังหวัดใช้ 2 ตัวอักษร บางจังหวัดใช้ 3 ตัวอักษร
    // แต่เพื่อความง่ายจะใช้ 2 ตัวอักษรทั้งหมด
    return `${province.substring(0, 2)} ${numbers}`;
}

/**
 * สุ่มเบอร์โทรศัพท์ (รูปแบบ: 0XX-XXX-XXXX)
 * @returns {string} เบอร์โทรศัพท์
 */
export function generatePhoneNumber() {
    // สุ่ม prefix (08X, 09X, 06X)
    const prefixes = ['08', '09', '06'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // สุ่มตัวเลข 8 หลัก
    const number1 = Math.floor(1000 + Math.random() * 9000).toString();
    const number2 = Math.floor(1000 + Math.random() * 9000).toString();

    return `${prefix}${number1[0]}-${number1.substring(1)}-${number2}`;
}

/**
 * สุ่ม rating (4.0 - 5.0)
 * @returns {number} rating
 */
export function generateRating() {
    // สุ่ม rating ระหว่าง 4.0 ถึง 5.0
    const rating = 4.0 + Math.random() * 1.0;
    return Math.round(rating * 10) / 10; // ปัดเป็นทศนิยม 1 ตำแหน่ง
}

/**
 * สุ่มรุ่นรถ
 * @param {string} vehicleType - ประเภทรถ (Car, Taxi, Motobike, Van)
 * @returns {string} รุ่นรถ
 */
function getRandomVehicleModel(vehicleType = "Car") {
    const models = {
        Car: [
            "Toyota Camry", "Honda Accord", "Toyota Vios", "Honda City",
            "Nissan Almera", "Mazda 2", "Suzuki Swift", "Mitsubishi Attrage",
            "Toyota Corolla", "Honda Civic", "Nissan March", "Mazda 3",
            "MG 5", "Toyota Yaris"
        ],
        Taxi: [
            "Toyota Corolla Altis (เขียว-เหลือง)", "Toyota Corolla Altis (ชมพู)",
            "Toyota Corolla Altis (ฟ้า)", "Toyota Corolla Altis (เหลือง)",
            "Toyota Innova (เขียว-เหลือง)", "Nissan Sylphy (เขียว-เหลือง)"
        ],
        Motobike: [
            "Honda Wave 110i", "Honda Wave 125i", "Honda Click 125i", "Honda Click 150i",
            "Honda PCX 160", "Yamaha Grand Filano", "Yamaha Fino", "Honda Scoopy i",
            "Yamaha NMAX", "Honda Forza 350"
        ],
        Van: [
            "Toyota Commuter", "Toyota Hiace", "Hyundai H-1", "Toyota Alphard",
            "Toyota Vellfire", "Toyota Majesty"
        ]
    };

    // ถ้าไม่ระบุประเภท หรือประเภทไม่ถูกต้อง ให้ใช้ Car เป็นค่าเริ่มต้น
    const type = models[vehicleType] ? vehicleType : "Car";
    const selectedModels = models[type];

    return selectedModels[Math.floor(Math.random() * selectedModels.length)];
}

/**
 * สุ่มสีรถ
 * @returns {string} สีรถ
 */
function getRandomVehicleColor() {
    const colors = [
        "ขาว", "ดำ", "เงิน", "เทา", "แดง", "น้ำเงิน", "เขียว", "ทอง", "บรอนซ์เงิน", "น้ำตาล"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * สร้างข้อมูลคนขับทั้งหมด
 * @param {string} vehicleType - ประเภทรถ (Car, Taxi, Motobike, Van)
 * @returns {Object} ข้อมูลคนขับ
 */
export function generateDriverInfo(vehicleType = "Car") {
    return {
        name: generateDriverName(),
        licensePlate: generateLicensePlate(),
        phoneNumber: generatePhoneNumber(),
        rating: generateRating(),
        vehicleModel: getRandomVehicleModel(vehicleType),
        vehicleColor: getRandomVehicleColor()
    };
}

