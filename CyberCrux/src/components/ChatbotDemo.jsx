import React, { useState, useEffect } from 'react';
import CyberCruxChatbot from './CyberCruxChatbot';
import { FaArrowLeft, FaRobot, FaStar, FaCode} from 'react-icons/fa';
import { BiBot, BiChat, BiMicrophone } from 'react-icons/bi';
import { HiSparkles, HiLightningBolt, HiCode, HiDeviceMobile, HiDesktopComputer } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import './ChatbotAnimations.css';

const ChatbotDemo = () => {
  const [selectedView, setSelectedView] = useState('desktop');
  const [demoStats, setDemoStats] = useState({
    messagesExchanged: 0,
    responseTime: '< 1s',
    accuracy: '99.5%'
  });

  // Simulate some stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStats(prev => ({
        ...prev,
        messagesExchanged: prev.messagesExchanged + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-purple-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-purple-700/20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl -bottom-40 -right-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        <div className="absolute w-2 h-2 bg-blue-400/40 rounded-full animate-particle-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-purple-400/50 rounded-full animate-particle-float" style={{ top: '60%', right: '15%', animationDelay: '3s' }}></div>
        <div className="absolute w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-particle-float" style={{ top: '80%', left: '25%', animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Modern Header */}
        <div className="mb-12 animate-fade-in-up">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 group transition-all duration-300"
          >
            <FaArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-glow-pulse">
                <FaRobot className="text-white text-2xl" />
              </div>
            </div>
            
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-gradient-shift">
              CyberCrux AI
            </h1>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HiSparkles className="text-yellow-300 animate-pulse" />
              <p className="text-xl text-gray-300 font-medium">
                Next-Generation Cybersecurity Assistant
              </p>
              <HiSparkles className="text-yellow-300 animate-pulse" />
            </div>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of AI-powered cybersecurity learning with our advanced chatbot featuring instant FAQ responses and intelligent conversation capabilities.
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {[
              { label: 'Messages Exchanged', value: demoStats.messagesExchanged, icon: BiChat, color: 'blue' },
              { label: 'Avg Response Time', value: demoStats.responseTime, icon: HiLightningBolt, color: 'yellow' },
              { label: 'AI Accuracy', value: demoStats.accuracy, icon: FaStar, color: 'green' }
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  stat.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  <stat.icon className="text-xl" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 inline-flex">
            {[
              { id: 'desktop', label: 'Desktop View', icon: HiDesktopComputer },
              { id: 'mobile', label: 'Mobile View', icon: HiDeviceMobile }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedView === view.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <view.icon className="text-lg" />
                <span className="font-medium">{view.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Demo Grid */}
        <div className="grid xl:grid-cols-3 gap-8">
          {/* Main Chat Demo */}
          <div className="xl:col-span-2">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <BiBot className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Live Chat Demo</h2>
                    <p className="text-gray-400 text-sm">Interactive AI assistant in action</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              
              <div className={`transition-all duration-500 ${
                selectedView === 'mobile' ? 'max-w-sm mx-auto' : ''
              }`}>
                <div className="h-[600px] relative">
                  {selectedView === 'mobile' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      <div className="w-full h-full bg-black rounded-3xl overflow-hidden relative">
                        {/* Mobile Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                        <CyberCruxChatbot />
                      </div>
                    </div>
                  )}
                  
                  {selectedView === 'desktop' && (
                    <div className="h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                      <CyberCruxChatbot />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features Panel */}
          <div className="space-y-6">
            {/* Key Features */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <HiSparkles className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Key Features</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: HiLightningBolt, title: 'Instant FAQ', desc: 'Lightning-fast responses for common questions', color: 'yellow' },
                  { icon: BiBot, title: 'AI-Powered', desc: 'Advanced Gemini AI for complex topics', color: 'blue' },
                  { icon: HiCode, title: 'Copy & React', desc: 'Interactive message controls', color: 'purple' },
                  { icon: BiMicrophone, title: 'Voice Ready', desc: 'Future voice input support', color: 'green' }
                ].map((feature, index) => (
                  <div key={feature.title} className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      feature.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                      feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      <feature.icon className="text-sm" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                      <p className="text-gray-400 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <FaCode className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Quick Start</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300 font-medium text-sm mb-2">🚀 FAQ Questions (Instant):</p>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>"What is CyberCrux?"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>"How to start?"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>"What is SQL injection?"</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-purple-300 font-medium text-sm mb-2">🤖 AI Questions (Gemini):</p>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>"Explain zero-day vulnerabilities"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>"OWASP Top 10 security risks"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>"Network security best practices"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Code */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <HiCode className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Integration</h3>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-sm font-mono">
                <div className="text-green-400 mb-2">// Import the component</div>
                <div className="text-blue-400">import</div>{' '}
                <div className="text-yellow-400">CyberCruxChatbot</div>{' '}
                <div className="text-blue-400">from</div>{' '}
                <div className="text-green-300">'./components/CyberCruxChatbot'</div>
                <br />
                <br />
                <div className="text-green-400">// Use anywhere in your app</div>
                <div className="text-gray-300">{'<'}<span className="text-red-400">CyberCruxChatbot</span>{' />'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotDemo;