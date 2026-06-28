"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop,
  BiMedal, BiTargetLock, BiCrown, BiNews, BiHomeAlt, BiTrophy,
  BiCode,
} from 'react-icons/bi';
import { FaFire, FaRegClock } from 'react-icons/fa';
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiActivity,
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import FloatingChatWidget from '@/components/chatbot/FloatingChatWidget';

const navLinks = [
  { label: 'Dashboard',     href: '/dashboard',   icon: BiHomeAlt },
  { label: 'Practice',      href: '/practice',    icon: BiBrain },
  { label: 'Compete',       href: '/compete',     icon: BiTrophy },
  { label: 'Mock Interview', href: '/interviews', icon: BiMicrophone },
  { label: 'Roadmaps',      href: '/roadmap',     icon: BiMap },
  { label: 'Labs',          href: '/labs',        icon: BiLaptop },
  { label: 'Books',         href: '/books',       icon: BiBookOpen },
  { label: 'Tools',         href: '/tools',       icon: BiWrench },
  { label: 'Projects',      href: '/projects',    icon: BiCode },
  { label: 'Blog',          href: '/blog',        icon: BiNews },
  { label: 'Badges',        href: '/badges',      icon: BiMedal },
];

const XP_PER_LEVEL = 100;

export default function DashboardPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [currentStreak,      setCurrentStreak]      = useState(0);
  const [totalPoints,        setTotalPoints]        = useState(0);
  const [level,              setLevel]              = useState(1);
  const [rank,               setRank]               = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [aiInterviews,       setAiInterviews]       = useState(0);
  const [labsCompleted,      setLabsCompleted]      = useState(0);
  const [weeklyProgress,     setWeeklyProgress]     = useState([]);
  const [recentActivities,   setRecentActivities]   = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [skillRadar, setSkillRadar] = useState([
    { skill: 'Network', value: 0 },
    { skill: 'Web Sec', value: 0 },
    { skill: 'Malware', value: 0 },
    { skill: 'IR',      value: 0 },
    { skill: 'Crypto',  value: 0 },
    { skill: 'Forensics', value: 0 },
  ]);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

  const getTimeAgo = (date) => {
    try {
      const now = new Date();
      const ms  = now - date;
      if (isNaN(ms) || ms < 0) return 'Recently';
      const h = Math.floor(ms / 3_600_000);
      const d = Math.floor(ms / 86_400_000);
      if (h < 1)  return 'Just now';
      if (h < 24) return `${h}h ago`;
      if (d < 7)  return `${d}d ago`;
      if (d < 30) return `${Math.floor(d / 7)}w ago`;
      return `${Math.floor(d / 30)}mo ago`;
    } catch { return 'Recently'; }
  };

  const fetchStreakData = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${API}/api/streak/user-streak/${user.id}`);
      const data = await res.json();
      setCurrentStreak(data.streak?.current_streak || 0);
    } catch {}
  };

  const fetchUserStats = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${API}/api/practice/stats`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const s = data.data.overview;
        setCompletedScenarios(s.completed_scenarios || 0);
        setTotalPoints(s.total_points_earned || 0);
        setLevel(Math.floor((s.total_points_earned || 0) / XP_PER_LEVEL) + 1);
        setRank(s.rank || 0);
        if (data.data.categories?.length) {
          setSkillRadar(data.data.categories.map(c => ({
            skill: c.category.charAt(0).toUpperCase() + c.category.slice(1),
            value: Math.min(100, Math.max(0, Math.round(((c.avg_score || 0) + ((c.completed / (c.total || 1)) * 100)) / 2))),
          })));
        }
      }
    } catch {}
  };

  const fetchWeeklyProgress = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${API}/api/practice/progress`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        const days  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        setWeeklyProgress(days.map((day, i) => {
          const target = new Date(today);
          target.setDate(today.getDate() - (today.getDay() - i));
          const ds = target.toISOString().split('T')[0];
          return {
            day,
            scenarios: data.data.filter(item => item.completed_at && new Date(item.completed_at).toISOString().split('T')[0] === ds).length,
          };
        }));
      }
    } catch {}
  };

  const fetchRecentActivities = async () => {
    if (!user?.id) return;
    try {
      const res  = await fetch(`${API}/api/practice/progress`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setRecentActivities(
          data.data
            .filter(i => i.is_completed)
            .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
            .slice(0, 5)
            .map(i => ({
              title:  `Completed ${i.scenario_name || 'Practice Scenario'}`,
              time:   getTimeAgo(new Date(i.completed_at)),
              points: i.score || 0,
            }))
        );
      }
    } catch {}
  };

  const fetchUpcomingChallenges = async () => {
    try {
      const res  = await fetch(`${API}/api/practice/scenarios`);
      const data = await res.json();
      if (data.success) {
        setUpcomingChallenges(
          data.data
            .filter(s => !s.is_completed)
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 4)
            .map(s => ({ title: s.title, difficulty: s.difficulty || 'Medium', reward: s.points || 100 }))
        );
      }
    } catch {}
  };

  const recordLogin = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${API}/api/streak/record-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch {}
  };

  useEffect(() => {
    if (user?.id) {
      recordLogin();
      fetchStreakData();
      fetchUserStats();
      fetchWeeklyProgress();
      fetchRecentActivities();
      fetchUpcomingChallenges();
    }
  }, [user?.id]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch {}
    logout();
    router.push('/login');
  };

  const isActive = (href) => pathname === href || (href !== '/' && pathname.startsWith(href));

  const xpInLevel   = totalPoints % XP_PER_LEVEL;
  const xpProgress  = (xpInLevel / XP_PER_LEVEL) * 100;

  const diffColor = (d) =>
    d === 'Hard'   ? 'bg-red-900/40 text-red-400 border-red-800/30' :
    d === 'Medium' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800/30' :
                     'bg-green-900/40 text-green-400 border-green-800/30';

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ════════════════════ SIDEBAR ════════════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-60 flex-shrink-0
        bg-[#0C0C0C] border-r border-red-900/20
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Logo row */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button
            className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-red-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || 'Hacker'}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 font-medium bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">
                  LVL {level}
                </span>
                <span className="text-[10px] text-gray-600">{totalPoints} XP</span>
              </div>
            </div>
          </div>
          {/* XP bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span>{xpInLevel} / {XP_PER_LEVEL} XP to Level {level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${xpProgress || 2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-red-600/12 text-red-400 border border-red-600/18'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className={`text-base shrink-0 ${active ? 'text-red-400' : 'text-gray-600 group-hover:text-gray-400'}`} />
                <span className="truncate">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-red-900/10 space-y-0.5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-colors"
          >
            <FiSettings className="text-base" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-600/10 transition-colors"
          >
            <FiLogOut className="text-base" />
            Log out
          </button>
        </div>
      </aside>

      {/* ════════════════════ MAIN ════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Topbar ── */}
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="text-base" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">
              Welcome back,{' '}
              <span className="text-red-400">{user?.username || 'Hacker'}</span>
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">Your cybersecurity command center</p>
          </div>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{currentStreak}</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">day streak</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
            <FiBell className="text-base" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-red-900/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-red-900/10 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-[11px] text-gray-600 truncate">{user?.email}</p>
                </div>
                {[
                  { icon: FiUser,     label: 'Profile',  href: `/profile/${user?.username}` },
                  { icon: FiSettings, label: 'Settings', href: '/settings' },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Icon className="text-sm" /> {label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-red-900/10" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors"
                >
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Scrollable page content ── */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: 'Scenarios Solved',
                value: completedScenarios,
                icon:  BiBrain,
                accent: '#EF4444',
                sub:   'Practice sessions',
              },
              {
                label: 'AI Interviews',
                value: aiInterviews,
                icon:  BiMicrophone,
                accent: '#F97316',
                sub:   'Mock sessions',
              },
              {
                label: 'Labs Completed',
                value: labsCompleted,
                icon:  BiLaptop,
                accent: '#FB7185',
                sub:   'Hands-on labs',
              },
              {
                label: 'Global Rank',
                value: totalPoints > 0 ? `#${rank}` : '—',
                icon:  BiCrown,
                accent: '#FBBF24',
                sub:   `${totalPoints} total XP`,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5 hover:border-red-900/30 transition-colors"
                style={{ boxShadow: `0 0 0 0 ${s.accent}` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.accent}18` }}
                  >
                    <s.icon className="text-xl" style={{ color: s.accent }} />
                  </div>
                  <FiActivity className="text-gray-700 text-sm mt-1" />
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-xs font-semibold text-gray-300">{s.label}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Middle row: Chart + Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Weekly activity bar chart */}
            <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-semibold text-white">Weekly Activity</h2>
                  <p className="text-[11px] text-gray-600 mt-0.5">Scenarios completed this week</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[11px] text-gray-500">Scenarios</span>
                </div>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgress} barSize={24} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#555', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#555', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#161616',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#fff',
                      }}
                      cursor={{ fill: 'rgba(239,68,68,0.04)' }}
                    />
                    <Bar
                      dataKey="scenarios"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Recent Activity</h2>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      {/* timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-md bg-red-600/12 border border-red-600/18 flex items-center justify-center flex-shrink-0">
                          <BiBrain className="text-red-400 text-xs" />
                        </div>
                        {i < recentActivities.length - 1 && (
                          <div className="w-px h-5 bg-red-900/20 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <p className="text-xs font-medium text-gray-300 truncate leading-tight">{a.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaRegClock className="text-gray-700 text-[10px]" />
                          <span className="text-[11px] text-gray-600">{a.time}</span>
                          <span className="ml-auto text-[11px] font-semibold text-green-500">+{a.points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <BiBrain className="text-3xl text-gray-700 mb-2" />
                  <p className="text-xs text-gray-600 mb-3">No activity yet</p>
                  <Link
                    href="/practice"
                    className="text-xs text-red-400 hover:text-red-300 bg-red-600/10 hover:bg-red-600/15 px-3 py-1.5 rounded-lg border border-red-600/20 transition-colors"
                  >
                    Start Practicing
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom row: Radar + Challenges + Quick access ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Skill radar */}
            <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
              <div className="mb-1">
                <h2 className="text-sm font-semibold text-white">Skill Matrix</h2>
                <p className="text-[11px] text-gray-600 mt-0.5">Based on practice performance</p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillRadar} outerRadius="70%">
                    <PolarGrid stroke="rgba(239,68,68,0.12)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: '#555', fontSize: 10 }}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.18}
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', r: 3 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming challenges */}
            <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Next Challenges</h2>
                <Link href="/practice" className="text-[11px] text-red-400 hover:text-red-300 transition-colors">
                  View all →
                </Link>
              </div>
              {upcomingChallenges.length > 0 ? (
                <div className="space-y-2.5">
                  {upcomingChallenges.map((c, i) => (
                    <Link href="/practice" key={i}
                      className="flex items-start gap-3 p-3 bg-[#141414] border border-white/[0.04] hover:border-red-900/30 rounded-lg transition-colors group"
                    >
                      <BiTargetLock className="text-red-500 text-base shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-300 truncate mb-1.5">{c.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${diffColor(c.difficulty)}`}>
                            {c.difficulty}
                          </span>
                          <span className="text-[10px] text-gray-600">{c.reward} pts</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BiTargetLock className="text-3xl text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No challenges available</p>
                </div>
              )}
            </div>

            {/* Quick access */}
            <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Practice',   icon: BiBrain,     href: '/practice' },
                  { label: 'Interviews', icon: BiMicrophone, href: '/interviews' },
                  { label: 'Labs',       icon: BiLaptop,    href: '/labs' },
                  { label: 'Roadmaps',   icon: BiMap,       href: '/roadmap' },
                  { label: 'Books',      icon: BiBookOpen,  href: '/books' },
                  { label: 'Tools',      icon: BiWrench,    href: '/tools' },
                ].map(({ label, icon: Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-2 p-3 bg-[#141414] border border-white/[0.04] hover:border-red-900/30 hover:bg-red-600/[0.04] rounded-lg transition-all group"
                  >
                    <Icon className="text-xl text-gray-600 group-hover:text-red-400 transition-colors" />
                    <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-300 transition-colors">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── CTA banner ── */}
          <div className="relative overflow-hidden bg-[#0F0F0F] border border-red-900/25 rounded-xl p-6">
            {/* Red glow blob */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-800/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-1">Continue Your Journey</h3>
                <p className="text-xs text-gray-500">
                  Pick up where you left off — {completedScenarios > 0 ? `you've completed ${completedScenarios} scenarios so far` : 'start your first scenario today'}.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href="/practice"
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_28px_rgba(239,68,68,0.4)]"
                >
                  Continue Practice
                </Link>
                <Link
                  href="/roadmap"
                  className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#222] text-gray-300 text-xs font-semibold rounded-lg border border-white/[0.07] hover:border-white/[0.12] transition-colors"
                >
                  View Roadmaps
                </Link>
              </div>
            </div>
          </div>

        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
