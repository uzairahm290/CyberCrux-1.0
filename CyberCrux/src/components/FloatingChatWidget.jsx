import React, { useState, useEffect } from 'react';
import { FaTimes} from 'react-icons/fa';
import { BiBot, BiChat } from 'react-icons/bi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import CyberCruxChatbot from './CyberCruxChatbot';
import './ChatbotAnimations.css';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Auto-hide widget when scrolling (optional enhancement)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Advanced Floating Chat Button */}
      {!isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-50'
          }`}
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-xl animate-pulse"></div>
          
          <button
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 group overflow-hidden"
            aria-label="Open CyberCrux AI Chat"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 animate-gradient-shift"></div>
            
            {/* Main Icon */}
            <div className="relative z-10 transition-all duration-300">
              {isHovered ? (
                <BiBot className="text-2xl animate-bounce" />
              ) : (
                <BiChat className="text-xl" />
              )}
            </div>
            
            {/* AI Badge */}
            <div className={`absolute -top-2 -right-2 transition-all duration-300 ${
              hasNewMessage ? 'animate-bounce' : ''
            }`}>
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <HiSparkles className="text-white text-xs" />
              </div>
              {hasNewMessage && (
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping"></div>
              )}
            </div>
            
            {/* Pulse Rings */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
          </button>
          
          {/* Advanced Tooltip */}
          <div className={`absolute right-full mr-4 bottom-0 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-xl min-w-max">
              <div className="flex items-center space-x-2 mb-1">
                <HiLightningBolt className="text-yellow-300 animate-pulse" />
                <span className="font-bold">CyberCrux AI</span>
              </div>
              <p className="text-xs text-gray-300">Ask me anything about cybersecurity!</p>
              
              {/* Tooltip Arrow */}
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white/10 border-r border-b border-white/20 transform rotate-45 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-particle-float opacity-60" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full animate-particle-float opacity-60" style={{ top: '70%', right: '30%', animationDelay: '2s' }}></div>
            <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full animate-particle-float opacity-60" style={{ bottom: '20%', left: '10%', animationDelay: '4s' }}></div>
          </div>
        </div>
      )}

      {/* Advanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] max-w-sm md:max-w-md lg:w-96 h-[calc(100vh-8rem)] max-h-[600px] md:h-[500px] z-50 animate-fade-in-up">
          {/* Window Background with Glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
          
          {/* Chat Window Content */}
          <div className="relative h-full">
            {/* Modern Close Button */}
            <button
              onClick={toggleChat}
              className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90 z-20 shadow-xl group"
              aria-label="Close chat"
            >
              <FaTimes className="text-xs md:text-sm transition-transform duration-300 group-hover:rotate-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/50 to-pink-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* Chatbot Component */}
            <div className="h-full rounded-3xl overflow-hidden">
              <CyberCruxChatbot />
            </div>
          </div>
          
          {/* Window Shadow/Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl -z-10 animate-glow-pulse"></div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;