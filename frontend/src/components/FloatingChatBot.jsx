import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/floating-chatbot.css';

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hey! I'm your music assistant. Ask me about your Spotify data or get music recommendations!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const formatMessage = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8080/api/chatbot/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I couldn\'t process that request.',
        sender: 'bot',
        timestamp: new Date(),
        hasSpotifyData: data.hasSpotifyData || false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '🤖 Sorry, I\'m having trouble connecting. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "👋 Hey! I'm your music assistant. Ask me about your Spotify data or get music recommendations!",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`floating-chat-button ${isOpen ? 'hidden' : ''}`} onClick={toggleChat}>
        <div className="chat-button-icon">
          <span className="chat-icon">🤖</span>
          <div className="chat-button-pulse"></div>
        </div>
        <div className="chat-button-tooltip">
          Chat with Music Assistant
        </div>
      </div>

      {/* Chat Widget */}
      <div className={`floating-chat-widget ${isOpen ? 'open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">🤖</div>
            <div className="chat-title">
              <h4>Music Assistant</h4>
              <span className="chat-status">🟢 Online</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="chat-action-btn" onClick={clearChat} title="Clear chat">
              🗑️
            </button>
            <button className="chat-close-btn" onClick={closeChat} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
                  {message.hasSpotifyData && (
                    <div className="spotify-badge">
                      <span>🎵</span>
                      <span>Based on your Spotify data</span>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
  <div className="message bot">
    <div className="message-content">
      <div className="typing-indicator">
        <div className="typing-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        
      </div>
    </div>
  </div>
)}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your music, playlists, tracks..."
              className="chat-input"
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              className={`chat-send-btn ${inputMessage.trim() && !isLoading ? 'active' : ''}`}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
          <div className="chat-suggestions">
          <button 
            className="suggestion-chip" 
            onClick={() => setInputMessage('Give me my top 10 artists from last month')}
            disabled={isLoading}
          >
            🎵 Top artists
          </button>
          <button 
            className="suggestion-chip" 
            onClick={() => setInputMessage('Show me my playlists')}
            disabled={isLoading}
          >
            📋 My playlists
          </button>
          <button 
            className="suggestion-chip" 
            onClick={() => setInputMessage('Give me my top 20 tracks')}
            disabled={isLoading}
          >
            🎧 Top tracks
          </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chat-backdrop" onClick={closeChat}></div>}
    </>
  );
};

export default FloatingChatBot;