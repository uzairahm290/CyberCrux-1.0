import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
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
  FaInfoCircle
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
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scenario and questions from API
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/practice/scenarios/${id}`);
        const data = await response.json();
        
        console.log('API Response:', data);
        console.log('Scenario data:', data.data);
        console.log('Questions:', data.data?.questions);
        
        if (data.success) {
          setCurrentScenario(data.data);
          // Convert time estimate to seconds (assuming format like "15 min")
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

  useEffect(() => {
    let interval;
    if (isActive && !isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      finishScenario();
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timer]);

  const startScenario = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setCompleted(false);
  };

  const pauseScenario = () => {
    setIsPaused(!isPaused);
  };

  const finishScenario = () => {
    setIsActive(false);
    setShowResults(true);
    calculateScore();
    setCompleted(true);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalPoints = 0;
    
    if (currentScenario.questions) {
      currentScenario.questions.forEach((question, index) => {
        totalPoints += question.points;
        if (userAnswers[index]) {
          // Simple scoring - in real app, you'd have more sophisticated logic
          totalScore += question.points * 0.8; // Assume 80% correct for demo
        }
      });
    }
    
    setScore(Math.round((totalScore / totalPoints) * 100));
  };

  const nextQuestion = () => {
    if (currentScenario.questions && currentQuestion < currentScenario.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishScenario();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case "multiple-choice": return <FaQuestionCircle />;
      case "coding": return <FaCode />;
      case "scenario": return <FaLaptop />;
      case "practical": return <FaTerminal />;
      default: return <FaQuestionCircle />;
    }
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

  // Parse tags if they're a string
  let tags = [];
  try {
    if (currentScenario.tags && typeof currentScenario.tags === 'string') {
      tags = JSON.parse(currentScenario.tags);
    } else if (Array.isArray(currentScenario.tags)) {
      tags = currentScenario.tags;
    } else if (currentScenario.tags && typeof currentScenario.tags === 'string' && currentScenario.tags.includes(',')) {
      tags = currentScenario.tags.split(',').map(tag => tag.trim());
    }
  } catch (error) {
    console.log('Error parsing tags:', error);
    if (currentScenario.tags && typeof currentScenario.tags === 'string') {
      tags = currentScenario.tags.split(',').map(tag => tag.trim());
    }
  }

  const currentQ = currentScenario.questions && currentScenario.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <FaArrowLeft /> Back to Practice
          </button>
        </div>

        {/* Scenario Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${
              currentScenario.difficulty === 'Hard' ? 'from-red-500 to-pink-500' :
              currentScenario.difficulty === 'Medium' ? 'from-yellow-500 to-orange-500' :
              'from-green-500 to-emerald-500'
            }`}>
              {currentScenario.category === 'web' && <FaGlobe className="w-8 h-8" />}
              {currentScenario.category === 'forensics' && <FaSearch className="w-8 h-8" />}
              {currentScenario.category === 'crypto' && <FaKey className="w-8 h-8" />}
              {currentScenario.category === 'reverse' && <FaBug className="w-8 h-8" />}
              {currentScenario.category === 'network' && <FaNetworkWired className="w-8 h-8" />}
              {currentScenario.category === 'osint' && <FaLock className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentScenario.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className={`font-medium ${getDifficultyColor(currentScenario.difficulty)}`}>
                  {currentScenario.difficulty}
                </span>
                <span>• {currentScenario.time_estimate || currentScenario.timeEstimate}</span>
                <span>• {currentScenario.questions_count || currentScenario.questions} questions</span>
                <span>• {currentScenario.points} points</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-6">{currentScenario.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Active Scenario */}
        {isActive && currentQ && currentScenario.questions && currentScenario.questions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    Question {currentQuestion + 1} of {currentScenario.questions ? currentScenario.questions.length : 0}
                  </div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${currentScenario.questions ? ((currentQuestion + 1) / currentScenario.questions.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{formatTime(timer)}</div>
                  <div className="text-sm text-gray-400">Time Left</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={pauseScenario}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    {isPaused ? <FaPlay /> : <FaPause />}
                  </button>
                  <button
                    onClick={finishScenario}
                    className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors"
                  >
                    <FaStop />
                  </button>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {getQuestionIcon(currentQ.question_type)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
                    {currentQ.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-400">
                    {currentQ.points} points
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">{currentQ.question_text}</h3>
                
                {/* Question Type Specific Content */}
                {currentQ.question_type === "multiple-choice" && (
                  <div className="space-y-3">
                    {(() => {
                      let options = [];
                      try {
                        if (currentQ.options && typeof currentQ.options === 'string') {
                          options = JSON.parse(currentQ.options);
                        } else if (Array.isArray(currentQ.options)) {
                          options = currentQ.options;
                        } else if (currentQ.options && typeof currentQ.options === 'string' && currentQ.options.includes(',')) {
                          // If it's a comma-separated string, split it
                          options = currentQ.options.split(',').map(option => option.trim());
                        }
                      } catch (error) {
                        console.log('Error parsing options for question:', currentQ.id, 'Options:', currentQ.options);
                        // If JSON parsing fails, try to split by comma
                        if (currentQ.options && typeof currentQ.options === 'string') {
                          options = currentQ.options.split(',').map(option => option.trim());
                        }
                      }
                      
                      return options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                            userAnswers[currentQuestion] === index
                              ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                      ));
                    })()}
                  </div>
                )}
                
                {currentQ.question_type === "coding" && (
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">Code Template:</div>
                      <pre className="text-green-400 font-mono">{currentQ.code_template}</pre>
                    </div>
                    <textarea
                      placeholder="Write your code here..."
                      className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-xl p-4 font-mono text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={userAnswers[currentQuestion] || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                  </div>
                )}
                
                {currentQ.question_type === "scenario" && (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaInfoCircle className="text-blue-400" />
                        <span className="font-medium text-blue-400">Scenario</span>
                      </div>
                      <p className="text-gray-300">{currentQ.scenario_context}</p>
                    </div>
                    <textarea
                      placeholder="Describe your approach or solution..."
                      className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={userAnswers[currentQuestion] || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                  </div>
                )}
                
                {currentQ.question_type === "practical" && (
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">Code to Analyze:</div>
                      <pre className="text-red-400 font-mono">{currentQ.code_snippet}</pre>
                    </div>
                    <textarea
                      placeholder="Describe the vulnerability or issue you found..."
                      className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={userAnswers[currentQuestion] || ""}
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft /> Previous
                </button>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    <FaLightbulb className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                    <FaExclamationTriangle className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
                >
                  {currentScenario.questions && currentQuestion === currentScenario.questions.length - 1 ? 'Finish' : 'Next'} <FaArrowRight />
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

        {/* Start Scenario */}
        {!isActive && !showResults && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPlay className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-gray-400 mb-8">
                This scenario contains {currentScenario.questions_count || currentScenario.questions || 0} questions and should take approximately {currentScenario.time_estimate || currentScenario.timeEstimate}.
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

        {/* Results */}
        {showResults && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrophy className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Scenario Complete!</h2>
              <p className="text-gray-400 mb-6">You've completed the {currentScenario.title} scenario</p>
              
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{score}%</div>
                  <div className="text-sm text-gray-400">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{currentScenario.questions ? currentScenario.questions.length : 0}</div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{formatTime(parseInt(currentScenario.timeEstimate) * 60 - timer)}</div>
                  <div className="text-sm text-gray-400">Time Used</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaRedo /> Retry
                </button>
                <button
                  onClick={() => navigate('/practice')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
                >
                  Back to Practice
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 