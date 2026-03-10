// data/chattingMockData.js

const DEFAULT_ADMIN = {
  id: 'admin-001',
  name: 'Thunder (Admin)',
  email: 'Thunder@admin.com'
};

export const chattingMockData = {
  // ข้อมูลคนขับ (5 คน จาก liveMapData)
  drivers: [
    {
      id: 'D001',
      name: 'Somchai Jaidee',
      phone: '+66 81 234 5678',
      avatar: 'https://i.pravatar.cc/150?img=12',
      assignedAdmin: 'Thunder@admin.com',
      status: 'online' // online, offline, away
    },
    {
      id: 'D002',
      name: 'Pornthip Saengfang',
      phone: '+66 82 345 6789',
      avatar: 'https://i.pravatar.cc/150?img=47',
      assignedAdmin: 'Thunder@admin.com',
      status: 'online'
    },
    {
      id: 'D003',
      name: 'Wanchai Pattana',
      phone: '+66 83 456 7890',
      avatar: 'https://i.pravatar.cc/150?img=33',
      assignedAdmin: 'Thunder@admin.com',
      status: 'away'
    },
    {
      id: 'D004',
      name: 'Kiattisak Phothanut',
      phone: '+66 84 567 8901',
      avatar: 'https://i.pravatar.cc/150?img=52',
      assignedAdmin: 'Thunder@admin.com',
      status: 'online'
    },
    {
      id: 'D005',
      name: 'Narong Suksai',
      phone: '+66 85 678 9012',
      avatar: 'https://i.pravatar.cc/150?img=61',
      assignedAdmin: 'Thunder@admin.com',
      status: 'offline'
    }
  ],

  // ข้อมูลข้อความแชท
  conversations: [
    {
      id: 'conv-001',
      driverId: 'D001',
      driverName: 'Somchai Jaidee',
      driverAvatar: 'https://i.pravatar.cc/150?img=12',
      adminId: 'admin-001',
      adminName: 'Thunder@admin.com',
      lastMessage: 'รับทราบค่ะ จะดำเนินการแก้ไขทันที',
      lastMessageTime: '14:35',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-001',
          senderId: 'D001',
          senderType: 'driver', // 'driver' or 'admin'
          senderName: 'Somchai Jaidee',
          content: 'สวัสดีค่ะ มีปัญหาเรื่องการชำระเงินค่ะ',
          timestamp: '14:15',
          isRead: true
        },
        {
          id: 'msg-002',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: 'สวัสดีค่ะ ท่านมีปัญหาอะไรคะ',
          timestamp: '14:20',
          isRead: true
        },
        {
          id: 'msg-003',
          senderId: 'D001',
          senderType: 'driver',
          senderName: 'Somchai Jaidee',
          content: 'เงินที่ได้รับเมื่อวานยังไม่เข้าบัญชีค่ะ',
          timestamp: '14:25',
          isRead: true
        },
        {
          id: 'msg-004',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: 'ขอโทษค่ะ ฉันจะตรวจสอบให้ค่ะ',
          timestamp: '14:30',
          isRead: true
        },
        {
          id: 'msg-005',
          senderId: 'D001',
          senderType: 'driver',
          senderName: 'Somchai Jaidee',
          content: 'ขอบคุณค่ะ 🙏',
          timestamp: '14:32',
          isRead: true
        },
        {
          id: 'msg-006',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: 'รับทราบค่ะ จะดำเนินการแก้ไขทันที',
          timestamp: '14:35',
          isRead: true
        }
      ]
    },
    {
      id: 'conv-002',
      driverId: 'D002',
      driverName: 'Pornthip Saengfang',
      driverAvatar: 'https://i.pravatar.cc/150?img=47',
      adminId: 'admin-001',
      adminName: 'Thunder@admin.com',
      lastMessage: 'ตกลงค่ะ ขอบคุณที่แจ้ง',
      lastMessageTime: '13:42',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-101',
          senderId: 'D002',
          senderType: 'driver',
          senderName: 'Pornthip Saengfang',
          content: 'สวัสดีค่ะ รถเสีย ต้องนำไปซ่อม',
          timestamp: '13:30',
          isRead: true
        },
        {
          id: 'msg-102',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: 'ตกลงค่ะ ให้รถชำรุดหรือ?',
          timestamp: '13:35',
          isRead: true
        },
        {
          id: 'msg-103',
          senderId: 'D002',
          senderType: 'driver',
          senderName: 'Pornthip Saengfang',
          content: 'เครื่องยนต์มีเสียงผิดปกติค่ะ',
          timestamp: '13:38',
          isRead: true
        },
        {
          id: 'msg-104',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: 'ตกลงค่ะ ขอบคุณที่แจ้ง',
          timestamp: '13:42',
          isRead: true
        }
      ]
    },
    {
      id: 'conv-003',
      driverId: 'D003',
      driverName: 'Wanchai Pattana',
      driverAvatar: 'https://i.pravatar.cc/150?img=33',
      adminId: 'admin-001',
      adminName: 'Thunder@admin.com',
      lastMessage: '⚠️ [WARNING MESSAGE] ขับรถเร็วเกินไป ระวังจนรอบหน้า',
      lastMessageTime: 'today',
      unreadCount: 1,
      messages: [
        {
          id: 'msg-201',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: '⚠️ [WARNING MESSAGE] ขับรถเร็วเกินไป ระวังจนรอบหน้า',
          timestamp: 'today',
          isRead: false,
          isWarning: true
        }
      ]
    },
    {
      id: 'conv-004',
      driverId: 'D004',
      driverName: 'Kiattisak Phothanut',
      driverAvatar: 'https://i.pravatar.cc/150?img=52',
      adminId: 'admin-001',
      adminName: 'Thunder@admin.com',
      lastMessage: 'เข้าใจค่ะ จะปฏิบัติตามนโยบายอย่างเคร่งครัด',
      lastMessageTime: '11:20',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-301',
          senderId: 'admin-001',
          senderType: 'admin',
          senderName: 'Thunder (Admin)',
          content: '⚠️ [WARNING MESSAGE] ผู้โดยสารลับออกจากรถหลังปลายทาง',
          timestamp: '11:10',
          isRead: true,
          isWarning: true
        },
        {
          id: 'msg-302',
          senderId: 'D004',
          senderType: 'driver',
          senderName: 'Kiattisak Phothanut',
          content: 'เข้าใจค่ะ จะปฏิบัติตามนโยบายอย่างเคร่งครัด',
          timestamp: '11:20',
          isRead: true
        }
      ]
    },
    {
      id: 'conv-005',
      driverId: 'D005',
      driverName: 'Narong Suksai',
      driverAvatar: 'https://i.pravatar.cc/150?img=61',
      adminId: 'admin-001',
      adminName: 'Thunder@admin.com',
      lastMessage: 'ยังไม่มีข้อความ',
      lastMessageTime: '-',
      unreadCount: 0,
      messages: []
    }
  ]
};

