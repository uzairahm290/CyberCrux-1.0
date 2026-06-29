"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from 'next/navigation';
import DashNav from "@/layouts/DashNav";
import Footer from "@/layouts/Footer";
import { 
  FaArrowLeft, FaPlay, FaPause, FaClock, FaTrophy, 
  FaChartLine, FaCheckCircle, FaTimes, FaArrowRight, FaRedo,
  FaLightbulb, FaExclamationTriangle, FaInfoCircle, FaTerminal, 
  FaShieldAlt, FaServer, FaLock, FaGlobe, FaSearch, FaBug, FaKey, FaNetworkWired,
  FaBook, FaVideo, FaCode, FaLink, FaExternalLinkAlt, FaDownload
} from "react-icons/fa";
import { HiLightningBolt, HiSparkles } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";

export default function PracticeScenarioPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionFeedback, setQuestionFeedback] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHintNotification, setShowHintNotification] = useState(false);
  const [showCustomNotification, setShowCustomNotification] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [customNotificationMessage, setCustomNotificationMessage] = useState('');
  
  // Tactical typing effect ref
  const terminalEndRef = useRef(null);

  // Fetch scenario and questions from API
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555')}/api/practice/scenarios/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setCurrentScenario(data.data);
          const timeEstimate = data.data.time_estimate || data.data.timeEstimate || "15 min";
          const minutes = parseInt(timeEstimate.split(' ')[0]) || 15;
          setTimer(minutes * 60);
        } else {
          setError('Failed to fetch scenario');
        }
      } catch (err) {
        console.error('Error fetching scenario:', err);
        setError('Failed to fetch scenario');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchScenario();
    }
  }, [id]);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user || !currentScenario) return;
      try {
        const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555') + '/api/practice/progress', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          const userProgress = data.data.find(item => item.scenario_id === parseInt(id));
          if (userProgress) {
            setCompleted(userProgress.is_completed);
            setScore(userProgress.score || 0);
          }
        }
      } catch (err) {
        console.error('Error fetching user progress:', err);
      }
    };
    fetchUserProgress();
  }, [user, currentScenario, id]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsActive(false);
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timer]);

  const startScenario = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseScenario = () => {
    setIsPaused(!isPaused);
  };

  const calculateScore = useCallback(async () => {
    if (!currentScenario || !currentScenario.questions) return;
    let totalScore = 0;
    let maxScore = 0;
    
    currentScenario.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || '';
      const correctAnswer = question.correct_answer;
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      if (isCorrect) totalScore += question.points;
      maxScore += question.points;
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);
    setScore(finalScore);
    setShowResults(true);
    setCompleted(true);
    setIsActive(false);

    // Save progress
    if (!user) return;
    try {
      const answers = currentScenario.questions.map((_, index) => userAnswers[index] || '');
      await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555') + '/api/practice/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scenarioId: parseInt(id), answers: answers })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [currentScenario, userAnswers, id, user]);

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const checkScenarioCompletion = () => {
    if (!currentScenario?.questions) return false;
    const allCompleted = currentScenario.questions.every((_, index) => questionFeedback[index]?.isCorrect);
    if (allCompleted && !showResults) {
      calculateScore();
    }
    return allCompleted;
  };

  const getCompletionPercentage = () => {
    if (!currentScenario?.questions) return 0;
    const completedCount = Object.keys(questionFeedback).filter(key => questionFeedback[key]?.isCorrect).length;
    return Math.round((completedCount / currentScenario.questions.length) * 100);
  };

  const getCompletedCount = () => {
    if (!currentScenario?.questions) return 0;
    return Object.keys(questionFeedback).filter(key => questionFeedback[key]?.isCorrect).length;
  };

  const nextQuestion = () => {
    if (currentQuestion < currentScenario.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const retryScenario = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuestionFeedback({});
    setShowResults(false);
    setScore(0);
    setCompleted(false);
    setIsActive(false);
    setIsPaused(false);
    const timeEstimate = currentScenario.time_estimate || currentScenario.timeEstimate || "15 min";
    const minutes = parseInt(timeEstimate.split(' ')[0]) || 15;
    setTimer(minutes * 60);
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'web': return <FaGlobe />;
      case 'forensics': return <FaSearch />;
      case 'crypto': return <FaKey />;
      case 'reverse': return <FaBug />;
      case 'network': return <FaNetworkWired />;
      case 'osint': return <FaLock />;
      default: return <FaTerminal />;
    }
  };

  // Tactical Text Rendering
  const renderTacticalText = (text) => {
    if (!text) return null;
    if (text.includes('<') && text.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: text }} className="prose prose-invert prose-red max-w-none" />;
    }
    return text.split('\n').map((line, idx) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = line.split(urlRegex);
      return (
        <p key={idx} className="mb-2 leading-relaxed text-gray-300">
          {parts.map((part, pIdx) => {
            if (part.match(urlRegex)) {
              return <a key={pIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-4">{part}</a>;
            } else if (part.trim().startsWith('`') && part.trim().endsWith('`')) {
              return <code key={pIdx} className="bg-red-950/50 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50 font-mono text-sm">{part.replace(/`/g, '')}</code>;
            } else if (part.trim().startsWith('**') && part.trim().endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-white">{part.replace(/\*\*/g, '')}</strong>;
            } else {
              return part;
            }
          })}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80000012_1px,transparent_1px),linear-gradient(to_bottom,#80000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-red-900/30 border-t-red-500 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-mono text-red-500 tracking-widest uppercase animate-pulse">ESTABLISHING UPLINK...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (error || !currentScenario) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80000012_1px,transparent_1px),linear-gradient(to_bottom,#80000012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 bg-[#0C0C0C] border border-red-900/50 p-8 rounded-2xl max-w-lg w-full text-center shadow-2xl shadow-red-900/20">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">Connection Failed</h2>
            <p className="text-gray-400 mb-8 font-mono">{error || "Target scenario not found in database."}</p>
            <button 
              onClick={() => router.push('/practice')} 
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-red-600/20"
            >
              <FaArrowLeft /> Abort Mission
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = currentScenario.questions && currentScenario.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-red-500/30">
      <DashNav />
      
      {/* Tactical Background Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80000012_1px,transparent_1px),linear-gradient(to_bottom,#80000012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-900/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* Top Command Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-900/30">
          <button
            onClick={() => router.push('/practice')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0C0C0C] border border-red-900/50 rounded-lg text-gray-400 hover:text-white hover:border-red-500 transition-all duration-300 font-mono text-sm uppercase tracking-wider group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Disconnect
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-lg font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-400 uppercase tracking-widest">Live Target</span>
            </div>
            {currentScenario.file_url && (
              <button
                onClick={() => window.open(currentScenario.file_url, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg font-mono text-sm uppercase transition-all hover:scale-105"
              >
                <FaDownload /> Download Assets
              </button>
            )}
          </div>
        </div>

        {!isActive && !showResults ? (
          // Pre-mission Briefing Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            
            {/* Left Column: Mission Briefing */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-[#0C0C0C]/80 backdrop-blur-xl border border-red-900/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-black">
                {/* Decorative Terminal Header */}
                <div className="absolute top-0 left-0 w-full h-8 bg-red-950/40 border-b border-red-900/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  <span className="ml-2 font-mono text-xs text-red-500/50 tracking-widest">MISSION_BRIEFING.EXE</span>
                </div>
                
                <div className="mt-6 flex flex-col gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 tracking-tight mb-4 uppercase">
                      {currentScenario.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
                      <span className="px-3 py-1 bg-red-950/50 border border-red-900/50 text-red-400 rounded">
                        {currentScenario.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-[#141414] border border-gray-800 text-gray-400 rounded flex items-center gap-2">
                        <FaClock className="text-gray-500"/> {currentScenario.time_estimate || currentScenario.timeEstimate}
                      </span>
                      <span className="px-3 py-1 bg-[#141414] border border-gray-800 text-gray-400 rounded flex items-center gap-2">
                        <BiTargetLock className="text-gray-500"/> {currentScenario.questions?.length || 0} Objectives
                      </span>
                      <span className="px-3 py-1 bg-yellow-950/30 border border-yellow-900/30 text-yellow-500 rounded flex items-center gap-2">
                        <HiLightningBolt /> {currentScenario.points} PTS
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-red-900/50 via-red-500/20 to-transparent"></div>

                  <div className="font-mono text-sm leading-relaxed text-gray-300">
                    <h3 className="text-red-500 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                      <FaTerminal /> Overview
                    </h3>
                    <div className="bg-[#050505] p-4 rounded border border-red-900/20 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {renderTacticalText(currentScenario.description)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Execution Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#0C0C0C]/80 backdrop-blur-xl border border-red-900/30 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden h-full justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0,transparent_70%)] pointer-events-none"></div>
                
                <div className="relative w-32 h-32 mb-8 group">
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 border-2 border-red-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                  <div className="absolute inset-2 border border-red-500/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                  <button
                    onClick={startScenario}
                    className="absolute inset-4 bg-gradient-to-br from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-300 hover:scale-110 z-10"
                  >
                    <FaPlay className="w-10 h-10 ml-2" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Initiate Hack</h2>
                <p className="text-gray-400 font-mono text-sm mb-8">Authorize execution of exploitation sequence.</p>

                <div className="w-full bg-[#141414] border border-red-900/20 rounded p-4 text-left font-mono text-xs text-gray-500 space-y-2">
                  <div className="flex justify-between"><span>TARGET:</span> <span className="text-red-400">{currentScenario.category}</span></div>
                  <div className="flex justify-between"><span>PAYLOADS:</span> <span className="text-red-400">{currentScenario.questions?.length || 0}</span></div>
                  <div className="flex justify-between"><span>TIMEOUT:</span> <span className="text-red-400">{currentScenario.time_estimate}</span></div>
                </div>
              </div>
            </div>

          </div>
        ) : isActive && currentQ && currentScenario.questions && currentScenario.questions.length > 0 ? (
          // Active Mission HUD
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full">
            
            {/* Left Panel: Target Info & Progress */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* HUD Status */}
              <div className="bg-[#0C0C0C]/90 border border-red-900/40 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gray-500 uppercase">System Time</span>
                  <span className={`font-mono text-xl font-bold ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-gray-200'}`}>
                    {formatTime(timer)}
                  </span>
                </div>
                <div className="w-full bg-[#141414] h-1 rounded overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${timer < 60 ? 'bg-red-600' : 'bg-gray-500'}`}
                    style={{ width: `${(timer / (parseInt((currentScenario.time_estimate||"15").split(' ')[0]) * 60)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-[#0C0C0C]/90 border border-red-900/40 rounded-xl flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-red-900/30 bg-red-950/20">
                  <h3 className="font-mono text-sm font-bold text-red-500 uppercase flex items-center gap-2">
                    <BiTargetLock /> Objectives ({getCompletedCount()}/{currentScenario.questions.length})
                  </h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {currentScenario.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-full text-left p-3 rounded border font-mono text-xs flex items-center gap-3 transition-all ${
                        idx === currentQuestion 
                          ? 'bg-red-900/20 border-red-500 text-red-400' 
                          : questionFeedback[idx]?.isCorrect
                            ? 'bg-green-900/10 border-green-900/30 text-green-500'
                            : 'bg-[#141414] border-gray-800 text-gray-500 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        questionFeedback[idx]?.isCorrect ? 'border-green-500 bg-green-500/20' : 
                        idx === currentQuestion ? 'border-red-500 bg-red-500/20' : 'border-gray-600'
                      }`}>
                        {questionFeedback[idx]?.isCorrect && <FaCheckCircle className="w-2.5 h-2.5 text-green-500" />}
                      </div>
                      Payload 0x{String(idx + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Panel: Terminal Execution */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <div className="bg-[#0C0C0C]/90 backdrop-blur-xl border border-red-900/40 rounded-xl flex-1 flex flex-col overflow-hidden relative shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#050505] border-b border-red-900/30">
                  <div className="flex items-center gap-3">
                    <FaTerminal className="text-red-500" />
                    <span className="font-mono text-sm text-gray-400">root@cybercrux:~/{currentScenario.category}/payload-0x{String(currentQuestion + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-mono text-xs rounded">
                      REWARD: {currentQ.points} PTS
                    </span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col">
                  <div className="mb-8 font-mono text-base md:text-lg text-gray-200 leading-relaxed">
                    <div className="text-red-500 mb-4 flex items-center gap-2">
                      <span className="animate-pulse">{'>'}</span> Analyzing target parameters...
                    </div>
                    {currentQ.question_text}
                  </div>

                  <div className="mt-auto">
                    <label className="block font-mono text-xs text-gray-500 mb-3 uppercase tracking-widest">
                      Inject Payload:
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-600/5 blur-md rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center bg-[#050505] border border-red-900/50 rounded-lg overflow-hidden focus-within:border-red-500 transition-colors">
                        <div className="px-4 text-red-500 font-mono font-bold">{'>'}</div>
                        <input
                          type="text"
                          className="w-full bg-transparent py-4 text-white font-mono text-lg focus:outline-none disabled:opacity-50"
                          placeholder="Enter execution sequence..."
                          value={userAnswers[currentQuestion] || ""}
                          onChange={(e) => {
                            if (!questionFeedback[currentQuestion]?.isCorrect) {
                              handleAnswer(e.target.value);
                            }
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !questionFeedback[currentQuestion]?.isCorrect) {
                              e.preventDefault();
                              const userAnswer = userAnswers[currentQuestion] || '';
                              const isCorrect = userAnswer.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
                              
                              setQuestionFeedback(prev => ({
                                ...prev,
                                [currentQuestion]: {
                                  isCorrect,
                                  message: isCorrect ? 'ACCESS GRANTED' : 'ACCESS DENIED: Invalid sequence',
                                  userAnswer,
                                  correctAnswer: currentQ.correct_answer
                                }
                              }));
                              
                              if (isCorrect && checkScenarioCompletion()) {}
                            }
                          }}
                          disabled={questionFeedback[currentQuestion]?.isCorrect}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                      <button
                        onClick={() => {
                          const userAnswer = userAnswers[currentQuestion] || '';
                          const isCorrect = userAnswer.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
                          setQuestionFeedback(prev => ({
                            ...prev,
                            [currentQuestion]: {
                              isCorrect,
                              message: isCorrect ? 'ACCESS GRANTED' : 'ACCESS DENIED: Invalid sequence',
                              userAnswer,
                              correctAnswer: currentQ.correct_answer
                            }
                          }));
                          if (isCorrect && checkScenarioCompletion()) {}
                        }}
                        disabled={!userAnswers[currentQuestion] || questionFeedback[currentQuestion]?.isCorrect}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-[#141414] disabled:text-gray-500 disabled:border-gray-800 disabled:cursor-not-allowed text-white font-mono font-bold uppercase tracking-widest rounded transition-all border border-transparent shadow-[0_0_15px_rgba(220,38,38,0.2)] disabled:shadow-none"
                      >
                        Execute
                      </button>

                      <button
                        onClick={() => {
                          setCurrentHint(currentQ.explanation || "Analyze the provided parameters closely. Look for common misconfigurations.");
                          setShowHintNotification(true);
                          setTimeout(() => setShowHintNotification(false), 5000);
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-[#141414] hover:bg-[#1a1a1a] border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-sm uppercase rounded flex items-center justify-center gap-2 transition-all"
                      >
                        <FaLightbulb className="text-yellow-500" /> Request Intel
                      </button>

                      <div className="flex-1"></div>

                      <button
                        onClick={() => {
                          if (currentQuestion === currentScenario.questions.length - 1) {
                            if (currentScenario.questions.every((_, i) => questionFeedback[i]?.isCorrect)) {
                              calculateScore();
                            } else {
                              setCustomNotificationMessage('All payloads must be successfully injected before extraction.');
                              setShowCustomNotification(true);
                              setTimeout(() => setShowCustomNotification(false), 5000);
                            }
                          } else {
                            nextQuestion();
                          }
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 font-mono text-sm uppercase rounded flex items-center justify-center gap-2 transition-all"
                      >
                        {currentQuestion === currentScenario.questions.length - 1 ? 'Extract' : 'Next Target'} <FaArrowRight />
                      </button>
                    </div>

                    {/* Feedback Console */}
                    {questionFeedback[currentQuestion] && (
                      <div className={`mt-6 p-4 rounded border font-mono text-sm flex items-start gap-3 animate-fade-in ${
                        questionFeedback[currentQuestion].isCorrect 
                          ? 'bg-green-900/10 border-green-500/30 text-green-400' 
                          : 'bg-red-900/10 border-red-500/30 text-red-400'
                      }`}>
                        {questionFeedback[currentQuestion].isCorrect ? <FaCheckCircle className="mt-0.5" /> : <FaTimes className="mt-0.5" />}
                        <div>
                          <div className="font-bold mb-1">{questionFeedback[currentQuestion].message}</div>
                          {questionFeedback[currentQuestion].isCorrect && checkScenarioCompletion() && (
                            <div className="mt-2 pt-2 border-t border-green-500/30 text-green-300 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                              All payloads injected. Extraction sequence initiated...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isActive && (!currentScenario.questions || currentScenario.questions.length === 0) ? (
          <div className="bg-[#0C0C0C]/80 border border-red-900/30 rounded-2xl p-8 text-center flex-1 flex flex-col items-center justify-center">
            <FaExclamationTriangle className="w-16 h-16 text-yellow-500 mb-6" />
            <h2 className="text-2xl font-mono text-white mb-4 uppercase">No Payloads Found</h2>
            <p className="text-gray-400 font-mono mb-8">This target has no configurable parameters yet.</p>
            <button onClick={() => setIsActive(false)} className="px-6 py-3 bg-red-600 text-white font-mono rounded">Return to Base</button>
          </div>
        ) : null}

        {/* Post-Mission Debrief Modal */}
        {showResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="relative z-10 w-full max-w-3xl bg-[#0C0C0C] border border-red-900/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-fade-in-up">
              
              {/* Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-red-950/50 to-[#0C0C0C] border-b border-red-900/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-mono text-red-500 tracking-widest uppercase mb-1">Mission Accomplished</h2>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tight">{currentScenario.title}</h1>
                </div>
                <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                  <FaShieldAlt className="text-3xl text-red-500" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-8 grid grid-cols-3 gap-6 border-b border-red-900/30 bg-[linear-gradient(to_right,#80000005_1px,transparent_1px),linear-gradient(to_bottom,#80000005_1px,transparent_1px)] bg-[size:16px_16px]">
                <div className="bg-[#050505] border border-red-900/30 rounded-lg p-6 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaChartLine className="text-red-500 text-2xl mx-auto mb-3" />
                  <div className="text-4xl font-black text-white mb-1">{score}%</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Efficiency</div>
                </div>
                
                <div className="bg-[#050505] border border-red-900/30 rounded-lg p-6 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <HiLightningBolt className="text-yellow-500 text-2xl mx-auto mb-3" />
                  <div className="text-4xl font-black text-white mb-1">{currentScenario.points}</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Points Secured</div>
                </div>

                <div className="bg-[#050505] border border-red-900/30 rounded-lg p-6 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaClock className="text-blue-500 text-2xl mx-auto mb-3" />
                  <div className="text-4xl font-black text-white mb-1">
                    {formatTime(parseInt((currentScenario.time_estimate||"15").split(' ')[0])*60 - timer)}
                  </div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Time Elapsed</div>
                </div>
              </div>

              {/* Learning Resources */}
              {currentScenario.learning_resources && currentScenario.learning_resources.length > 0 && (
                <div className="p-8 bg-[#080808]">
                  <h3 className="font-mono text-sm text-red-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaBook /> Debriefing Materials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentScenario.learning_resources.map((res, i) => (
                      <a 
                        key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                        className="bg-[#0C0C0C] border border-gray-800 hover:border-red-500/50 p-4 rounded flex items-start gap-4 group transition-colors"
                      >
                        <div className="p-2 bg-red-950/30 rounded border border-red-900/30 text-red-400">
                          {res.type === 'video' ? <FaVideo /> : <FaCode />}
                        </div>
                        <div>
                          <div className="text-gray-200 font-bold text-sm mb-1 group-hover:text-red-400 transition-colors">{res.title}</div>
                          <div className="text-gray-500 text-xs line-clamp-2">{res.description}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 bg-[#050505] border-t border-red-900/50 flex items-center justify-end gap-4">
                <button
                  onClick={retryScenario}
                  className="px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-mono text-sm uppercase rounded transition-colors"
                >
                  Run Simulation Again
                </button>
                <button
                  onClick={() => router.push('/practice')}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Notifications */}
      {showHintNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="bg-[#0C0C0C]/90 backdrop-blur-md border border-yellow-500/50 rounded-lg p-4 max-w-sm flex gap-4 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            <FaLightbulb className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <div className="font-mono text-xs text-yellow-500 uppercase tracking-widest mb-1">System Intel</div>
              <div className="text-sm text-gray-300 leading-relaxed font-mono">{currentHint}</div>
            </div>
          </div>
        </div>
      )}

      {showCustomNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="bg-[#0C0C0C]/90 backdrop-blur-md border border-red-500/50 rounded-lg p-4 max-w-sm flex gap-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0 mt-1" />
            <div>
              <div className="font-mono text-xs text-red-500 uppercase tracking-widest mb-1">System Warning</div>
              <div className="text-sm text-gray-300 leading-relaxed font-mono">{customNotificationMessage}</div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
