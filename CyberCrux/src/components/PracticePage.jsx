import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { 
  BiBrain, BiLaptop, BiTargetLock, BiTrendingUp, 
  BiTime, BiMedal, BiPlay, BiSearch, BiFilter, BiStar, BiTrophy, BiDiamond,
  BiCalendar, BiCheckCircle
} from "react-icons/bi";
import { 
  FaGlobe, FaUser, FaLock, FaBug, FaKey, FaSearch,
  FaFire, FaRegEye, FaRegHeart
} from "react-icons/fa";
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';

const categories = [
  { 
    key: "all", 
    label: "All Categories", 
    icon: <BiBrain className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    count: 156,
    description: "Complete collection of cybersecurity scenarios"
  },
  { 
    key: "web", 
    label: "Web Security", 
    icon: <FaGlobe className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    count: 42,
    description: "OWASP Top 10, XSS, SQL Injection, CSRF"
  },
  { 
    key: "forensics", 
    label: "Digital Forensics", 
    icon: <FaSearch className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    count: 38,
    description: "Memory analysis, disk forensics, network forensics"
  },
  { 
    key: "crypto", 
    label: "Cryptography", 
    icon: <FaKey className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    count: 31,
    description: "Encryption, hashing, digital signatures, PKI"
  },
  { 
    key: "reverse", 
    label: "Reverse Engineering", 
    icon: <FaBug className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
    count: 28,
    description: "Malware analysis, binary exploitation, debugging"
  },
  { 
    key: "network", 
    label: "Network Security", 
    icon: <BiLaptop className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    count: 35,
    description: "Network protocols, firewalls, IDS/IPS, VPN"
  },
  { 
    key: "osint", 
    label: "OSINT", 
    icon: <FaLock className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
    count: 22,
    description: "Open source intelligence gathering"
  },
];

const practiceScenarios = [
  {
    id: 1,
    title: "Advanced SQL Injection",
    category: "web",
    difficulty: "Hard",
    timeEstimate: "15 min",
    questions: 8,
    points: 150,
    completionRate: 87,
    likes: 234,
    views: 1247,
    description: "Master advanced SQL injection techniques including blind, time-based, and union-based attacks.",
    tags: ["SQL Injection", "Web Security", "Database"],
    isCompleted: false,
    isBookmarked: true
  },
  {
    id: 2,
    title: "Memory Forensics Analysis",
    category: "forensics",
    difficulty: "Medium",
    timeEstimate: "20 min",
    questions: 12,
    points: 200,
    completionRate: 92,
    likes: 189,
    views: 892,
    description: "Analyze memory dumps to identify malicious processes and extract artifacts.",
    tags: ["Memory Analysis", "Volatility", "Malware"],
    isCompleted: true,
    isBookmarked: false
  },
  {
    id: 3,
    title: "RSA Cryptography Challenge",
    category: "crypto",
    difficulty: "Easy",
    timeEstimate: "10 min",
    questions: 6,
    points: 100,
    completionRate: 95,
    likes: 156,
    views: 567,
    description: "Understand RSA encryption, key generation, and digital signatures.",
    tags: ["RSA", "Public Key", "Digital Signatures"],
    isCompleted: false,
    isBookmarked: false
  },
  {
    id: 4,
    title: "Malware Reverse Engineering",
    category: "reverse",
    difficulty: "Hard",
    timeEstimate: "25 min",
    questions: 15,
    points: 300,
    completionRate: 78,
    likes: 312,
    views: 1456,
    description: "Reverse engineer a malicious binary to understand its behavior and capabilities.",
    tags: ["Malware", "IDA Pro", "Assembly"],
    isCompleted: false,
    isBookmarked: true
  },
  {
    id: 5,
    title: "Network Traffic Analysis",
    category: "network",
    difficulty: "Medium",
    timeEstimate: "18 min",
    questions: 10,
    points: 175,
    completionRate: 89,
    likes: 201,
    views: 934,
    description: "Analyze network packets to identify suspicious activities and protocols.",
    tags: ["Wireshark", "Network", "Protocols"],
    isCompleted: false,
    isBookmarked: false
  },
  {
    id: 6,
    title: "Social Media OSINT",
    category: "osint",
    difficulty: "Easy",
    timeEstimate: "12 min",
    questions: 7,
    points: 125,
    completionRate: 91,
    likes: 134,
    views: 678,
    description: "Gather intelligence from social media platforms and public sources.",
    tags: ["OSINT", "Social Media", "Information Gathering"],
    isCompleted: true,
    isBookmarked: false
  }
];

const userStats = {
  totalCompleted: 47,
  totalPoints: 2840,
  currentStreak: 7,
  averageScore: 87,
  rank: 156,
  level: 12
};

const difficultyColors = {
  Easy: "from-green-500 to-emerald-500",
  Medium: "from-yellow-500 to-orange-500",
  Hard: "from-red-500 to-pink-500"
};

export default function PracticePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scenarios from API
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category: selectedCategory,
          search: searchQuery,
          sortBy: sortBy,
          limit: 50
        });

        const response = await fetch(`http://localhost:5000/api/practice/scenarios?${params}`);
        const data = await response.json();

        if (data.success) {
          setScenarios(data.data);
        } else {
          setError('Failed to fetch scenarios');
        }
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError('Failed to fetch scenarios');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [selectedCategory, searchQuery, sortBy]);

  // Fetch user progress and bookmarks
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user progress
        const progressResponse = await fetch('http://localhost:5000/api/practice/progress', {
          credentials: 'include'
        });
        const progressData = await progressResponse.json();

        if (progressData.success) {
          const progressMap = {};
          progressData.data.forEach(item => {
            progressMap[item.id] = item;
          });
          setUserProgress(progressMap);
        }

        // Fetch user bookmarks
        const bookmarksResponse = await fetch('http://localhost:5000/api/practice/bookmarks', {
          credentials: 'include'
        });
        const bookmarksData = await bookmarksResponse.json();

        if (bookmarksData.success) {
          setUserBookmarks(bookmarksData.data.map(b => b.id));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [user]);

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesCompleted = !filterCompleted || userProgress[scenario.id]?.is_completed;
    return matchesCompleted;
  });

  const sortedScenarios = [...filteredScenarios].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "points":
        return b.points - a.points;
      default:
        return 0;
    }
  });

  const handleBookmarkToggle = async (scenarioId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/practice/bookmark/${scenarioId}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        if (data.isBookmarked) {
          setUserBookmarks(prev => [...prev, scenarioId]);
        } else {
          setUserBookmarks(prev => prev.filter(id => id !== scenarioId));
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            <BiBrain className="w-4 h-4" />
            Practice Scenarios
          </div>
          <h1 className="text-3xl pb-2 sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Master Cybersecurity
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
            Practice real-world scenarios, ace interviews, and build your cybersecurity skills with our comprehensive collection of challenges
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <BiCheckCircle className="w-5 h-5 text-green-400" />
              <BiTrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold">{userStats.totalCompleted}</div>
            <div className="text-gray-300 text-xs">Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <BiDiamond className="w-5 h-5 text-blue-400" />
              <BiTrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold">{userStats.totalPoints}</div>
            <div className="text-gray-300 text-xs">Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <FaFire className="w-5 h-5 text-orange-400" />
              <BiTrendingUp className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-bold">{userStats.currentStreak}</div>
            <div className="text-gray-300 text-xs">Day Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <BiTargetLock className="w-5 h-5 text-purple-400" />
              <BiTrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold">{userStats.averageScore}%</div>
            <div className="text-gray-300 text-xs">Avg Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <BiTrophy className="w-5 h-5 text-yellow-400" />
              <BiTrendingUp className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-xl font-bold">#{userStats.rank}</div>
            <div className="text-gray-300 text-xs">Global Rank</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <FaUser className="w-5 h-5 text-cyan-400" />
              <BiTrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold">{userStats.level}</div>
            <div className="text-gray-300 text-xs">Level</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BiFilter className="w-5 h-5" />
                Categories
              </h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                          {category.icon}
                        </div>
                        <span className="font-semibold">{category.label}</span>
                      </div>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-xs opacity-75">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search scenarios, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="points">Most Points</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setFilterCompleted(!filterCompleted)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filterCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {filterCompleted ? 'Show All' : 'Hide Completed'}
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {sortedScenarios.length} {sortedScenarios.length === 1 ? 'Scenario' : 'Scenarios'} Found
              </h3>
              <div className="text-gray-400 text-sm">
                Showing {sortedScenarios.length} of {practiceScenarios.length} total
              </div>
            </div>

              {/* Scenarios Section */}
              <div>
                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading scenarios...</p>
                  </div>
                )}
                {/* Error State */}
                {error && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BiSearch className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">Error Loading Scenarios</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                )}
            {/* Scenarios Grid */}
                {!loading && !error && (
                  <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedScenarios.map((scenario) => (
                        <Link
                          to={`/practice/${scenario.id}`}
                  key={scenario.id}
                          className="block bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  {/* Header */}
                          <div className="p-6 border-b border-white/10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 bg-gradient-to-r ${difficultyColors[scenario.difficulty]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <BiBrain className="w-4 h-4 text-white" />
                        </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                          scenario.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          scenario.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {userProgress[scenario.id]?.is_completed && (
                          <BiCheckCircle className="w-5 h-5 text-green-400" title="Completed" />
                        )}
                                <button 
                                  onClick={e => { e.preventDefault(); handleBookmarkToggle(scenario.id); }}
                                  className={`w-6 h-6 ${userBookmarks.includes(scenario.id) ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                                >
                          <BiStar className="w-full h-full" />
                        </button>
                      </div>
                    </div>
                            <h3 className="text-lg font-bold mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {scenario.title}
                    </h3>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1 min-h-[4.5rem]">
                      {scenario.description}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                              {(scenario.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                                  className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300 flex-shrink-0"
                        >
                          {tag}
                        </span>
                      ))}
                              {scenario.tags && scenario.tags.length > 3 && (
                                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300 flex-shrink-0">
                                  +{scenario.tags.length - 3}
                                </span>
                              )}
                    </div>
                  </div>
                  {/* Stats */}
                          <div className="px-6 py-4 bg-white/5 mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <BiTime className="w-4 h-4" />
                                  <span className="hidden sm:inline">{scenario.time_estimate || scenario.timeEstimate}</span>
                                  <span className="sm:hidden">{(scenario.time_estimate || scenario.timeEstimate || '').split(' ')[0]}</span>
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <BiBrain className="w-4 h-4" />
                                  {scenario.questions_count || scenario.questions} Qs
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <BiDiamond className="w-4 h-4" />
                          {scenario.points} pts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <FaRegEye className="w-3 h-3" />
                                  <span className="hidden sm:inline">{scenario.views}</span>
                                  <span className="sm:hidden">{scenario.views > 999 ? `${(scenario.views/1000).toFixed(1)}k` : scenario.views}</span>
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <FaRegHeart className="w-3 h-3" />
                                  <span className="hidden sm:inline">{scenario.likes}</span>
                                  <span className="sm:hidden">{scenario.likes > 999 ? `${(scenario.likes/1000).toFixed(1)}k` : scenario.likes}</span>
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <BiMedal className="w-3 h-3" />
                                  {scenario.completionRate || scenario.completion_rate || 0}%
                        </span>
                      </div>
                              <button className="bg-gradient-to-r ml-3 from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 transform hover:scale-105 flex-shrink-0">
                        <BiPlay className="w-4 h-4" />
                                <span className="hidden sm:inline">{userProgress[scenario.id]?.is_completed ? 'Review' : 'Start'}</span>
                                <span className="sm:hidden">{userProgress[scenario.id]?.is_completed ? 'Review' : 'Start'}</span>
                      </button>
                    </div>
                  </div>
                        </Link>
              ))}
            </div>
            {/* Empty State */}
            {sortedScenarios.length === 0 && (
              <div className="text-center py-12">
                <BiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No scenarios found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setFilterCompleted(false);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Start practicing with our comprehensive collection of cybersecurity scenarios. Track your progress, earn points, and climb the leaderboard!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/compete"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <BiTrophy className="w-5 h-5" />
                View Leaderboard
              </Link>
              <Link
                to="/roadmap"
                className="bg-white/10 backdrop-blur-xl text-white px-8 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                Learning Roadmaps
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 