import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/chatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '🎵 Hi! I\'m your music assistant. Ask me about music recommendations, genres, artists, or anything music-related!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('🚀 Sending message:', inputMessage); // Add this

      const response = await fetch('http://127.0.0.1:8080/api/chatbot/chat', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      console.log('📡 Response status:', response.status); // Add this
      console.log('📡 Response ok:', response.ok); // Add this

      const data = await response.json();
      console.log('📦 Response data:', data); // Add this

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response || 'Sorry, I couldn\'t generate a response.',
        timestamp: new Date()
      };

      console.log('🤖 Bot message:', botMessage); // Add this
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: '❌ Sorry, I\'m having trouble connecting. Please try again.',
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
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What are some good indie rock bands?",
    "I need energetic music for working out",
    "Give me my top 10 artists from last month",
    "What's trending in music right now?",
    "Tell me about jazz music"
  ];

  const askSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>🎵 Music Assistant</h2>
        <p>Ask me anything about music!</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggested-questions">
          <p>Try asking:</p>
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              className="suggestion-btn"
              onClick={() => askSuggestedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      )}

      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about music recommendations, artists, genres..."
            disabled={isLoading}
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;