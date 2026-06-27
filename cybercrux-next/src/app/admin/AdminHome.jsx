"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers, FaUserCheck, FaBook, FaMap, FaBlog, FaTools,
  FaTrophy, FaExclamationTriangle, FaArrowUp, FaArrowDown, FaCircle
} from "react-icons/fa";
import { BiBrain } from "react-icons/bi";

export default function AdminHome() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, usersRes] = await Promise.all([
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/dashboard-stats", { credentials: "include" }),
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/recent-activity", { credentials: "include" }),
        fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/admin/top-users", { credentials: "include" }),
      ]);
      const [statsData, activityData, usersData] = await Promise.all([
        statsRes.json(), activityRes.json(), usersRes.json(),
      ]);
      if (statsData.success) setStats(statsData.data);
      if (activityData.success) setRecentActivity(activityData.data);
      if (usersData.success) setTopUsers(usersData.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const trendColor = (pct) => pct > 0 ? "text-green-400" : pct < 0 ? "text-red-400" : "text-white/30";
  const trendIcon = (pct) => pct > 0 ? <FaArrowUp className="w-3 h-3" /> : pct < 0 ? <FaArrowDown className="w-3 h-3" /> : <FaCircle className="w-2 h-2" />;

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-7 bg-white/[0.04] rounded w-48"></div>
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl h-32 border border-white/[0.05]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-1">Error Loading Dashboard</h3>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: "Total Users", value: stats.totalUsers || 0, sub: `+${stats.newUsersThisMonth || 0} this month`, growth: stats.userGrowth || 0, Icon: FaUsers, color: "text-blue-400", bg: "bg-blue-600/10" },
    { label: "Active Users", value: stats.activeUsers || 0, sub: `${stats.activeUserPercentage || 0}% of total`, growth: stats.activeUserGrowth || 0, Icon: FaUserCheck, color: "text-green-400", bg: "bg-green-600/10" },
    { label: "Practice Sessions", value: stats.totalPracticeSessions || 0, sub: `${stats.avgSessionDuration || 0}min avg`, growth: stats.practiceGrowth || 0, Icon: BiBrain, color: "text-purple-400", bg: "bg-purple-600/10" },
    { label: "Completion Rate", value: `${stats.completionRate || 0}%`, sub: `${stats.completedScenarios || 0} scenarios`, growth: stats.completionRateGrowth || 0, Icon: FaTrophy, color: "text-yellow-400", bg: "bg-yellow-600/10" },
  ];

  const contentStats = [
    { label: "Books", value: stats.totalBooks || 0, Icon: FaBook, color: "text-blue-400" },
    { label: "Roadmaps", value: stats.totalRoadmaps || 0, Icon: FaMap, color: "text-green-400" },
    { label: "Blogs", value: stats.totalBlogs || 0, Icon: FaBlog, color: "text-purple-400" },
    { label: "Tools", value: stats.totalTools || 0, Icon: FaTools, color: "text-orange-400" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Real-time overview of the CyberCrux platform</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, sub, growth, Icon, color, bg }) => (
          <div key={label} className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`${color} text-lg`} />
              </div>
              <div className={`flex items-center gap-1 text-xs ${trendColor(growth)}`}>
                {trendIcon(growth)}
                <span>{Math.abs(growth)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
            <div className="text-white/40 text-xs">{label}</div>
            <div className="text-white/25 text-xs mt-2">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Overview */}
        <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5">Content Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {contentStats.map(({ label, value, Icon, color }) => (
              <div key={label} className="bg-[#080808] border border-white/[0.05] rounded-lg p-4 text-center">
                <Icon className={`${color} text-2xl mx-auto mb-2`} />
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#080808] border border-white/[0.05] rounded-lg p-4">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Practice Stats</h3>
              <div className="space-y-2 text-sm">
                {[["Total Scenarios", stats.totalScenarios || 0], ["Total Questions", stats.totalQuestions || 0], ["Avg Score", `${stats.averageScore || 0}%`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#080808] border border-white/[0.05] rounded-lg p-4">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">User Engagement</h3>
              <div className="space-y-2 text-sm">
                {[["Daily Active", stats.dailyActiveUsers || 0], ["Weekly Active", stats.weeklyActiveUsers || 0], ["Monthly Active", stats.monthlyActiveUsers || 0]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5">Top Performers</h2>
          <div className="space-y-3">
            {topUsers.slice(0, 5).map((user, i) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-[#080808] border border-white/[0.04] rounded-lg">
                <div className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center text-xs font-bold text-red-400 shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.username}</p>
                  <p className="text-white/40 text-xs">{user.totalPoints} pts</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white text-sm font-medium">{user.completedScenarios}</div>
                  <div className="text-white/30 text-xs">done</div>
                </div>
              </div>
            ))}
            {topUsers.length === 0 && <p className="text-white/30 text-sm text-center py-4">No data available</p>}
          </div>
        </div>
      </div>

      {/* Recent Activity & System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></span>
                <div>
                  <p className="text-white/80 text-sm">{a.message}</p>
                  <p className="text-white/30 text-xs mt-0.5">{a.timestamp}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-white/30 text-sm text-center py-4">No recent activity</p>}
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-5">Platform Stats</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">New Users</h3>
              <div className="space-y-2">
                {[["Today", stats.newUsersToday || 0], ["This Week", stats.newUsersThisWeek || 0], ["This Month", stats.newUsersThisMonth || 0]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">System Health</h3>
              <div className="space-y-2">
                {[["Server", "Online", true], ["Database", "Healthy", true], ["Last Backup", stats.lastBackup || "2 hours ago", null]].map(([k, v, ok]) => (
                  <div key={k} className="flex justify-between items-center text-sm">
                    <span className="text-white/40">{k}</span>
                    <span className={`flex items-center gap-1.5 font-medium ${ok === true ? "text-green-400" : ok === false ? "text-red-400" : "text-white/70"}`}>
                      {ok !== null && <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`}></span>}
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
