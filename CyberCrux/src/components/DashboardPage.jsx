import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashNav from './DashNav';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiMedal, BiPlay, BiTrendingUp, BiTargetLock, BiDiamond, BiCrown, BiNews
} from 'react-icons/bi';
import { FaFire , FaRegClock,  } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Footer from './Footer';
import { useAuth } from '../AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(2840);
  const [level, setLevel] = useState(12);
  const [rank, setRank] = useState(156);
  const [completedScenarios, setCompletedScenarios] = useState(47);
  const [aiInterviews, setAiInterviews] = useState(8);
  const [labsCompleted, setLabsCompleted] = useState(5);

  // Sample data for charts
  const weeklyProgress = [
    { day: 'Mon', scenarios: 4, interviews: 1, labs: 0 },
    { day: 'Tue', scenarios: 6, interviews: 2, labs: 1 },
    { day: 'Wed', scenarios: 3, interviews: 0, labs: 0 },
    { day: 'Thu', scenarios: 8, interviews: 1, labs: 1 },
    { day: 'Fri', scenarios: 5, interviews: 2, labs: 0 },
    { day: 'Sat', scenarios: 7, interviews: 1, labs: 1 },
    { day: 'Sun', scenarios: 4, interviews: 0, labs: 0 },
  ];

  const skillRadar = [
    { skill: 'Network Security', value: 85 },
    { skill: 'Web Security', value: 80 },
    { skill: 'Malware Analysis', value: 68 },
    { skill: 'Incident Response', value: 50 },
    { skill: 'Cryptography', value: 36 },
    { skill: 'Forensics', value: 79 },
  ];

  const recentActivities = [
    { type: 'scenario', title: 'Phishing Attack Response', time: '2 hours ago', points: 50, icon: <BiBrain className="w-5 h-5 text-blue-400" /> },
    { type: 'interview', title: 'SOC Analyst Mock Interview', time: '4 hours ago', points: 75, icon: <BiMicrophone className="w-5 h-5 text-purple-400" /> },
    { type: 'lab', title: 'Network Traffic Analysis Lab', time: '1 day ago', points: 100, icon: <BiLaptop className="w-5 h-5 text-green-400" /> },
    { type: 'scenario', title: 'Ransomware Incident Handling', time: '2 days ago', points: 60, icon: <BiBrain className="w-5 h-5 text-blue-400" /> },
  ];

  const upcomingChallenges = [
    { title: 'Advanced Penetration Testing', difficulty: 'Hard', reward: 200, deadline: '3 days', icon: <BiTargetLock className="w-6 h-6 text-red-400" /> },
    { title: 'Security Architecture Design', difficulty: 'Medium', reward: 150, deadline: '5 days', icon: <BiMap className="w-6 h-6 text-blue-400" /> },
    { title: 'Incident Response Simulation', difficulty: 'Hard', reward: 250, deadline: '1 week', icon: <BiWrench className="w-6 h-6 text-purple-400" /> },
  ];

  const recentBlogs = [
    { 
      title: 'Zero-Day Vulnerabilities: Understanding the Threat Landscape', 
      author: 'Sarah Chen', 
      time: '2 hours ago', 
      readTime: '5 min read',
      category: 'Threat Intelligence',
      icon: <BiNews className="w-5 h-5 text-blue-400" />
    },
    { 
      title: 'Building a Home Security Lab: A Complete Guide', 
      author: 'Mike Rodriguez', 
      time: '1 day ago', 
      readTime: '8 min read',
      category: 'Learning',
      icon: <BiNews className="w-5 h-5 text-green-400" />
    },
    { 
      title: 'The Future of AI in Cybersecurity Defense', 
      author: 'Dr. Emily Watson', 
      time: '3 days ago', 
      readTime: '6 min read',
      category: 'AI & ML',
      icon: <BiNews className="w-5 h-5 text-purple-400" />
    },
    { 
      title: 'Incident Response Best Practices for Small Teams', 
      author: 'Alex Thompson', 
      time: '1 week ago', 
      readTime: '7 min read',
      category: 'Incident Response',
      icon: <BiNews className="w-5 h-5 text-orange-400" />
    },
  ];

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
            <h3 className="text-2xl font-bold mb-1">#{rank}</h3>
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
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span>Interviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Labs</span>
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
                    <Line type="monotone" dataKey="interviews" stroke="#A78BFA" strokeWidth={3} />
                    <Line type="monotone" dataKey="labs" stroke="#34D399" strokeWidth={3} />
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
    </div>
  );
} 