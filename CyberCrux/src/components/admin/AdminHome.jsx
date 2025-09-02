import React, { useState, useEffect } from "react";
import { 
  FaUsers, 
  FaUserPlus, 
  FaUserCheck, 
  FaUserClock,
  FaBook, 
  FaMap, 
  FaBlog, 
  FaTools,
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaCircle
} from "react-icons/fa";
import { BiBrain, BiTargetLock, BiDiamond } from "react-icons/bi";

export default function AdminHome() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard statistics
      const [statsRes, activityRes, usersRes, growthRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/dashboard-stats', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/recent-activity', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/top-users', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/user-growth', { credentials: 'include' })
      ]);

      const [statsData, activityData, usersData, growthData] = await Promise.all([
        statsRes.json(),
        activityRes.json(),
        usersRes.json(),
        growthRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (activityData.success) setRecentActivity(activityData.data);
      if (usersData.success) setTopUsers(usersData.data);
      if (growthData.success) setUserGrowth(growthData.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getStatusColor = (percentage) => {
    if (percentage > 0) return 'text-green-500';
    if (percentage < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getStatusIcon = (percentage) => {
    if (percentage > 0) return <FaArrowUp className="w-3 h-3" />;
    if (percentage < 0) return <FaArrowDown className="w-3 h-3" />;
    return <FaCircle className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Real-time overview of CyberCrux platform statistics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getStatusColor(stats.userGrowth || 0)}`}>
              {getStatusIcon(stats.userGrowth || 0)}
              <span>{Math.abs(stats.userGrowth || 0)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers || 0}</h3>
          <p className="text-gray-600 text-sm">Total Users</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-green-600 font-medium">+{stats.newUsersThisMonth || 0}</span> this month
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FaUserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getStatusColor(stats.activeUserGrowth || 0)}`}>
              {getStatusIcon(stats.activeUserGrowth || 0)}
              <span>{Math.abs(stats.activeUserGrowth || 0)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeUsers || 0}</h3>
          <p className="text-gray-600 text-sm">Active Users</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-green-600 font-medium">{stats.activeUserPercentage || 0}%</span> of total users
          </div>
        </div>

        {/* Total Practice Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BiBrain className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getStatusColor(stats.practiceGrowth || 0)}`}>
              {getStatusIcon(stats.practiceGrowth || 0)}
              <span>{Math.abs(stats.practiceGrowth || 0)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPracticeSessions || 0}</h3>
          <p className="text-gray-600 text-sm">Practice Sessions</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-purple-600 font-medium">{stats.avgSessionDuration || 0}min</span> average
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FaTrophy className="w-6 h-6 text-orange-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${getStatusColor(stats.completionRateGrowth || 0)}`}>
              {getStatusIcon(stats.completionRateGrowth || 0)}
              <span>{Math.abs(stats.completionRateGrowth || 0)}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completionRate || 0}%</h3>
          <p className="text-gray-600 text-sm">Completion Rate</p>
          <div className="mt-4 text-xs text-gray-500">
            <span className="text-orange-600 font-medium">{stats.completedScenarios || 0}</span> scenarios completed
          </div>
        </div>
      </div>

      {/* Detailed Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Content Statistics */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Content Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FaBook className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalBooks || 0}</div>
              <div className="text-sm text-gray-600">Books</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <FaMap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalRoadmaps || 0}</div>
              <div className="text-sm text-gray-600">Roadmaps</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <FaBlog className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalBlogs || 0}</div>
              <div className="text-sm text-gray-600">Blogs</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <FaTools className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalTools || 0}</div>
              <div className="text-sm text-gray-600">Tools</div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Practice Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Scenarios:</span>
                  <span className="font-medium">{stats.totalScenarios || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{stats.totalQuestions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Score:</span>
                  <span className="font-medium">{stats.averageScore || 0}%</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">User Engagement</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Active:</span>
                  <span className="font-medium">{stats.dailyActiveUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Active:</span>
                  <span className="font-medium">{stats.weeklyActiveUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Active:</span>
                  <span className="font-medium">{stats.monthlyActiveUsers || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>
          <div className="space-y-4">
            {topUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0">
                  {index === 0 && <FaTrophy className="w-5 h-5 text-yellow-500" />}
                  {index === 1 && <FaTrophy className="w-5 h-5 text-gray-400" />}
                  {index === 2 && <FaTrophy className="w-5 h-5 text-orange-600" />}
                  {index > 2 && <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{index + 1}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.totalPoints} points</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.completedScenarios}</div>
                  <div className="text-xs text-gray-600">scenarios</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'user' && <FaUserPlus className="w-4 h-4 text-blue-500" />}
                  {activity.type === 'practice' && <BiBrain className="w-4 h-4 text-purple-500" />}
                  {activity.type === 'content' && <FaBook className="w-4 h-4 text-green-500" />}
                  {activity.type === 'achievement' && <FaTrophy className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
          <div className="space-y-6">
            {/* User Demographics */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">User Demographics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users (Today)</span>
                  <span className="font-medium">{stats.newUsersToday || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users (Week)</span>
                  <span className="font-medium">{stats.newUsersThisWeek || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users (Month)</span>
                  <span className="font-medium">{stats.newUsersThisMonth || 0}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Session Time</span>
                  <span className="font-medium">{stats.avgSessionTime || 0} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <span className="font-medium">{stats.bounceRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <span className="font-medium">{stats.totalPageViews || 0}</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium">{stats.lastBackup || '2 hours ago'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 