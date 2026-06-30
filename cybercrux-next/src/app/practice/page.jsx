"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiBrain, BiLaptop, BiTargetLock, BiTime, BiMedal, BiPlay,
  BiSearch, BiFilter, BiTrophy, BiCheckCircle, BiHomeAlt,
  BiMap, BiBookOpen, BiWrench, BiNews, BiCode, BiMicrophone,
  BiShield,
} from "react-icons/bi";
import {
  FaGlobe, FaUser, FaLock, FaBug, FaKey, FaSearch,
  FaFire, FaRegEye, FaRegHeart,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiActivity, FiSliders,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

/* ── sidebar nav (same as dashboard) ── */
const navLinks = [
  { label: "Dashboard",      href: "/dashboard",   icon: BiHomeAlt },
  { label: "Practice",       href: "/practice",    icon: BiBrain },
  { label: "Compete",        href: "/compete",     icon: BiTrophy },
  { label: "Mock Interview", href: "/interviews",  icon: BiMicrophone },
  { label: "Roadmaps",       href: "/roadmap",     icon: BiMap },
  { label: "Labs",           href: "/labs",        icon: BiLaptop },
  { label: "Books",          href: "/books",       icon: BiBookOpen },
  { label: "Tools",          href: "/tools",       icon: BiWrench },
  { label: "Projects",       href: "/projects",    icon: BiCode },
  { label: "Blog",           href: "/blog",        icon: BiNews },
  { label: "Badges",         href: "/badges",      icon: BiMedal },
];

const getCategoryIcon = (cat) => {
  const map = {
    web:      <FaGlobe />,
    network:  <BiLaptop />,
    forensics:<FaSearch />,
    crypto:   <FaKey />,
    reverse:  <FaBug />,
    osint:    <FaLock />,
  };
  return map[cat] || <BiBrain />;
};

const diffTag = (d) =>
  d === "Hard"   ? "bg-red-900/40 text-red-400 border-red-800/30" :
  d === "Medium" ? "bg-yellow-900/40 text-yellow-400 border-yellow-800/30" :
                   "bg-green-900/40 text-green-400 border-green-800/30";

const XP_PER_LEVEL = 100;

export default function PracticePage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  /* sidebar / topbar state */
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  /* filter state */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery,      setSearchQuery]      = useState("");
  const [sortBy,           setSortBy]           = useState("popular");
  const [filterCompleted,  setFilterCompleted]  = useState(false);

  /* data state */
  const [scenarios,          setScenarios]          = useState([]);
  const [filteredScenarios,  setFilteredScenarios]  = useState([]);
  const [userProgress,       setUserProgress]       = useState({});
  const [dynamicCategories,  setDynamicCategories]  = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState(null);
  const [userStats, setUserStats] = useState({
    totalCompleted: 0, totalPoints: 0, currentStreak: 0,
    averageScore: 0,   rank: "Unranked", level: 1,
  });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  /* ── fetch scenarios ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res  = await fetch(`${API}/api/practice/scenarios`);
        const data = await res.json();
        if (data.success) {
          const parsed = data.data.map(s => ({
            ...s,
            tags: Array.isArray(s.tags) ? s.tags : (typeof s.tags === 'string' ? JSON.parse(s.tags) : [])
          }));
          setScenarios(parsed);
          setFilteredScenarios(parsed);
          const counts = {};
          data.data.forEach(s => { if (s.category) counts[s.category] = (counts[s.category] || 0) + 1; });
          setDynamicCategories([
            { key: "all", label: "All", icon: <BiBrain />, count: data.data.length },
            ...Object.entries(counts).map(([k, c]) => ({
              key: k, label: k.charAt(0).toUpperCase() + k.slice(1), icon: getCategoryIcon(k), count: c,
            })),
          ]);
        } else {
          setError(data.message || "Failed to fetch scenarios");
        }
      } catch { setError("Network error. Please check your connection."); }
      finally  { setLoading(false); }
    })();
  }, []);

  /* ── filter whenever deps change ── */
  useEffect(() => {
    if (!scenarios.length) return;
    setFilteredScenarios(scenarios.filter(s => {
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !s.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }));
  }, [selectedCategory, searchQuery, scenarios]);

  /* ── fetch user data ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [progRes, statsRes, streakRes] = await Promise.allSettled([
          fetch(`${API}/api/practice/progress`,  { credentials: "include" }),
          fetch(`${API}/api/practice/stats`,     { credentials: "include" }),
          fetch(`${API}/api/streak/user-streak/${user.id}`),
        ]);

        if (progRes.status === "fulfilled") {
          const d = await progRes.value.json();
          if (d.success) {
            const map = {};
            d.data.forEach(i => { map[i.scenario_id] = { score: i.score, is_completed: i.is_completed }; });
            setUserProgress(map);
          }
        }
        if (statsRes.status === "fulfilled") {
          const d = await statsRes.value.json();
          if (d.success) {
            const s = d.data.overview;
            setUserStats(prev => ({
              ...prev,
              totalCompleted: s.completed_scenarios || 0,
              totalPoints:    s.total_points_earned || 0,
              averageScore:   Math.round(s.average_score || 0),
              level:          Math.floor((s.total_points_earned || 0) / XP_PER_LEVEL) + 1,
              rank:           s.rank || "Unranked",
            }));
          }
        }
        if (streakRes.status === "fulfilled") {
          const d = await streakRes.value.json();
          if (d.streak) setUserStats(prev => ({ ...prev, currentStreak: d.streak.current_streak || 0 }));
        }
      } catch {}
    })();
  }, [user]);

  /* ── click-outside ── */
  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    logout();
    router.push("/login");
  };

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  /* ── derived scenarios ── */
  const displayed = [...filteredScenarios]
    .filter(s => !filterCompleted || userProgress[s.id]?.is_completed)
    .sort((a, b) => {
      if (sortBy === "popular")    return (b.views || 0) - (a.views || 0);
      if (sortBy === "newest")     return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sortBy === "difficulty") return ({ Easy: 1, Medium: 2, Hard: 3 }[a.difficulty] || 0) - ({ Easy: 1, Medium: 2, Hard: 3 }[b.difficulty] || 0);
      if (sortBy === "points")     return (b.points || 0) - (a.points || 0);
      return 0;
    });

  const completedCount = Object.values(userProgress).filter(p => p.is_completed).length;

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {/* mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════ SIDEBAR ════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col w-60 flex-shrink-0
        bg-[#0C0C0C] border-r border-red-900/20
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden transition-colors" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* user card */}
        <div className="px-4 py-4 border-b border-red-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || "Hacker"}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 font-medium bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">
                  LVL {userStats.level}
                </span>
                <span className="text-[10px] text-gray-600">{userStats.totalPoints} XP</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span>{userStats.totalPoints % XP_PER_LEVEL} / {XP_PER_LEVEL} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(2, ((userStats.totalPoints % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${active ? "bg-red-600/12 text-red-400 border border-red-600/18" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"}`}
              >
                <Icon className={`text-base shrink-0 ${active ? "text-red-400" : "text-gray-600 group-hover:text-gray-400"}`} />
                <span className="truncate">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-red-900/10 space-y-0.5">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-colors">
            <FiSettings className="text-base" /> Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-600/10 transition-colors">
            <FiLogOut className="text-base" /> Log out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Practice Arena</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">
              {completedCount} completed · {scenarios.length} total scenarios
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{userStats.currentStreak}</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">streak</span>
          </div>
          <button className="relative p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
            <FiBell className="text-base" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none">
              <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-red-900/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-red-900/10 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                  <p className="text-[11px] text-gray-600 truncate">{user?.email}</p>
                </div>
                {[
                  { icon: FiUser,     label: "Profile",  href: `/profile/${user?.username}` },
                  { icon: FiSettings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Icon className="text-sm" /> {label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-red-900/10" />
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors">
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* scrollable content */}
        <main className="flex-1 overflow-y-auto">

          {/* ── stat strip ── */}
          <div className="border-b border-white/[0.05] bg-[#0A0A0A] px-5 py-3">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: "Completed",    value: userStats.totalCompleted, accent: "#EF4444" },
                { label: "Total Points", value: userStats.totalPoints,    accent: "#F97316" },
                { label: "Day Streak",   value: userStats.currentStreak,  accent: "#FBBF24" },
                { label: "Avg Score",    value: `${userStats.averageScore}%`, accent: "#FB7185" },
                { label: "Global Rank",  value: userStats.totalPoints > 0 ? `#${userStats.rank}` : "—", accent: "#A78BFA" },
                { label: "Level",        value: userStats.level,          accent: "#34D399" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-bold" style={{ color: s.accent }}>{s.value}</p>
                  <p className="text-[10px] text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-full">

            {/* ── category sidebar ── */}
            <aside className="w-full lg:w-56 xl:w-60 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.05] bg-[#0A0A0A]">
              <div className="p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BiFilter className="text-sm" /> Categories
                </p>
                <div className="space-y-1 flex flex-row lg:flex-col gap-1 lg:gap-0 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 flex-wrap">
                  {dynamicCategories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 whitespace-nowrap flex-shrink-0
                        ${selectedCategory === cat.key
                          ? "bg-red-600/15 text-red-400 border border-red-600/20"
                          : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
                        }`}
                    >
                      <span className={`text-base ${selectedCategory === cat.key ? "text-red-400" : "text-gray-600"}`}>
                        {cat.icon}
                      </span>
                      <span className="flex-1 truncate">{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-auto
                        ${selectedCategory === cat.key ? "bg-red-600/20 text-red-400" : "bg-white/5 text-gray-600"}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── scenarios area ── */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* search + sort bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-base pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search scenarios..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#0F0F0F] border border-white/[0.07] hover:border-white/[0.12] focus:border-red-600/40 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2.5 bg-[#0F0F0F] border border-white/[0.07] hover:border-white/[0.12] rounded-lg text-sm text-gray-300 outline-none cursor-pointer transition-colors"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="points">Most Points</option>
                    </select>
                    <FiSliders className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setFilterCompleted(f => !f)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border whitespace-nowrap
                      ${filterCompleted
                        ? "bg-red-600/15 text-red-400 border-red-600/20"
                        : "bg-[#0F0F0F] text-gray-500 border-white/[0.07] hover:text-gray-300 hover:border-white/[0.12]"
                      }`}
                  >
                    {filterCompleted ? "Completed Only" : "Show All"}
                  </button>
                </div>
              </div>

              {/* result count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">
                  <span className="text-white font-semibold">{displayed.length}</span> scenario{displayed.length !== 1 ? "s" : ""} found
                </p>
                {(searchQuery || selectedCategory !== "all" || filterCompleted) && (
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setFilterCompleted(false); }}
                    className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear filters ×
                  </button>
                )}
              </div>

              {/* loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-4" />
                  <p className="text-sm text-gray-600">Loading scenarios...</p>
                </div>
              )}

              {/* error */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4">
                    <BiTargetLock className="text-red-400 text-xl" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">Failed to load scenarios</p>
                  <p className="text-xs text-gray-600 mb-4">{error}</p>
                  <button onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    Retry
                  </button>
                </div>
              )}

              {/* grid */}
              {!loading && !error && (
                <>
                  {displayed.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {displayed.map(scenario => {
                        const done = userProgress[scenario.id]?.is_completed;
                        return (
                          <Link
                            href={`/practice/${scenario.id}`}
                            key={scenario.id}
                            className="group flex flex-col bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/40 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.07)]"
                          >
                            {/* card top accent strip */}
                            <div className={`h-0.5 w-full ${
                              scenario.difficulty === "Hard"   ? "bg-gradient-to-r from-red-700 to-red-500" :
                              scenario.difficulty === "Medium" ? "bg-gradient-to-r from-yellow-700 to-yellow-500" :
                                                                  "bg-gradient-to-r from-green-700 to-green-500"
                            }`} />

                            <div className="p-5 flex-1 flex flex-col">
                              {/* header row */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${diffTag(scenario.difficulty)}`}>
                                    {scenario.difficulty}
                                  </span>
                                  {scenario.category && (
                                    <span className="text-[10px] text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded capitalize">
                                      {scenario.category}
                                    </span>
                                  )}
                                </div>
                                {done && (
                                  <BiCheckCircle className="text-green-500 text-base flex-shrink-0" title="Completed" />
                                )}
                              </div>

                              {/* title */}
                              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white mb-2 line-clamp-2 leading-snug transition-colors">
                                {scenario.title}
                              </h3>

                              {/* tags */}
                              {scenario.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {scenario.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-600/8 text-red-400/80 border border-red-600/15 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {scenario.tags.length > 3 && (
                                    <span className="text-[10px] text-gray-600">+{scenario.tags.length - 3}</span>
                                  )}
                                </div>
                              )}

                              {/* description */}
                              <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed mb-4">
                                {scenario.short_description || scenario.description}
                              </p>

                              {/* meta row */}
                              <div className="flex items-center gap-3 text-[11px] text-gray-600 mb-4">
                                {scenario.time_estimate && (
                                  <span className="flex items-center gap-1">
                                    <BiTime className="text-xs" />
                                    {scenario.time_estimate}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <BiBrain className="text-xs" />
                                  {scenario.questions_count || scenario.questions || 0} Qs
                                </span>
                                <span className="flex items-center gap-1 ml-auto">
                                  <FaRegEye className="text-xs" />
                                  {scenario.views || 0}
                                </span>
                              </div>
                            </div>

                            {/* card footer */}
                            <div className="px-5 py-3 bg-[#0C0C0C] border-t border-white/[0.04] flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                                <BiMedal className="text-xs text-red-500/70" />
                                <span className="font-semibold text-red-400">{scenario.points}</span>
                                <span>pts</span>
                                {scenario.completion_rate !== undefined && (
                                  <>
                                    <span className="text-gray-700 mx-1">·</span>
                                    <span>{scenario.completion_rate || 0}% rate</span>
                                  </>
                                )}
                              </div>
                              <span className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all
                                ${done
                                  ? "bg-green-900/30 text-green-400 border border-green-800/30 group-hover:bg-green-900/40"
                                  : "bg-red-600 text-white group-hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)] group-hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                                }
                              `}>
                                <BiPlay className="text-sm" />
                                {done ? "Review" : "Start"}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    /* empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-14 h-14 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center mb-4">
                        <BiSearch className="text-2xl text-gray-600" />
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">No scenarios found</p>
                      <p className="text-xs text-gray-600 mb-4">Try adjusting your filters or search query</p>
                      <button
                        onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setFilterCompleted(false); }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
