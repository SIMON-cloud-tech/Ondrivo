import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaMinus, FaRobot } from 'react-icons/fa';
import '../css/Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to Ondrivo — Industrial Process & Systems Engineering. How can I assist you with your laboratory, manufacturing, or industrial software needs today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        text: data.reply || "I'm not sure how to respond. Please contact us directly for industrial software inquiries.",
        sender: 'bot'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleSend();
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span>Ondrivo — Industrial Engineering</span>
            </div>
            <div className="chatbot-header-actions">
              <button onClick={toggleMinimize} className="chatbot-minimize-btn">
                <FaMinus size={14} />
              </button>
              <button onClick={toggleChat} className="chatbot-close-btn">
                <FaTimes size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chatbot-message ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="chatbot-avatar">
                        <FaRobot size={14} />
                      </div>
                    )}
                    <div className="chatbot-bubble">{msg.text}</div>
                  </div>
                ))}
                {loading && (
                  <div className="chatbot-message bot">
                    <div className="chatbot-avatar"><FaRobot size={14} /></div>
                    <div className="chatbot-bubble typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about LIMS, process dashboards, or industrial software solutions..."
                  disabled={loading}
                />
                <button onClick={handleSend} disabled={loading || !input.trim()}>
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;