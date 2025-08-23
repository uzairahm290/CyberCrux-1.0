import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashNav from './DashNav';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiMedal, BiPlay, BiTrendingUp, BiTargetLock, BiDiamond, BiCrown, BiNews
} from 'react-icons/bi';
import { FaFire , FaRegClock,  } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Footer from './Footer';
import FloatingChatWidget from './FloatingChatWidget';
import { useAuth } from '../AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [aiInterviews, setAiInterviews] = useState(0);
  const [labsCompleted, setLabsCompleted] = useState(0);
  const [streakData, setStreakData] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [skillRadar, setSkillRadar] = useState([
    { skill: 'Network Security', value: 0 },
    { skill: 'Web Security', value: 0 },
    { skill: 'Malware Analysis', value: 0 },
    { skill: 'Incident Response', value: 0 },
    { skill: 'Cryptography', value: 0 },
    { skill: 'Forensics', value: 0 },
  ]);

  // Fetch streak data when component mounts
  const fetchStreakData = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/streak/user-streak/${user.id}`);
      const data = await response.json();
      setStreakData(data.streak);
      setCurrentStreak(data.streak?.current_streak || 0);
      // Don't set totalPoints here - let fetchUserStats handle it
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  // Fetch user practice statistics
  const fetchUserStats = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/practice/stats', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        const stats = data.data.overview;
        setCompletedScenarios(stats.completed_scenarios || 0);
        // Set total points from practice stats (this is the authoritative source)
        setTotalPoints(stats.total_points_earned || 0);
        console.log('Setting totalPoints from practice stats:', stats.total_points_earned || 0);
        setLevel(Math.floor((stats.total_points_earned || 0) / 100) + 1);
        setRank(stats.rank || 0);
        
        // Calculate skill radar data from category performance
        if (data.data.categories) {
          const skillRadarData = data.data.categories.map(category => {
            const avgScore = category.avg_score || 0;
            const completed = category.completed || 0;
            const total = category.total || 1;
            
            // Calculate skill value based on average score and completion rate
            const completionRate = (completed / total) * 100;
            const skillValue = Math.round((avgScore + completionRate) / 2);
            
            return {
              skill: category.category.charAt(0).toUpperCase() + category.category.slice(1),
              value: Math.min(100, Math.max(0, skillValue)) // Ensure value is between 0-100
            };
          });
          
          // Add default skills if no categories exist
          if (skillRadarData.length === 0) {
            setSkillRadar([
              { skill: 'Network Security', value: 0 },
              { skill: 'Web Security', value: 0 },
              { skill: 'Malware Analysis', value: 0 },
              { skill: 'Incident Response', value: 0 },
              { skill: 'Cryptography', value: 0 },
              { skill: 'Forensics', value: 0 },
            ]);
          } else {
            setSkillRadar(skillRadarData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Fetch weekly progress for scenarios
  const fetchWeeklyProgress = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/practice/progress', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        // Calculate weekly progress for scenarios
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const weekProgress = weekDays.map((day, index) => {
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - (today.getDay() - index));
          const dateStr = targetDate.toISOString().split('T')[0];
          
          const dayScenarios = data.data.filter(item => {
            if (!item.completed_at) return false;
            const itemDate = new Date(item.completed_at).toISOString().split('T')[0];
            return itemDate === dateStr;
          }).length;
          
          return {
            day,
            scenarios: dayScenarios,
            interviews: 0, // Remove interviews from graph
            labs: 0 // Remove labs from graph
          };
        });
        
        setWeeklyProgress(weekProgress);
      }
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
    }
  };

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/practice/progress', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        const activities = data.data
          .filter(item => item.is_completed)
          .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
          .slice(0, 4)
          .map(item => {
            const timeAgo = getTimeAgo(new Date(item.completed_at));
            return {
              type: 'scenario',
              title: `Completed ${item.scenario_name || 'Practice Scenario'}`,
              time: timeAgo,
              points: item.score || 0,
              icon: <BiBrain className="w-5 h-5 text-blue-400" />
            };
          });
        
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  // Fetch recent blogs
  const fetchRecentBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const blogs = data
          .sort((a, b) => {
            // Handle different date field names and formats
            const dateA = a.created_at || a.date || a.published_at;
            const dateB = b.created_at || b.date || b.published_at;
            
            if (!dateA || !dateB) return 0;
            
            const dateObjA = new Date(dateA);
            const dateObjB = new Date(dateB);
            
            // Check if dates are valid
            if (isNaN(dateObjA.getTime()) || isNaN(dateObjB.getTime())) return 0;
            
            return dateObjB - dateObjA;
          })
          .slice(0, 4)
          .map(blog => {
            // Handle different date field names
            const blogDate = blog.created_at || blog.date || blog.published_at;
            let timeAgo = 'Recently';
            
            if (blogDate) {
              try {
                const date = new Date(blogDate);
                if (!isNaN(date.getTime())) {
                  timeAgo = getTimeAgo(date);
                }
              } catch (error) {
                console.error('Error parsing blog date:', error);
              }
            }
            
            return {
              title: blog.title || 'Untitled Blog',
              author: blog.author || 'CyberCrux Team',
              time: timeAgo,
              readTime: blog.read_time || `${Math.ceil((blog.content?.length || 500) / 200)} min read`,
              category: blog.category || 'General',
              icon: <BiNews className="w-5 h-5 text-blue-400" />
            };
          });
        
        setRecentBlogs(blogs);
      }
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
    }
  };

  // Fetch upcoming challenges
  const fetchUpcomingChallenges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/practice/scenarios');
      const data = await response.json();
      
      if (data.success) {
        const challenges = data.data
          .filter(scenario => !scenario.is_completed)
          .sort((a, b) => (b.points || 0) - (a.points || 0))
          .slice(0, 3)
          .map(scenario => ({
            title: scenario.title,
            difficulty: scenario.difficulty || 'Medium',
            reward: scenario.points || 100,
            deadline: 'No deadline',
            icon: <BiTargetLock className="w-6 h-6 text-red-400" />
          }));
        
        setUpcomingChallenges(challenges);
      }
    } catch (error) {
      console.error('Error fetching upcoming challenges:', error);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    try {
      const now = new Date();
      const diffInMs = now - date;
      
      // Check if the date is valid and not in the future
      if (isNaN(diffInMs) || diffInMs < 0) {
        return 'Recently';
      }
      
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return 'Recently';
    }
  };

  // Record login when user visits dashboard
  const recordLogin = async () => {
    if (!user?.id) return;
    
    try {
      await fetch('http://localhost:5000/api/streak/record-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      fetchStreakData(); // Refresh streak data after recording login
    } catch (error) {
      console.error('Error recording login:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      recordLogin(); // Record login and fetch streak data
      fetchStreakData(); // Fetch streak data
      fetchUserStats(); // Fetch user stats (including total points)
      fetchWeeklyProgress();
      fetchRecentActivities();
      fetchRecentBlogs();
      fetchUpcomingChallenges();
    }
  }, [user?.id]);

  // Debug: Monitor totalPoints changes
  useEffect(() => {
    console.log('totalPoints changed to:', totalPoints);
  }, [totalPoints]);

  const quickActions = [
    { title: 'Practice Scenarios', icon: <BiBrain className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500', route: '/practice' },
    { title: 'AI Interviews', icon: <BiMicrophone className="w-6 h-6" />, color: 'from-purple-500 to-pink-500', route: '/practice' },
    { title: 'Home Labs', icon: <BiLaptop className="w-6 h-6" />, color: 'from-green-500 to-emerald-500', route: '/labs' },
    { title: 'Learning Roadmaps', icon: <BiMap className="w-6 h-6" />, color: 'from-indigo-500 to-purple-500', route: '/roadmap' },
    { title: 'Free Books', icon: <BiBookOpen className="w-6 h-6" />, color: 'from-orange-500 to-red-500', route: '/books' },
    { title: 'Tools & Resources', icon: <BiWrench className="w-6 h-6" />, color: 'from-teal-500 to-cyan-500', route: '/tools' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome back, {user?.username || 'User'}! 👋
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">Ready to continue your cybersecurity journey?</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-3 sm:px-4 py-2 border border-white/20 w-full sm:w-auto justify-center">
                <FaFire className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                <span className="font-semibold text-sm sm:text-base">{currentStreak} day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-xl px-3 sm:px-4 py-2 border border-white/20 w-full sm:w-auto justify-center">
                <BiDiamond className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="font-semibold text-sm sm:text-base">{totalPoints} points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BiBrain className="w-6 h-6 text-white" />
              </div>
              <BiTrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{completedScenarios}</h3>
            <p className="text-gray-300 text-sm">Scenarios Completed</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BiMicrophone className="w-6 h-6 text-white" />
              </div>
              <BiTrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{aiInterviews}</h3>
            <p className="text-gray-300 text-sm">AI Interviews</p>
                </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BiLaptop className="w-6 h-6 text-white" />
              </div>
              <BiTrendingUp className="w-5 h-5 text-green-400" />
                    </div>
            <h3 className="text-2xl font-bold mb-1">{labsCompleted}</h3>
            <p className="text-gray-300 text-sm">Labs Completed</p>
                  </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <BiCrown className="w-6 h-6 text-white" />
              </div>
              <BiTrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {totalPoints > 0 ? `#${rank}` : 'Unranked'}
            </h3>
            <p className="text-gray-300 text-sm">Global Rank</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts & Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress Chart */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Weekly Progress</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Scenarios</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="scenarios" stroke="#60A5FA" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Radar Chart */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Skill Assessment</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadar}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
                    <Radar 
                      name="Skills" 
                      dataKey="value" 
                      stroke="#60A5FA" 
                      fill="#60A5FA" 
                      fillOpacity={0.3} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Blogs</h2>
                <Link to="/blogs" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentBlogs.map((blog, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {blog.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-300 transition-colors">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            {blog.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" />
                            {blog.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {blog.category}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {blog.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Quick Actions & Activities */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.route}
                    className={`bg-gradient-to-r ${action.color} p-4 rounded-2xl text-white font-semibold text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {action.icon}
                      <span className="text-sm">{action.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{activity.title}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-green-400 font-semibold text-sm">+{activity.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Challenges */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Upcoming Challenges</h2>
              <div className="space-y-4">
                {upcomingChallenges.map((challenge, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {challenge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{challenge.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className={`px-2 py-1 rounded-full ${
                            challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                          <span className="flex items-center gap-1">
                            <BiMedal className="w-3 h-3" />
                            {challenge.reward} pts
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegClock className="w-3 h-3" />
                            {challenge.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Continue Learning */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Continue Your Learning Journey</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Pick up where you left off or explore new challenges to advance your cybersecurity skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/practice"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <BiPlay className="w-5 h-5" />
                Continue Practice
              </Link>
              <Link
                to="/roadmap"
                className="bg-white/10 backdrop-blur-xl text-white px-8 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                View Roadmaps
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
} 