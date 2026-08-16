import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaMinus, FaRobot } from 'react-icons/fa';//import react-icons for use in our component
import '../css/Chatbot.css';
function Chatbot() {
  //state management to define the  component UI
  const [isOpen, setIsOpen] = useState(false);//ITS A BOOLEAN, THE CHATBOT CAN EITHER BE OPEN OR CLOSED
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to Ondrivo  Software Company. How can I help you today?", sender: 'bot' }
  ]);//ITS AN ARRAY OF AGGREGATED OBJECTS TO PROVIDE A MEANINGFUL REPLY TO THE USER
  const [input, setInput] = useState('');//A STRING FOR THE CLINT TO INPUT THEIR RELEVANT QUERY
  const [loading, setLoading] = useState(false);//A BOOLEAN TO MANAGE TRHE STATE OF THE SPINNER
  const [isMinimized, setIsMinimized] = useState(false);//A BOOLEAN TO MANAGE THE SIZE OF THE CHATBOT WINDOW
  const messagesEndRef = useRef(null);//USED TO SHOW THE END OF THE CLIENT - BOT MESSAGES
   
  //USED TTO TRACK THE END OF CLIENT-BOT MESSAGES
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);//RE-RUN THE COMPONENT AFTER EACH MESSAGE

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();//TRIM CLIENTS MESSAGE TO BUILD A QUERY
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);//USED A SPREAD OPERATOR TO ENSURE THE NEW MESSAGES DO NOT OVERWRITE THE CURRENT ONE
    setInput('');//INITIALIZE THE CHAT INTERFACE
    setLoading(true);//DEFINE LOADING STATE TO TRUE ON COMPONENT LOAD

    try {
      const res = await fetch('/api/chatbot', {//FETCH DATA FROM THE API IN THE BACKEND
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),//ALLOW SENDING OF THE USERS MESSAGES TO THE BACKEND
      });
      const data = await res.json();//ACCEPT THE API RESPONSE IN JSON FORMAT
      setMessages(prev => [...prev, {
        text: data.reply || "I'm not sure how to respond. Please contact us directly.",//GENERAL REPLY TO QUESTIONS LACKING RESPONSES
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

  const handleKeyPress = (e) => e.key === 'Enter' && handleSend();//ENSURE PRESSING ENTER SENDS THE REQUEST TO THE BACKEND
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);
  //RENDER OUR API RESPONSE AS JSX
  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header with Logo */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span>Ondrivo Software Company</span>
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
                  placeholder="Chat with Annabela, Ondrivo software company assistant..."
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