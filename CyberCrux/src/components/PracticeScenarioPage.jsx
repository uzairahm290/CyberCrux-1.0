import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import '../styles/scenario-content.css';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaPause, 
  FaStop,
  FaClock, 
  FaStar, 
  FaBookmark,
  FaEye,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaRedo,
  FaSave,
  FaFileAlt,
  FaHeadset,
  FaComments,
  FaThumbsUp,
  FaThumbsDown,
  FaCode,
  FaTerminal,
  FaLaptop,
  FaNetworkWired,
  FaShieldAlt,
  FaSearch,
  FaKey,
  FaBug,
  FaGlobe,
  FaLock,
  FaQuestionCircle,
  FaLightbulb,
  FaExclamationTriangle,
  FaInfoCircle,
  FaGraduationCap,
  FaBook,
  FaVideo,
  FaLink,
  FaExternalLinkAlt,
  FaDownload
} from "react-icons/fa";
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';

export default function PracticeScenarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
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
  const [showExplanation, setShowExplanation] = useState({});
  const [questionResults, setQuestionResults] = useState({});
  const [showHintModal, setShowHintModal] = useState(false);
  const [currentHint, setCurrentHint] = useState('');

  // Fetch scenario and questions from API
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/practice/scenarios/${id}`);
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
        const response = await fetch('http://localhost:5000/api/practice/progress', {
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
      finishScenario();
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

  const finishScenario = async () => {
    setIsActive(false);
    await calculateScore();
  };

  const calculateScore = useCallback(async () => {
    if (!currentScenario || !currentScenario.questions) return;

    let totalScore = 0;
    let maxScore = 0;
    const results = {};
    
      currentScenario.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index] || '';
      const correctAnswer = question.correct_answer;
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      if (isCorrect) {
        totalScore += question.points;
      }
      
      maxScore += question.points;
      
      results[index] = {
        isCorrect,
        userAnswer,
        correctAnswer,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      };
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);
    
    setScore(finalScore);
    setQuestionResults(results);
    setShowResults(true);
    setCompleted(true);
    setIsActive(false); // Hide questions section after completion

    // Save progress
    saveProgress(finalScore);
  }, [currentScenario, userAnswers]);

  const saveProgress = async (finalScore) => {
    if (!user || !currentScenario) return;

    try {
      const answers = currentScenario.questions.map((_, index) => userAnswers[index] || '');

      const response = await fetch('http://localhost:5000/api/practice/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          scenarioId: parseInt(id),
          answers: answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving practice progress:', error);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  // Check if all questions are completed
  const checkScenarioCompletion = () => {
    if (!currentScenario?.questions) return false;
    
    const allCompleted = currentScenario.questions.every((_, index) => 
      questionFeedback[index]?.isCorrect
    );
    
    // If all questions are complete, automatically show results
    if (allCompleted && !showResults) {
      calculateScore();
    }
    
    return allCompleted;
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!currentScenario?.questions) return 0;
    
    const completedCount = Object.keys(questionFeedback).filter(key => questionFeedback[key]?.isCorrect).length;
    return Math.round((completedCount / currentScenario.questions.length) * 100);
  };

  // Get completed questions count
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-400";
      case "Medium": return "text-yellow-400";
      case "Hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">Loading Scenario...</h2>
            <p className="text-gray-400">Please wait while we fetch the practice scenario.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Error Loading Scenario</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <button 
              onClick={() => navigate('/practice')} 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
            >
              <FaArrowLeft /> Back to Practice
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Scenario not found
  if (!currentScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Scenario Not Found</h2>
            <p className="text-gray-400 mb-8">The practice scenario you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/practice')} 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
            >
              <FaArrowLeft /> Back to Practice
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQ = currentScenario.questions && currentScenario.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
          >
            <FaArrowLeft /> Back to Practice
          </button>
        </div>

        {/* Scenario Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/20 p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
          <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r ${
              currentScenario.difficulty === 'Hard' ? 'from-red-500 to-pink-500' :
              currentScenario.difficulty === 'Medium' ? 'from-yellow-500 to-orange-500' :
              'from-green-500 to-emerald-500'
            }`}>
              {currentScenario.category === 'web' && <FaGlobe className="w-6 h-6 md:w-8 md:h-8" />}
              {currentScenario.category === 'forensics' && <FaSearch className="w-6 h-6 md:w-8 md:h-8" />}
              {currentScenario.category === 'crypto' && <FaKey className="w-6 h-6 md:w-8 md:h-8" />}
              {currentScenario.category === 'reverse' && <FaBug className="w-6 h-6 md:w-8 md:h-8" />}
              {currentScenario.category === 'network' && <FaNetworkWired className="w-6 h-6 md:w-8 md:h-8" />}
              {currentScenario.category === 'osint' && <FaLock className="w-6 h-6 md:w-8 md:h-8" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold break-words pr-2">{currentScenario.title}</h1>
                
                {/* Download Task Files Button */}
                {currentScenario.file_url && (
                  <button
                    onClick={() => window.open(currentScenario.file_url, '_blank')}
                    className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 text-green-400 px-3 py-2 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 flex-shrink-0"
                    title="Download task files for this scenario"
                  >
                    <FaDownload className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Download Task Files</span>
                    <span className="sm:hidden">Download</span>
                  </button>
                )}
              </div>
              
              {/* Tags */}
              {currentScenario.tags && currentScenario.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                  {currentScenario.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 md:px-3 bg-blue-500/20 text-blue-400 text-xs md:text-sm rounded-full border border-blue-500/30 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 md:gap-4 text-gray-400 text-xs md:text-sm">
                <span className={`font-medium ${getDifficultyColor(currentScenario.difficulty)}`}>
                  {currentScenario.difficulty}
                </span>
                <span>•</span>
                <span>{currentScenario.time_estimate || currentScenario.timeEstimate}</span>
                <span>•</span>
                <span>{currentScenario.questions_count || currentScenario.questions?.length || 0} questions</span>
                <span>•</span>
                <span>{currentScenario.points} points</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Scenario Description with Rich Content Support */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <FaFileAlt className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <h3 className="text-base md:text-lg font-semibold text-blue-400">Scenario Overview</h3>
            </div>
            
            {/* Rich Content Description */}
            <div className="text-gray-200 text-base md:text-lg leading-relaxed mb-3 md:mb-4">
              {(() => {
                const description = currentScenario.description || '';
                
                // Check if description contains HTML-like content
                if (description.includes('<') && description.includes('>')) {
                  // Parse and render HTML content safely
                  const createMarkup = (html) => {
                    return { __html: html };
                  };
                  
                  return (
                    <div 
                      dangerouslySetInnerHTML={createMarkup(description)}
                      className="scenario-content"
                    />
                  );
                } else {
                  // Enhanced text parsing with support for URLs, code blocks, and special formatting
                  const parseText = (text) => {
                    // Split by lines and process each line
                    return text.split('\n').map((line, lineIndex) => {
                      // Check if line contains a URL
                      const urlRegex = /(https?:\/\/[^\s]+)/g;
                      const parts = line.split(urlRegex);
                      
                      return (
                        <p key={lineIndex} className="mb-3 last:mb-0">
                          {parts.map((part, partIndex) => {
                            if (part.match(urlRegex)) {
                              return (
                                <a
                                  key={partIndex}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline"
                                >
                                  {part}
                                </a>
                              );
                            } else if (part.trim().startsWith('`') && part.trim().endsWith('`')) {
                              // Code inline
                              return (
                                <code key={partIndex} className="bg-gray-800 px-2 py-1 rounded text-green-400 font-mono text-sm">
                                  {part.replace(/`/g, '')}
                                </code>
                              );
                            } else if (part.trim().startsWith('**') && part.trim().endsWith('**')) {
                              // Bold text
                              return (
                                <strong key={partIndex} className="font-bold text-white">
                                  {part.replace(/\*\*/g, '')}
                                </strong>
                              );
                            } else if (part.trim().startsWith('*') && part.trim().endsWith('*')) {
                              // Italic text
                              return (
                                <em key={partIndex} className="italic text-gray-300">
                                  {part.replace(/\*/g, '')}
                                </em>
                              );
                            } else {
                              return part;
                            }
                          })}
                        </p>
                      );
                    });
                  };
                  
                  return parseText(description);
                }
              })()}
            </div>
            
            {/* Scenario Context Box */}
            <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <FaInfoCircle className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                <span className="font-medium text-cyan-400 text-sm md:text-base">Key Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-medium capitalize">{currentScenario.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className={`font-medium ${getDifficultyColor(currentScenario.difficulty)}`}>
                    {currentScenario.difficulty}
              </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Time Estimate:</span>
                  <span className="font-medium">{currentScenario.time_estimate || currentScenario.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Total Points:</span>
                  <span className="font-medium text-yellow-400">{currentScenario.points} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Scenario */}
        {!isActive && !showResults && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPlay className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-gray-400 mb-8">
                This scenario contains {currentScenario.questions_count || currentScenario.questions?.length || 0} questions and should take approximately {currentScenario.time_estimate || currentScenario.timeEstimate}.
                Make sure you have enough time to complete it.
              </p>
              <button
                onClick={startScenario}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Scenario
              </button>
            </div>
          </div>
        )}

        {/* Active Scenario */}
        {isActive && currentQ && currentScenario.questions && currentScenario.questions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center justify-between gap-4 md:gap-6">
                {/* Progress Section */}
                <div className="flex items-center gap-4 md:gap-6">
                <div className="text-center">
                    <div className="text-lg md:text-2xl lg:text-3xl font-bold text-blue-400">
                      Question {currentQuestion + 1} of {currentScenario.questions.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    {getCompletedCount()} of {currentScenario.questions.length} completed
                </div>
                </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{getCompletionPercentage()}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                    </div>
                    
                    {/* Question Completion Status */}
                    <div className="flex gap-1 mt-2">
                      {currentScenario.questions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            questionFeedback[index]?.isCorrect 
                              ? 'bg-green-500' 
                              : index === currentQuestion 
                                ? 'bg-blue-500' 
                                : 'bg-gray-500'
                          }`}
                          title={`Question ${index + 1}: ${questionFeedback[index]?.isCorrect ? 'Completed' : 'Not completed'}`}
                        />
                      ))}
                    </div>
                </div>
              </div>
              
                {/* Timer and Controls Section */}
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Timer */}
                <div className="text-center">
                    <div className="text-lg md:text-2xl lg:text-3xl font-bold text-red-400 font-mono">{formatTime(timer)}</div>
                  <div className="text-sm text-gray-400">Time Left</div>
                </div>
                  
                  {/* Control Buttons */}
                  <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={pauseScenario}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
                      title={isPaused ? "Resume" : "Pause"}
                  >
                      {isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
                  </button>

                  </div>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-white/10">
                {/* Question Header */}
                <div className="mb-4 md:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-100 break-words">{currentQ.question_text}</h3>
                    <span className="px-2 py-1 md:px-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs md:text-sm font-medium self-start sm:self-auto">
                    {currentQ.points} points
                  </span>
                  </div>
                </div>
                
                {/* Simple Answer Input */}
                <div className="space-y-3 md:space-y-4">
                  {/* Answer Input with Underscore Filling */}
                  <div className="space-y-2 md:space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Your Answer:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={(() => {
                          const answer = currentQ.correct_answer || '';
                          return answer.split('').map(char => char === ' ' ? ' ' : '-').join('') || 'Type your answer here...';
                        })()}
                        className={`w-full border-2 rounded-lg md:rounded-xl p-3 md:p-4 text-base md:text-lg text-white placeholder-gray-400 transition-all duration-300 font-mono ${
                          questionFeedback[currentQuestion]?.isCorrect
                            ? 'bg-green-500/20 border-green-500/50 cursor-not-allowed'
                            : 'bg-white/10 border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={userAnswers[currentQuestion] || ""}
                        onChange={(e) => {
                          // Only allow changes if the question hasn't been answered correctly yet
                          if (!questionFeedback[currentQuestion]?.isCorrect) {
                            handleAnswer(e.target.value);
                          }
                        }}
                        disabled={questionFeedback[currentQuestion]?.isCorrect}
                    />
                    </div>
                  </div>
                  
                  {/* Submit and Hint Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <button
                      onClick={() => {
                        const userAnswer = userAnswers[currentQuestion] || '';
                        const correctAnswer = currentQ.correct_answer || '';
                        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                        
                        setQuestionFeedback(prev => ({
                          ...prev,
                          [currentQuestion]: {
                            isCorrect,
                            message: isCorrect ? 'Correct!' : 'Incorrect. Try again!',
                            userAnswer,
                            correctAnswer
                          }
                        }));
                        
                        // Check if all questions have been submitted and are correct
                        if (isCorrect) {
                          const allQuestionsSubmitted = currentScenario.questions.every((_, index) => 
                            questionFeedback[index]?.isCorrect || (index === currentQuestion && isCorrect)
                          );
                          
                          if (allQuestionsSubmitted) {
                            // All questions completed correctly, finish the scenario
                            setTimeout(() => {
                              calculateScore();
                              setShowResults(true); // Automatically show results
                            }, 1000); // Small delay to show the "Correct!" message
                          }
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm md:text-base"
                    >
                      Submit Answer
                    </button>
                    
                        <button
                      onClick={() => {
                        // Show hint for the current question
                        const hint = currentQ.explanation || "Look carefully at the scenario description above for clues.";
                        setCurrentHint(hint);
                        setShowHintModal(true);
                      }}
                      className="px-4 md:px-6 py-2.5 md:py-3 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/30 text-orange-400 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                      title="Get a hint for this question"
                    >
                      <FaLightbulb className="w-3 h-3 md:w-4 md:h-4" />
                      Hint
                        </button>
                  </div>
                  
                  {/* Question Feedback */}
                  {questionFeedback[currentQuestion] && (
                    <div className={`mt-3 md:mt-4 p-3 md:p-4 rounded-lg md:rounded-xl border ${
                      questionFeedback[currentQuestion].isCorrect 
                        ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                        : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {questionFeedback[currentQuestion].isCorrect ? (
                          <FaCheckCircle className="text-green-400 w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <FaTimes className="text-red-400 w-3 h-3 md:w-4 md:h-4" />
                        )}
                        <span className="font-medium text-sm md:text-base">
                          {questionFeedback[currentQuestion].isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm">{questionFeedback[currentQuestion].message}</p>
                      
                      {/* Show completion message if all questions are done */}
                      {questionFeedback[currentQuestion].isCorrect && checkScenarioCompletion() && (
                        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-green-500/30">
                          <div className="flex items-center gap-2 text-green-300">
                            <FaTrophy className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium text-xs md:text-sm">All questions completed! Scenario will finish automatically in a moment...</span>
                      </div>
                  </div>
                )}
                  </div>
                )}
                  </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <FaArrowLeft /> Previous
                </button>
                

                
                <button
                  onClick={() => {
                    if (currentQuestion === currentScenario.questions.length - 1) {
                      // Check if all questions have been submitted
                      const allQuestionsSubmitted = currentScenario.questions.every((_, index) => 
                        questionFeedback[index]?.isCorrect
                      );
                      
                      if (allQuestionsSubmitted) {
                        // All questions completed, finish the scenario
                        calculateScore();
                      } else {
                        // Some questions not completed, show custom modal
                        setCurrentHint('Please complete all questions before finishing the scenario.');
                        setShowHintModal(true);
                      }
                    } else {
                      nextQuestion();
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === currentScenario.questions.length - 1 ? 'Finish' : 'Next'} <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Questions Available */}
        {isActive && (!currentScenario.questions || currentScenario.questions.length === 0) && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">No Questions Available</h2>
            <p className="text-gray-400 mb-6">
              This scenario doesn't have any questions yet. Please check back later or contact the administrator.
            </p>
            <button
              onClick={() => setIsActive(false)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
            >
              Back to Scenario
            </button>
          </div>
        )}

        {/* Results - Modern Advanced Congratulations Modal */}
        {showResults && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            {/* Main Modal */}
            <div className="relative z-10 bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-indigo-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 max-w-[95vw] sm:max-w-xs md:max-w-sm lg:max-w-2xl mx-auto shadow-2xl shadow-blue-500/25 transform transition-all duration-700 scale-100">
              
              {/* Floating Trophy Animation */}
              <div className="absolute -top-6 sm:-top-8 md:-top-10 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl md:blur-2xl opacity-50 animate-pulse"></div>
                  {/* Trophy */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl md:shadow-2xl animate-bounce">
                    <FaTrophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
                  </div>
                  {/* Sparkles */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-1/2 -right-1.5 sm:-right-2 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-red-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>
              </div>

              {/* Header Section */}
              <div className="text-center mb-2 sm:mb-3 md:mb-4 pt-5 sm:pt-6 md:pt-8">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-1.5 sm:mb-2 animate-pulse leading-tight">
                  🎉 CONGRATULATIONS! 🎉
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-bold mb-1">
                  Scenario Complete!
                </p>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed px-2">
                  You've mastered the <span className="text-blue-400 font-semibold break-words">{currentScenario.title}</span> scenario
                </p>
              </div>

              {/* Score Dashboard & Performance Insights - Mobile First Layout */}
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4 mb-2.5 sm:mb-3 md:mb-4">
                {/* Score Dashboard - Optimized for mobile */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
                  {/* Score Card */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/30 rounded-lg p-1.5 sm:p-2 md:p-3 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                      <FaChartLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-blue-400 mb-0.5 sm:mb-1">{score}%</div>
                    <div className="text-xs text-gray-300 font-medium">Score</div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-1000 ease-out"
                          style={{width: `${score}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Questions Card */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 rounded-lg p-1.5 sm:p-2 md:p-3 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                      <FaQuestionCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-green-400 mb-0.5 sm:mb-1">{currentScenario.questions?.length || 0}</div>
                    <div className="text-xs text-gray-300 font-medium">Questions</div>
                    <div className="mt-1">
                      <div className="text-xs text-green-400 font-medium">✅</div>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/30 rounded-lg p-1.5 sm:p-2 md:p-3 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                      <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-purple-400 mb-0.5 sm:mb-1">
                      {formatTime(parseInt((currentScenario.time_estimate || currentScenario.timeEstimate || "15 min").split(' ')[0]) * 60 - timer)}
                    </div>
                    <div className="text-xs text-gray-300 font-medium">Time</div>
                    <div className="mt-1">
                      <div className="text-xs text-purple-400 font-medium">⚡</div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights - Optimized for mobile */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-white/10 rounded-lg p-2 sm:p-2.5 md:p-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <FaTrophy className="text-yellow-400 w-3 h-3" />
                    Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white/5 rounded-md">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-green-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white text-xs leading-tight">Perfect Completion</div>
                        <div className="text-xs text-gray-400 leading-tight">All questions answered</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white/5 rounded-md">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaStar className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white text-xs leading-tight">Excellent Score</div>
                        <div className="text-xs text-gray-400 leading-tight">{score >= 80 ? 'Outstanding!' : 'Good job!'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={retryScenario}
                  className="flex items-center justify-center gap-2 px-4 py-3 sm:px-3 sm:py-2 md:px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-500/30 text-sm sm:text-xs md:text-sm min-h-[44px] sm:min-h-0"
                >
                  <FaRedo className="w-4 h-4 sm:w-3 sm:h-3" />
                  Retry
                </button>
                <button
                  onClick={() => navigate('/practice')}
                  className="flex items-center justify-center gap-2 px-4 py-3 sm:px-3 sm:py-2 md:px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 text-sm sm:text-xs md:text-sm min-h-[44px] sm:min-h-0"
                >
                  <FaTrophy className="w-4 h-4 sm:w-3 sm:h-3" />
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Learning Resources Modal - Only shown when scenario is completed */}
      {showResults && currentScenario.learning_resources && currentScenario.learning_resources.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
          <div className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-indigo-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-5xl mx-auto shadow-2xl shadow-blue-500/25 transform transition-all duration-700 scale-100 overflow-y-auto max-h-[90vh]">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FaBook className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">Continue Learning</h3>
              <p className="text-sm md:text-base lg:text-lg text-gray-300">Enhance your knowledge with these recommended resources</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {currentScenario.learning_resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/20 transition-all duration-300 hover:scale-105 hover:border-blue-400/30 shadow-lg hover:shadow-blue-500/25"
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg md:rounded-xl border border-blue-400/30">
                      {resource.type === 'video' && <FaVideo className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                      {resource.type === 'guide' && <FaBook className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                      {resource.type === 'tool' && <FaCode className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                      {resource.type === 'course' && <FaGraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                      {!['video', 'guide', 'tool', 'course'].includes(resource.type) && <FaLink className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                    </div>
                    <span className="text-xs md:text-sm text-blue-400 font-medium capitalize">{resource.type}</span>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors mb-2 md:mb-3 text-sm md:text-base lg:text-lg">
                    {resource.title}
                  </h4>
                  <p className="text-gray-300 mb-3 md:mb-4 leading-relaxed text-xs md:text-sm">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-blue-400 font-medium">Open Resource</span>
                    <FaExternalLinkAlt className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowResults(false)}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 text-sm md:text-base"
              >
                Close Resources
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Custom Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 max-w-lg mx-4 modal-fade-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">💡 Hint</h3>
            </div>
            
            <div className="text-gray-200 text-lg leading-relaxed mb-6">
              {currentHint}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setShowHintModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 
