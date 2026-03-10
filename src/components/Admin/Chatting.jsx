// components/Chatting.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, AlertCircle } from 'lucide-react';
import { chattingMockData, addWarningMessage } from '../../data/Admin/ChatMockData';
import '../../styles/Admin/Chatting.css';

const Chatting = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState(chattingMockData.conversations);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll ไปข้อความล่าสุด
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  // Filter conversations ตามการค้นหา
  const filteredConversations = conversations.filter(conv =>
    conv.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.driverId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // เลือก conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // ทำให้ข้อความทั้งหมดเป็น read
    markAsRead(conversation.id);
  };

  // ทำเครื่องหมายว่าอ่านแล้ว
  const markAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
  };

  // ส่งข้อความ
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'admin-001',
      senderType: 'admin',
      senderName: 'Thunder (Admin)',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          lastMessageTime: newMessage.timestamp
        };
        setSelectedConversation(updatedConv);
        return updatedConv;
      }
      return conv;
    });

    setConversations(updatedConversations);
    setMessageInput('');
  };

  // เรนเดอร์ข้อความ
  const renderMessage = (message) => {
    const isAdmin = message.senderType === 'admin';
    const isWarning = message.isWarning;

    return (
      <div key={message.id} className={`message-row ${isAdmin ? 'admin' : 'driver'}`}>
        {isWarning && (
          <div className="warning-badge">
            <AlertCircle size={16} />
          </div>
        )}
        <div className={`message-bubble ${isWarning ? 'warning' : ''}`}>
          <p className="message-content">{message.content}</p>
          <span className="message-time">{message.timestamp}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="chatting-container">
      {/* Left Sidebar - Conversation List */}
      <div className="conversations-sidebar">
        <h2 className="sidebar-title">CHATTING</h2>

        {/* Search Box */}
        <div className="search-box-chat">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search Driver"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-chat"
          />
        </div>

        {/* Conversations List */}
        <div className="conversations-list">
          <div className="list-title">DRIVER</div>
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                selectedConversation?.id === conversation.id ? 'active' : ''
              } ${conversation.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="conversation-avatar">
                <img src={conversation.driverAvatar} alt={conversation.driverName} />
                <span className={`status-dot ${conversation.driverId === 'D005' ? 'offline' : 'online'}`}></span>
              </div>
              <div className="conversation-info">
                <div className="conversation-name">{conversation.driverName}</div>
                <div className="conversation-preview">
                  {conversation.lastMessage.substring(0, 30)}
                  {conversation.lastMessage.length > 30 ? '...' : ''}
                </div>
              </div>
              <div className="conversation-meta">
                <div className="conversation-time">{conversation.lastMessageTime}</div>
                {conversation.unreadCount > 0 && (
                  <div className="unread-badge">{conversation.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="chat-area">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <img
                  src={selectedConversation.driverAvatar}
                  alt={selectedConversation.driverName}
                  className="chat-header-avatar"
                />
                <div className="chat-header-info">
                  <h3 className="chat-driver-name">{selectedConversation.driverName}</h3>
                  <p className="chat-driver-id">{selectedConversation.driverId}</p>
                </div>
              </div>
              <div className="chat-header-status">
                <span className="status-text">
                  {selectedConversation.driverId === 'D005' ? 'Offline' : selectedConversation.driverId === 'D003' ? 'Away' : 'Online'}
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
              {selectedConversation.messages.length > 0 ? (
                <>
                  {selectedConversation.messages.map(msg => renderMessage(msg))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="no-messages">
                  <p>ยังไม่มีข้อความ</p>
                  <small>เริ่มการสนทนากับคนขับคนนี้</small>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
                disabled={!messageInput.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <div className="empty-state">
              <p className="empty-title">เลือกการสนทนา</p>
              <small>เลือกคนขับจากรายชื่อทางซ้าย</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatting;