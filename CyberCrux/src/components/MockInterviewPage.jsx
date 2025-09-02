import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { 
  FaMicrophone, 
  FaVideo, 
  FaKeyboard, 
  FaClock, 
  FaStar, 
  FaPlay, 
  FaPause, 
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaDownload,
  FaShare,
  FaBookmark,
  FaEye,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaUserTie,
  FaLaptopCode,
  FaShieldAlt,
  FaNetworkWired,
  FaBug,
  FaSearch,
  FaFilter,
  FaSort,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaRedo,
  FaSave,
  FaFileAlt,
  FaHeadset,
  FaComments,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";
import { useTheme } from '../ThemeContext';

const interviewTypes = [
  {
    id: "technical",
    title: "Technical Interview",
    icon: <FaLaptopCode className="w-8 h-8" />,
    description: "Hands-on coding challenges, system design, and technical problem solving",
    duration: "45-60 min",
    difficulty: "Advanced",
    questions: 15,
    color: "from-blue-500 to-cyan-500",
    topics: ["Coding Challenges", "System Design", "Algorithm Analysis", "Security Implementation"]
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    icon: <FaUserTie className="w-8 h-8" />,
    description: "STAR method questions, leadership scenarios, and team collaboration",
    duration: "30-45 min",
    difficulty: "Intermediate",
    questions: 12,
    color: "from-green-500 to-emerald-500",
    topics: ["Leadership", "Problem Solving", "Team Work", "Conflict Resolution"]
  },
  {
    id: "security",
    title: "Security Specialist",
    icon: <FaShieldAlt className="w-8 h-8" />,
    description: "Security concepts, threat analysis, and incident response scenarios",
    duration: "60-90 min",
    difficulty: "Expert",
    questions: 20,
    color: "from-red-500 to-pink-500",
    topics: ["Threat Analysis", "Incident Response", "Security Architecture", "Compliance"]
  },
  {
    id: "network",
    title: "Network Security",
    icon: <FaNetworkWired className="w-8 h-8" />,
    description: "Network protocols, firewall configuration, and network defense",
    duration: "45-75 min",
    difficulty: "Advanced",
    questions: 18,
    color: "from-purple-500 to-indigo-500",
    topics: ["Network Protocols", "Firewall Config", "VPN Setup", "Network Monitoring"]
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    icon: <FaSearch className="w-8 h-8" />,
    description: "Evidence collection, analysis techniques, and forensic tools",
    duration: "60-90 min",
    difficulty: "Expert",
    questions: 16,
    color: "from-orange-500 to-yellow-500",
    topics: ["Evidence Collection", "Memory Analysis", "Disk Forensics", "Tool Usage"]
  },
  {
    id: "penetration",
    title: "Penetration Testing",
    icon: <FaBug className="w-8 h-8" />,
    description: "Vulnerability assessment, exploitation techniques, and reporting",
    duration: "75-120 min",
    difficulty: "Expert",
    questions: 25,
    color: "from-teal-500 to-cyan-500",
    topics: ["Vulnerability Assessment", "Exploitation", "Post-Exploitation", "Reporting"]
  }
];

const mockQuestions = {
  technical: [
    {
      id: 1,
      type: "coding",
      question: "Implement a secure password hashing function using bcrypt. Include salt generation and verification.",
      difficulty: "Hard",
      timeLimit: 15,
      points: 50,
      category: "Cryptography"
    },
    {
      id: 2,
      type: "system-design",
      question: "Design a secure authentication system for a web application. Consider session management, token-based auth, and security best practices.",
      difficulty: "Advanced",
      timeLimit: 20,
      points: 75,
      category: "System Design"
    },
    {
      id: 3,
      type: "problem-solving",
      question: "You discover a SQL injection vulnerability in your application. Walk through your approach to identifying, fixing, and preventing such vulnerabilities.",
      difficulty: "Medium",
      timeLimit: 12,
      points: 40,
      category: "Web Security"
    }
  ],
  behavioral: [
    {
      id: 1,
      type: "star",
      question: "Describe a situation where you had to handle a security incident under pressure. What was the situation, your task, the action you took, and the result?",
      difficulty: "Medium",
      timeLimit: 8,
      points: 30,
      category: "Incident Response"
    },
    {
      id: 2,
      type: "leadership",
      question: "Tell me about a time when you had to lead a team through a major security implementation. How did you handle resistance and ensure successful adoption?",
      difficulty: "Advanced",
      timeLimit: 10,
      points: 35,
      category: "Leadership"
    },
    {
      id: 3,
      type: "collaboration",
      question: "Describe a conflict you had with a colleague during a security project. How did you resolve it and what did you learn?",
      difficulty: "Medium",
      timeLimit: 6,
      points: 25,
      category: "Team Work"
    }
  ],
  security: [
    {
      id: 1,
      type: "threat-analysis",
      question: "Analyze the security implications of a company implementing BYOD (Bring Your Own Device) policy. What are the risks and how would you mitigate them?",
      difficulty: "Advanced",
      timeLimit: 15,
      points: 60,
      category: "Risk Assessment"
    },
    {
      id: 2,
      type: "incident-response",
      question: "You receive an alert about suspicious network activity. Walk through your incident response process from detection to resolution.",
      difficulty: "Expert",
      timeLimit: 18,
      points: 70,
      category: "Incident Response"
    },
    {
      id: 3,
      type: "compliance",
      question: "Explain how you would ensure GDPR compliance in a data processing system. What technical and organizational measures would you implement?",
      difficulty: "Advanced",
      timeLimit: 12,
      points: 45,
      category: "Compliance"
    }
  ]
};

const userStats = {
  totalInterviews: 24,
  averageScore: 87,
  completedTypes: ["technical", "behavioral", "security"],
  recentScores: [92, 85, 89, 91, 88],
  improvement: "+12%",
  streak: 5
};

export default function MockInterviewPage() {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [filter, setFilter] = useState("all");

  // Timer effect
  useEffect(() => {
    let interval;
    if (isInterviewActive && !isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, isPaused, timer]);

  const startInterview = (type) => {
    setSelectedType(type);
    setIsInterviewActive(true);
    setCurrentQuestion(0);
    setTimer(mockQuestions[type.id][0]?.timeLimit * 60 || 600);
    setIsRecording(true);
  };

  const pauseInterview = () => {
    setIsPaused(!isPaused);
  };

  const stopInterview = () => {
    setIsInterviewActive(false);
    setIsRecording(false);
    setShowResults(true);
    // Save interview results
    const results = {
      type: selectedType.id,
      score: Math.floor(Math.random() * 40) + 60, // Mock score
      duration: 45 - Math.floor(timer / 60),
      questions: mockQuestions[selectedType.id]?.length || 0
    };
    setInterviewHistory(prev => [...prev, results]);
  };

  const nextQuestion = () => {
    if (currentQuestion < (mockQuestions[selectedType.id]?.length - 1)) {
      setCurrentQuestion(prev => prev + 1);
      setTimer(mockQuestions[selectedType.id][currentQuestion + 1]?.timeLimit * 60 || 600);
      setUserAnswer("");
    } else {
      stopInterview();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    if (!selectedType || !mockQuestions[selectedType.id]) return null;
    return mockQuestions[selectedType.id][currentQuestion];
  };

  const filteredTypes = interviewTypes.filter(type => {
    if (filter === "all") return true;
    if (filter === "completed") return userStats.completedTypes.includes(type.id);
    if (filter === "beginner") return type.difficulty === "Intermediate";
    if (filter === "advanced") return ["Advanced", "Expert"].includes(type.difficulty);
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            Mock Interviews
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Practice real cybersecurity interviews with AI-powered feedback and comprehensive question banks
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaTrophy className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{userStats.totalInterviews}</p>
                <p className="text-sm text-gray-400">Interviews</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaChartLine className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{userStats.averageScore}%</p>
                <p className="text-sm text-gray-400">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{userStats.streak}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaUsers className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{userStats.completedTypes.length}</p>
                <p className="text-sm text-gray-400">Types Mastered</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaStar className="w-6 h-6 text-orange-400" />
              <div>
                <p className="text-2xl font-bold">{userStats.improvement}</p>
                <p className="text-sm text-gray-400">Improvement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Interview Section */}
        {isInterviewActive && selectedType && (
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
              {/* Interview Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedType.color}`}>
                    {selectedType.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedType.title} Interview</h2>
                    <p className="text-gray-400">Question {currentQuestion + 1} of {mockQuestions[selectedType.id]?.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{formatTime(timer)}</div>
                    <div className="text-sm text-gray-400">Time Left</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={pauseInterview}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      {isPaused ? <FaPlay /> : <FaPause />}
                    </button>
                    <button
                      onClick={stopInterview}
                      className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-colors"
                    >
                      <FaStop />
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Question */}
              {getCurrentQuestion() && (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getCurrentQuestion().difficulty === 'Hard' ? 'bg-red-500/20 text-red-300' :
                        getCurrentQuestion().difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {getCurrentQuestion().difficulty}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {getCurrentQuestion().category}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        {getCurrentQuestion().points} pts
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{getCurrentQuestion().question}</h3>
                  </div>

                  {/* Answer Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Your Answer:</h4>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        // Handle Enter key press (Ctrl+Enter to submit)
                        if (e.key === 'Enter' && e.ctrlKey) {
                          e.preventDefault();
                          nextQuestion();
                        }
                      }}
                      placeholder="Type your answer here... (Ctrl+Enter to submit)"
                      className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                          <FaMicrophone /> Record Audio
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                          <FaVideo /> Record Video
                        </button>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
                      >
                        Next Question <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interview Types Grid */}
        {!isInterviewActive && (
          <div className="space-y-8">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["all", "beginner", "advanced", "completed"].map(filterOption => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    filter === filterOption
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTypes.map((type) => (
                <div key={type.id} className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                    {type.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="font-medium">{type.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className={`font-medium ${
                        type.difficulty === 'Expert' ? 'text-red-400' :
                        type.difficulty === 'Advanced' ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {type.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Questions:</span>
                      <span className="font-medium">{type.questions}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {type.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => startInterview(type)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300"
                    >
                      <FaPlay /> Start Interview
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <FaBookmark />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Interview History */}
        {interviewHistory.length > 0 && !isInterviewActive && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaChartLine className="text-blue-400" />
              Recent Interviews
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewHistory.slice(-6).reverse().map((interview, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      {interviewTypes.find(t => t.id === interview.type)?.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      interview.score >= 90 ? 'bg-green-500/20 text-green-300' :
                      interview.score >= 80 ? 'bg-blue-500/20 text-blue-300' :
                      interview.score >= 70 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {interview.score}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{interview.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{interview.questions}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
