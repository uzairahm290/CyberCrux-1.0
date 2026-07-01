"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BiSend, BiBot, BiUser, BiCopy, BiLike, BiDislike } from 'react-icons/bi';
import { FaRobot, FaStar, FaKeyboard } from 'react-icons/fa';
import { HiLightningBolt, HiSparkles } from 'react-icons/hi';
import "./ChatbotAnimations.css";

const CyberCruxChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your CyberCrux AI assistant. Ask me anything about cybersecurity!",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messageReactions, setMessageReactions] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // FAQ object for instant responses
  const faq = {
    "what is cybercrux": "CyberCrux is an AI-powered cybersecurity interview and practice platform to help learners improve their skills.",
    "how to start": "Sign up, choose a cybersecurity topic, and start practicing questions or challenges.",
    "what is sql injection": "SQL injection is a type of attack where an attacker manipulates a database query by injecting malicious SQL code.",
    "how do i reset my password": "Go to your account settings, click 'Change Password', and follow the steps.",
    "what is a firewall": "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
    "what is phishing": "Phishing is a type of social engineering attack used to steal user data, including login credentials and credit card numbers.",
    "what is malware": "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems.",
    "what is encryption": "Encryption is the process of converting information or data into a code to prevent unauthorized access.",
    "help": "I can help you with cybersecurity questions, CyberCrux platform guidance, and general security concepts. Just ask me anything!"
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if message matches FAQ
  const checkFAQ = (message) => {
    const normalizedMessage = message.toLowerCase().trim();
    for (const [key, value] of Object.entries(faq)) {
      if (normalizedMessage.includes(key)) {
        return value;
      }
    }
    return null;
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Check FAQ first
    const faqResponse = checkFAQ(inputMessage);
    
    if (faqResponse) {
      // Instant FAQ response
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: faqResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500); // Small delay for natural feel
    } else {
      // Call API for complex questions
      setIsTyping(true);
      
      try {
        const response = await axios.post((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555') + '/api/chat', {
          message: inputMessage
        });

        const botMessage = {
          id: Date.now() + 1,
          text: response.data.reply,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Chat API error:', error);
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Copy message to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show toast notification (could be enhanced with a toast library)
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle message reactions
  const handleReaction = (messageId, reaction) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: reaction
    }));
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[500px] max-h-[600px] md:max-h-[500px] relative">
      {/* Advanced Background with Animated Gradients */}
      <div className="absolute inset-0 bg-[#080808]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-700/10 via-transparent to-red-900/10"></div>
      <div className="absolute inset-0 bg-[#080808]/80 border border-red-900/20 rounded-2xl"></div>
      
      {/* Floating Particles Animation */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute w-2 h-2 bg-red-500/20 rounded-full animate-ping" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
        <div className="absolute w-1 h-1 bg-red-600/30 rounded-full animate-ping" style={{top: '60%', right: '15%', animationDelay: '2s'}}></div>
        <div className="absolute w-1.5 h-1.5 bg-orange-500/20 rounded-full animate-ping" style={{top: '80%', left: '20%', animationDelay: '4s'}}></div>
      </div>

      {/* Modern Header with Glassmorphism */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-[#0C0C0C] border-b border-red-900/30 shadow-md">
        <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
          {/* Advanced Avatar with Glow Effect */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600/15 border border-red-600/30 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <FaRobot className="text-red-400 text-lg md:text-xl" />
              <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-lg -z-10 animate-pulse"></div>
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-[#0C0C0C] shadow-lg animate-bounce">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-base md:text-lg tracking-wide truncate">CyberCrux AI</h3>
              <HiSparkles className="text-red-500 animate-pulse flex-shrink-0" />
            </div>
            <div className="flex items-center space-x-2">
              {isTyping ? (
                <>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-red-400 text-xs md:text-sm font-medium truncate">AI is analyzing...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs md:text-sm font-medium truncate">Online & Ready</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* AI Status Badge */}
        <div className="flex items-center space-x-1 md:space-x-2 bg-[#141414] px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-red-900/30 flex-shrink-0 shadow-inner">
          <HiLightningBolt className="text-red-500 animate-pulse text-xs md:text-sm" />
          <span className="text-gray-300 text-xs font-semibold hidden sm:inline">AI Powered</span>
          <span className="text-gray-300 text-xs font-semibold sm:hidden">AI</span>
        </div>
      </div>

      {/* Messages Container with Advanced Scrolling */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 bg-transparent scrollbar-hide">
        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-hide::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .scrollbar-hide::-webkit-scrollbar-thumb {
            background: rgba(220, 38, 38, 0.5);
            border-radius: 10px;
          }
          .scrollbar-hide::-webkit-scrollbar-thumb:hover {
            background: rgba(220, 38, 38, 0.7);
          }
        `}</style>

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex items-start space-x-2 md:space-x-3 max-w-[90%] md:max-w-[85%] group ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Advanced Avatar */}
              <div className={`relative flex-shrink-0 ${
                message.sender === 'user' ? 'order-last' : 'order-first'
              }`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                  message.sender === 'user' 
                    ? 'bg-red-600/20 border border-red-600/30 text-red-400' 
                    : 'bg-red-600 text-white'
                }`}>
                  {message.sender === 'user' ? (
                    <BiUser className="text-sm md:text-lg" />
                  ) : (
                    <BiBot className="text-sm md:text-lg" />
                  )}
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl blur-lg opacity-30 transition-opacity duration-300 group-hover:opacity-50 ${
                    message.sender === 'user' 
                      ? 'bg-red-600' 
                      : 'bg-red-500'
                  }`}></div>
                </div>
                
                {/* Online Status for Bot */}
                {message.sender === 'bot' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse"></div>
                )}
              </div>

              {/* Advanced Message Bubble */}
              <div className={`relative group-hover:scale-[1.02] transition-all duration-300 ${
                message.sender === 'user' ? 'order-first' : 'order-last'
              }`}>
                {/* Message Content */}
                <div className={`relative px-4 py-3 md:px-6 md:py-4 rounded-3xl shadow-xl transition-all duration-300 ${
                  message.sender === 'user'
                    ? 'bg-red-600/20 text-white border border-red-600/30 rounded-br-lg'
                    : 'bg-[#141414] text-gray-300 border border-red-900/20 rounded-bl-lg'
                }`}>
                  {/* Special Welcome Message */}
                  {message.type === 'welcome' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <HiSparkles className="text-red-500 animate-pulse" />
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Welcome</span>
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                  
                  {/* Message Actions (for bot messages) */}
                  {message.sender === 'bot' && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-900/20">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="text-gray-500 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/5"
                          title="Copy message"
                        >
                          <BiCopy className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, 'like')}
                          className={`transition-colors duration-200 p-1 rounded-lg hover:bg-white/5 ${
                            messageReactions[message.id] === 'like' ? 'text-green-500' : 'text-gray-500 hover:text-green-400'
                          }`}
                          title="Like"
                        >
                          <BiLike className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, 'dislike')}
                          className={`transition-colors duration-200 p-1 rounded-lg hover:bg-white/5 ${
                            messageReactions[message.id] === 'dislike' ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                          title="Dislike"
                        >
                          <BiDislike className="text-xs" />
                        </button>
                      </div>
                      
                      <span className="text-xs text-gray-500 font-medium">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  {/* User Message Timestamp */}
                  {message.sender === 'user' && (
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-red-200 opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Tail */}
                <div className={`absolute top-4 w-0 h-0 ${
                  message.sender === 'user' 
                    ? 'right-0 border-l-[8px] border-l-red-600/30 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent translate-x-[7px]'
                    : 'left-0 border-r-[8px] border-r-[#141414] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent -translate-x-[7px]'
                }`}></div>
              </div>
            </div>
          </div>
        ))}

        {/* Advanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-red-600/15 border border-red-600/30 flex items-center justify-center shadow-lg">
                  <BiBot className="text-red-400 text-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-red-600/20 blur-lg animate-pulse"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse"></div>
              </div>
              
              <div className="bg-[#141414] border border-red-900/20 rounded-3xl rounded-bl-lg px-6 py-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">AI is analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Advanced Input Area */}
      <div className="relative z-10 p-3 md:p-6 bg-[#0C0C0C] border-t border-red-900/30">
        {/* Main Input Container */}
        <div className="relative">
          <div className="flex items-end space-x-2 md:space-x-3">
            {/* Advanced Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about cybersecurity..."
                className="w-full bg-[#141414] border border-red-900/30 rounded-2xl px-4 py-3 pr-12 md:px-6 md:py-4 md:pr-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600/50 transition-all duration-300 shadow-inner text-sm md:text-base"
                disabled={isTyping}
              />
              
              {/* Input Decorations */}
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 md:space-x-2">
                {inputMessage && (
                  <span className="text-xs text-gray-500 font-medium hidden md:inline">
                    {inputMessage.length}/500
                  </span>
                )}
                <FaKeyboard className="text-gray-600 text-xs md:text-sm" />
              </div>
              
              {/* Input Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-red-600/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Advanced Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-red-600 hover:bg-red-500 disabled:bg-[#1A1A1A] disabled:border disabled:border-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:scale-100 shadow-xl flex items-center justify-center group overflow-hidden border border-transparent"
            >
              <BiSend className="text-sm md:text-lg relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              
              {/* Button Glow */}
              <div className="absolute inset-0 bg-red-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-3 md:mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <HiLightningBolt className="text-red-500" />
              <span className="hidden sm:inline">AI Ready</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className="hidden md:inline text-gray-400">Powered by Gemini</span>
            <span className="md:hidden text-gray-400">Gemini</span>
            <FaStar className="text-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberCruxChatbot;