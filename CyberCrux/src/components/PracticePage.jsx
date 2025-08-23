import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { 
  BiBrain, BiLaptop, BiTargetLock, BiTrendingUp, 
  BiTime, BiMedal, BiPlay, BiSearch, BiFilter, BiStar, BiTrophy, BiDiamond,
  BiCheckCircle
} from "react-icons/bi";
import { 
  FaGlobe, FaUser, FaLock, FaBug, FaKey, FaSearch,
  FaFire, FaRegEye, FaRegHeart, FaDownload
} from "react-icons/fa";
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';

// Dynamic categories based on actual data
const getCategoryIcon = (category) => {
  const iconMap = {
    web: <FaGlobe className="w-6 h-6" />,
    network: <BiLaptop className="w-6 h-6" />,
    forensics: <FaSearch className="w-6 h-6" />,
    crypto: <FaKey className="w-6 h-6" />,
    reverse: <FaBug className="w-6 h-6" />,
    osint: <FaLock className="w-6 h-6" />
  };
  return iconMap[category] || <BiBrain className="w-6 h-6" />;
};

const getCategoryColor = (category) => {
  const colorMap = {
    web: "from-green-500 to-emerald-500",
    network: "from-indigo-500 to-purple-500",
    forensics: "from-purple-500 to-pink-500",
    crypto: "from-yellow-500 to-orange-500",
    reverse: "from-red-500 to-pink-500",
    osint: "from-teal-500 to-cyan-500"
  };
  return colorMap[category] || "from-blue-500 to-cyan-500";
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
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [dynamicCategories, setDynamicCategories] = useState([]);

  const [userStats, setUserStats] = useState({
    totalCompleted: 0,
    totalPoints: 0,
    currentStreak: 0,
    averageScore: 0,
    rank: 'Unranked',
    level: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scenarios from API
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/practice/scenarios`);
        const data = await response.json();

        if (data.success) {
          setScenarios(data.data);
          
          // Generate dynamic categories from actual data
          const categoryCounts = {};
          data.data.forEach(scenario => {
            if (scenario.category) {
              categoryCounts[scenario.category] = (categoryCounts[scenario.category] || 0) + 1;
            }
          });
          
          const categories = [
            { key: "all", label: "All Categories", icon: <BiBrain className="w-6 h-6" />, color: "from-blue-500 to-cyan-500", count: data.data.length, description: "Complete collection of cybersecurity scenarios" },
            ...Object.entries(categoryCounts).map(([key, count]) => ({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1) + " Security",
              icon: getCategoryIcon(key),
              color: getCategoryColor(key),
              count,
              description: `${key} security scenarios and challenges`
            }))
          ];
          
          setDynamicCategories(categories);
          setFilteredScenarios(data.data); // Initialize filtered scenarios
        } else {
          setError(data.message || 'Failed to fetch scenarios');
        }
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError('Network error: Failed to fetch scenarios. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  // Refetch scenarios when filters change
  useEffect(() => {
    if (scenarios.length > 0) {
      // Filter scenarios based on current selection
      const filtered = scenarios.filter(scenario => {
        if (selectedCategory !== "all" && scenario.category !== selectedCategory) {
          return false;
        }
        
        if (searchQuery && !scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !scenario.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      });
      
      // Update filtered scenarios without making API call
      setFilteredScenarios(filtered);
    }
  }, [selectedCategory, searchQuery, scenarios]);

  // Fetch user progress and stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user progress for scenario completion tracking
        const progressResponse = await fetch('http://localhost:5000/api/practice/progress', {
          credentials: 'include'
        });
        const progressData = await progressResponse.json();

        if (progressData.success) {
          const progressMap = {};
          progressData.data.forEach(item => {
            progressMap[item.scenario_id] = {
              score: item.score,
              time_taken: item.time_taken,
              completed_at: item.completed_at,
              is_completed: item.is_completed
            };
          });
          setUserProgress(progressMap);
        }

        // Fetch user stats using the same API as DashboardPage and CompetePage
        try {
          const statsResponse = await fetch('http://localhost:5000/api/practice/stats', {
            credentials: 'include'
          });
          const statsData = await statsResponse.json();
          
          if (statsData.success) {
            const stats = statsData.data.overview;
          setUserStats(prev => ({
            ...prev,
              totalCompleted: stats.completed_scenarios || 0,
              totalPoints: stats.total_points_earned || 0,
              averageScore: Math.round(stats.average_score || 0),
              level: Math.floor((stats.total_points_earned || 0) / 100) + 1,
              rank: stats.rank || 'Unranked'
            }));
          }
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
        }

        // Fetch streak data using the same approach as DashboardPage
        try {
          const streakResponse = await fetch(`http://localhost:5000/api/streak/user-streak/${user.id}`);
          const streakData = await streakResponse.json();
          
          if (streakData.streak) {
            setUserStats(prev => ({
              ...prev,
              currentStreak: streakData.streak.current_streak || 0
            }));
          }
        } catch (streakError) {
          console.error('Error fetching streak data:', streakError);
        }


        
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [user]);

  const finalFilteredScenarios = filteredScenarios.filter(scenario => {
    const matchesCompleted = !filterCompleted || userProgress[scenario.id]?.is_completed;
    return matchesCompleted;
  });

  const sortedScenarios = [...finalFilteredScenarios].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.views || 0) - (a.views || 0);
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "points":
        return (b.points || 0) - (a.points || 0);
      default:
        return 0;
    }
  });



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
            <div className="text-xl font-bold">
              {userStats.totalPoints > 0 ? `#${userStats.rank}` : 'Unranked'}
            </div>
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
                {dynamicCategories.map((category) => (
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
  className="px-4 py-3 bg-blue-600 text-white border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                Showing {sortedScenarios.length} of {scenarios.length} total
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
                          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  {/* Header */}
                          <div className="p-6 border-b border-white/10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
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
                      </div>
                    </div>
                            <h3 className="text-lg font-bold mb-0 group-hover:text-blue-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {scenario.title}
                    </h3>
                    
                    {/* Tags */}
                    {scenario.tags && scenario.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {scenario.tags.map((tag, index) => (
                        <span
                          key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                      </div>
                    )}
                               
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1 min-h-[4.5rem]">
                      {scenario.short_description || scenario.description}
                    </p>

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
                                  {scenario.questions_count || scenario.questions || 0} Qs
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
                                  <span className="hidden sm:inline">{scenario.views || 0}</span>
                                  <span className="sm:hidden">{(scenario.views || 0) > 999 ? `${((scenario.views || 0)/1000).toFixed(1)}k` : scenario.views || 0}</span>
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <FaRegHeart className="w-3 h-3" />
                                  <span className="hidden sm:inline">{scenario.likes || 0}</span>
                                  <span className="sm:hidden">{(scenario.likes || 0) > 999 ? `${((scenario.likes || 0)/1000).toFixed(1)}k` : scenario.likes || 0}</span>
                        </span>
                                <span className="flex items-center gap-1 flex-shrink-0">
                          <BiMedal className="w-3 h-3" />
                                  {scenario.completion_rate || scenario.completionRate || 0}%
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
        <Footer />
      </div>
    </>
  );
} 