// ฟังก์ชันเพิ่มข้อความใหม่ (สำหรับ warning message)
const findDriverProfile = (driverId) => {
  return chattingMockData.drivers.find((driver) => driver.id === driverId) || {
    id: driverId,
    name: `Driver ${driverId}`,
    avatar: 'https://via.placeholder.com/150?text=Driver',
    phone: '-',
    assignedAdmin: DEFAULT_ADMIN.email,
    status: 'online'
  };
};

const ensureConversation = (driverId) => {
  let conversation = chattingMockData.conversations.find((conv) => conv.driverId === driverId);

  if (!conversation) {
    const driverProfile = findDriverProfile(driverId);
    conversation = {
      id: `conv-${driverId}`,
      driverId: driverProfile.id,
      driverName: driverProfile.name,
      driverAvatar: driverProfile.avatar,
      adminId: DEFAULT_ADMIN.id,
      adminName: DEFAULT_ADMIN.email,
      lastMessage: '',
      lastMessageTime: '-',
      unreadCount: 0,
      messages: []
    };
    chattingMockData.conversations.push(conversation);
  }

  return conversation;
};

const pushAdminMessage = (conversation, content, extra = {}) => {
  const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const message = {
    id: `msg-${Date.now()}`,
    senderId: DEFAULT_ADMIN.id,
    senderType: 'admin',
    senderName: DEFAULT_ADMIN.name,
    content,
    timestamp,
    isRead: false,
    ...extra
  };

  conversation.messages.push(message);
  conversation.lastMessage = content;
  conversation.lastMessageTime = timestamp;
  conversation.unreadCount = (conversation.unreadCount || 0) + 1;

  return message;
};

export const addWarningMessage = (driverId, warningText) => {
  const conversation = ensureConversation(driverId);
  return pushAdminMessage(conversation, `⚠️ [WARNING MESSAGE] ${warningText}`, { isWarning: true });
};

export const addRejectionMessage = (driverId, reason) => {
  const conversation = ensureConversation(driverId);
  return pushAdminMessage(
    conversation,
    `🚫 เอกสารพิสูจน์ตัวตนถูกปฏิเสธ เนื่องจาก: ${reason}. กรุณาอัปโหลดเอกสารใหม่แล้วแจ้งเจ้าหน้าที่อีกครั้ง.`,
    { isWarning: true }
  );
};