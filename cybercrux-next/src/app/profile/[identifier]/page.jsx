"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useParams } from "next/navigation";
import CountryFlag from "@/components/ui/CountryFlag";
import {
  BiBrain, BiLaptop, BiMedal, BiHomeAlt, BiMap, BiBookOpen,
  BiWrench, BiNews, BiCode, BiMicrophone, BiTrophy, BiTargetLock,
  BiChart, BiDiamond,
} from "react-icons/bi";
import {
  FaTrophy, FaFire, FaUser, FaCalendarAlt, FaMedal, FaStar,
  FaEye, FaChartLine, FaAward, FaLinkedin, FaGithub,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

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

const FALLBACK_BADGE = "/badges/1.png";
const XP_PER_LEVEL = 100;

const getBadgeImageUrl = (badge) => {
  if (badge.icon?.startsWith("http")) return badge.icon;
  return `/badges/${badge.icon}` || FALLBACK_BADGE;
};

const formatStreak = (n) => `${n} day${n !== 1 ? "s" : ""}`;
const formatDate   = (s) => new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const formatTime   = (sec) => { const h = Math.floor((sec || 0) / 3600); const m = Math.floor(((sec || 0) % 3600) / 60); return `${h}h ${m}m`; };

const getRankColor = (rank) => {
  if (!rank) return "from-gray-700 to-gray-900";
  if (rank === 1)  return "from-yellow-400 to-yellow-600";
  if (rank <= 3)   return "from-gray-300 to-gray-500";
  if (rank <= 10)  return "from-orange-400 to-orange-600";
  if (rank <= 100) return "from-green-500 to-emerald-600";
  return "from-red-700 to-red-900";
};

const getPercentile = (rank) => {
  if (!rank)       return "Not ranked yet";
  if (rank === 1)  return "top 0.1%";
  if (rank <= 10)  return "top 1%";
  if (rank <= 100) return "top 5%";
  return "top 20%";
};

function BadgeItem({ badge, onClick }) {
  return (
    <button
      onClick={() => onClick(badge)}
      className="group relative w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-red-600/30 p-2 transition-all duration-200 hover:shadow-[0_0_16px_rgba(239,68,68,0.1)]"
    >
      <img
        src={getBadgeImageUrl(badge)}
        alt={badge.name}
        className="w-full h-full object-contain"
        onError={(e) => { e.target.src = FALLBACK_BADGE; }}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
        <div className="bg-[#111118] border border-white/[0.08] text-white text-[11px] rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
          <p className="font-semibold">{badge.name}</p>
          {badge.description && <p className="text-gray-400">{badge.description}</p>}
        </div>
      </div>
    </button>
  );
}

function StatCard({ icon, label, value, subtitle, gradient, dim = false }) {
  return (
    <div className="bg-[#111118] border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className={`font-bold leading-none ${dim ? "text-sm text-gray-400" : "text-lg text-white"}`}>{value}</p>
          {subtitle && <p className="text-[10px] text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

/* ── Logged-in shell ── */
function AuthShell({ children, user: currentUser, logout, router }) {
  const pathname = usePathname();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [userStats, setUserStats] = useState({ totalPoints: 0, currentStreak: 0, level: 1 });
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!currentUser?.id) return;
    Promise.allSettled([
      fetch(`${API}/api/practice/stats`, { credentials: "include" }),
      fetch(`${API}/api/streak/user-streak/${currentUser.id}`),
    ]).then(async ([sRes, stRes]) => {
      if (sRes.status === "fulfilled") {
        const d = await sRes.value.json();
        if (d.success) {
          const pts = d.data.overview?.total_points_earned || 0;
          setUserStats((p) => ({ ...p, totalPoints: pts, level: Math.floor(pts / XP_PER_LEVEL) + 1 }));
        }
      }
      if (stRes.status === "fulfilled") {
        const d = await stRes.value.json();
        if (d.streak) setUserStats((p) => ({ ...p, currentStreak: d.streak.current_streak || 0 }));
      }
    });
  }, [currentUser]);

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
  const xpInLevel  = userStats.totalPoints % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-60 flex-shrink-0 bg-[#0C0C0C] border-r border-red-900/20 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>

        <div className="px-4 py-4 border-b border-red-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
              {currentUser?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.username || "Hacker"}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 font-medium bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">LVL {userStats.level}</span>
                <span className="text-[10px] text-gray-600">{userStats.totalPoints} XP</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span>{xpInLevel} / {XP_PER_LEVEL} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700" style={{ width: `${Math.max(2, xpProgress)}%` }} />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${active ? "bg-red-600/12 text-red-400 border border-red-600/18" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"}`}>
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Public Profile</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{userStats.currentStreak}</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">streak</span>
          </div>
          <button className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
            <FiBell className="text-base" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none">
              <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 text-xs font-bold">
                {currentUser?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#101010] border border-red-900/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-red-900/10 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{currentUser?.username}</p>
                  <p className="text-[11px] text-gray-600 truncate">{currentUser?.email}</p>
                </div>
                {[
                  { icon: FiUser,     label: "Profile",  href: `/profile/${currentUser?.username}` },
                  { icon: FiSettings, label: "Settings", href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Icon className="text-sm" /> {label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-red-900/10" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors">
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}

/* ── Public (not logged in) shell ── */
function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="h-14 flex items-center px-6 border-b border-white/[0.06] bg-[#0A0A0A]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            <FiShield className="text-white text-xs" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">CyberCrux</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="text-xs text-gray-400 hover:text-white transition-colors">Log in</Link>
          <Link href="/signup" className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">Sign up</Link>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

/* ── Profile Content ── */
function ProfileContent({ profile, isOwnProfile }) {
  const [activeTab,    setActiveTab]    = useState("overview");
  const [selectedBadge, setSelectedBadge] = useState(null);

  const { user, stats, badges } = profile;

  const statCards = [
    { icon: <BiTrophy  className="text-white text-sm" />, label: "Global Rank",        value: stats.rank ? `#${stats.rank}` : "Unranked", subtitle: getPercentile(stats.rank), gradient: getRankColor(stats.rank), dim: !stats.rank },
    { icon: <FaFire    className="text-white text-sm" />, label: "Current Streak",     value: formatStreak(stats.current_streak), subtitle: `Best: ${formatStreak(stats.longest_streak)}`, gradient: "from-orange-500 to-red-500" },
    { icon: <BiDiamond className="text-white text-sm" />, label: "Total Points",       value: stats.total_points.toLocaleString(), gradient: "from-red-700 to-red-900" },
    { icon: <FaMedal   className="text-white text-sm" />, label: "Badges Earned",      value: badges.length, gradient: "from-yellow-600 to-orange-600" },
    { icon: <BiTargetLock className="text-white text-sm" />, label: "Scenarios Done",  value: stats.completed_scenarios, gradient: "from-green-600 to-emerald-700" },
    { icon: <FaStar    className="text-white text-sm" />, label: "Level",              value: stats.level, gradient: "from-purple-600 to-violet-700" },
  ];

  return (
    <>
      {/* Profile Header */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-6 mb-5">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Avatar + info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-red-600/10 border-2 border-red-600/20 overflow-hidden flex items-center justify-center flex-shrink-0">
              {user.profile_pic
                ? <img src={user.profile_pic} alt={user.username} className="w-full h-full object-cover" />
                : <FaUser className="text-red-400 text-2xl" />
              }
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{user.username}</h1>
              <p className="text-sm text-gray-400 mb-2 leading-relaxed max-w-md">
                {user.description || (stats.completed_scenarios === 0
                  ? "New Cybersecurity Practitioner — Complete your first scenario to get started!"
                  : `Level ${stats.level} Cybersecurity Practitioner`
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                {user.country && (
                  <span className="flex items-center gap-1.5">
                    <CountryFlag country={user.country} size="14px" height="12px" title={user.country} />
                    {user.country}
                  </span>
                )}
                <span className="flex items-center gap-1"><FaStar className="text-yellow-400 text-[10px]" /> Level {stats.level}</span>
                <span className="flex items-center gap-1"><FaCalendarAlt className="text-[10px]" /> Joined {formatDate(user.created_at)}</span>
              </div>
              {(user.linkedin_url || user.github_url) && (
                <div className="flex flex-wrap gap-2">
                  {user.linkedin_url && (
                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-lg text-[11px] text-[#4A9FD5] hover:bg-[#0A66C2]/20 transition-colors">
                      <FaLinkedin /> LinkedIn
                    </a>
                  )}
                  {user.github_url && (
                    <a href={user.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[11px] text-gray-400 hover:bg-white/[0.07] transition-colors">
                      <FaGithub /> GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stat grid */}
          <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-1 w-fit">
        {[
          { key: "overview", icon: <FaEye className="text-xs" />,       label: "Overview" },
          { key: "badges",   icon: <FaMedal className="text-xs" />,     label: "Badges" },
          { key: "stats",    icon: <FaChartLine className="text-xs" />, label: "Detailed Stats" },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all
              ${activeTab === key ? "bg-red-600/20 text-red-400 border border-red-600/20" : "text-gray-500 hover:text-gray-300"}`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400 text-xs" /> Recent Badges
            </h3>
            {badges.slice(-6).length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {badges.slice(-6).map((b) => <BadgeItem key={b.id} badge={b} onClick={setSelectedBadge} />)}
              </div>
            ) : (
              <p className="text-xs text-gray-600">No badges earned yet — complete a scenario to earn your first!</p>
            )}
          </div>

          <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BiChart className="text-red-400" /> Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                { label: "Current Level",   value: stats.level },
                { label: "Global Rank",     value: stats.rank ? `#${stats.rank}` : "Unranked" },
                { label: "Success Rate",    value: `${stats.average_score}%` },
                { label: "Current Streak",  value: formatStreak(stats.current_streak) },
                { label: "Longest Streak",  value: formatStreak(stats.longest_streak) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {activeTab === "badges" && (
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FaAward className="text-yellow-400" /> Achievements &amp; Badges
          </h2>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => <BadgeItem key={b.id} badge={b} onClick={setSelectedBadge} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-3">
                <FaMedal className="text-gray-600 text-lg" />
              </div>
              <p className="text-sm text-gray-400">No badges earned yet</p>
              <p className="text-xs text-gray-600 mt-1">Complete practice scenarios to earn badges!</p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Stats */}
      {activeTab === "stats" && (
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <FaChartLine className="text-red-400" /> Detailed Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Performance", color: "text-red-400",
                rows: [
                  ["Scenarios Completed", stats.completed_scenarios],
                  ["Average Score",       `${stats.average_score}%`],
                  ["Total Points",        stats.total_points.toLocaleString()],
                ],
              },
              {
                title: "Activity", color: "text-green-400",
                rows: [
                  ["Current Streak", formatStreak(stats.current_streak)],
                  ["Longest Streak", formatStreak(stats.longest_streak)],
                  ["Time Spent",     formatTime(stats.total_time)],
                ],
              },
              {
                title: "Achievements", color: "text-yellow-400",
                rows: [
                  ["Badges Earned", badges.length],
                  ["Current Level", stats.level],
                  ["Global Rank",   stats.rank ? `#${stats.rank}` : "Unranked"],
                ],
              },
            ].map(({ title, color, rows }) => (
              <div key={title}>
                <p className={`text-xs font-semibold ${color} uppercase tracking-wider mb-3`}>{title}</p>
                <div className="space-y-2.5">
                  {rows.map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs font-semibold text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-20 h-20 rounded-xl bg-white/[0.04] border border-white/[0.07] p-3 mx-auto mb-4">
              <img src={getBadgeImageUrl(selectedBadge)} alt={selectedBadge.name} className="w-full h-full object-contain" onError={(e) => { e.target.src = FALLBACK_BADGE; }} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">{selectedBadge.name}</h3>
            {selectedBadge.description && <p className="text-xs text-gray-400 mb-5">{selectedBadge.description}</p>}
            <button onClick={() => setSelectedBadge(null)}
              className="px-5 py-2 bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-600/20 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Main export ── */
export default function ProfilePage() {
  const { identifier }       = useParams();
  const { user: currentUser, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    if (!identifier) return;
    (async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API}/api/profile/${identifier}`);
        const data = await res.json();
        if (data.success) setProfile(data.profile);
        else setError(data.message || "Profile not found");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [identifier]);

  const isOwnProfile = currentUser && profile?.user?.username === currentUser.username;

  /* Loading */
  if (loading) {
    const inner = (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-600">Loading profile…</p>
      </div>
    );
    return currentUser
      ? <AuthShell user={currentUser} logout={logout} router={router}>{inner}</AuthShell>
      : <PublicShell>{inner}</PublicShell>;
  }

  /* Error */
  if (error) {
    const inner = (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center mb-4">
          <FaUser className="text-gray-600 text-2xl" />
        </div>
        <p className="text-sm font-semibold text-white mb-1">Profile Not Found</p>
        <p className="text-xs text-gray-600 mb-5">{error}</p>
        <Link href={currentUser ? "/dashboard" : "/"}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
          {currentUser ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    );
    return currentUser
      ? <AuthShell user={currentUser} logout={logout} router={router}>{inner}</AuthShell>
      : <PublicShell>{inner}</PublicShell>;
  }

  const content = <ProfileContent profile={profile} isOwnProfile={isOwnProfile} />;
  return currentUser
    ? <AuthShell user={currentUser} logout={logout} router={router}>{content}</AuthShell>
    : <PublicShell>{content}</PublicShell>;
}
