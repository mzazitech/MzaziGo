// hooks/useWarningMessage.js
import { addWarningMessage } from '../../data/Admin/ChatMockData';

/**
 * Hook สำหรับส่ง warning message ไปยัง driver
 * ใช้ได้จากหน้า ViewDriver หรือที่อื่น ๆ
 */
export const useWarningMessage = () => {
  const sendWarning = (driverId, warningText) => {
    try {
      // เรียกฟังก์ชัน addWarningMessage จาก mock data
      const updatedConversation = addWarningMessage(driverId, warningText);

      // บันทึกลง localStorage เพื่อให้ข้อมูลถาวร (optional)
      const existingChats = JSON.parse(localStorage.getItem('chattingData')) || {};
      localStorage.setItem('chattingData', JSON.stringify({
        ...existingChats,
        [driverId]: updatedConversation
      }));

      return {
        success: true,
        message: 'Warning message sent successfully',
        conversation: updatedConversation
      };
    } catch (error) {
      console.error('Error sending warning message:', error);
      return {
        success: false,
        message: 'Failed to send warning message',
        error: error.message
      };
    }
  };

  return { sendWarning };
};

import { useWarningMessage } from '../hooks/useWarningMessage';

const handleSendWarning = () => {
  const warningText = prompt('Enter warning message:');
  if (warningText) {
    const { sendWarning } = useWarningMessage();
    const result = sendWarning(driver.id, warningText);
    
    if (result.success) {
      alert('✓ Warning message sent!');
      // อัปเดต UI ถ้าต้องการ
    } else {
      alert('Error: ' + result.message);
    }
  }
};
*/
