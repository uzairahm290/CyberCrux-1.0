"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop,
  BiMedal, BiTrophy, BiNews, BiHomeAlt, BiCode, BiTargetLock,
  BiChevronUp, BiChevronDown as BiDown,
} from "react-icons/bi";
import {
  FaCrown, FaFire, FaStar, FaMedal,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiActivity, FiUsers, FiZap,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import CountryFlag from "@/components/ui/CountryFlag";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

const hackerImg = "/hacker.png";

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

const XP_PER_LEVEL = 100;

/* rank tier styling */
const tierFor = (rank) => {
  if (rank === 1) return { label: "S", color: "#FFD700", glow: "rgba(255,215,0,0.35)", border: "border-yellow-500/40", bg: "bg-yellow-500/10" };
  if (rank === 2) return { label: "A", color: "#C0C0C0", glow: "rgba(192,192,192,0.25)", border: "border-gray-400/40", bg: "bg-gray-500/10" };
  if (rank === 3) return { label: "B", color: "#CD7F32", glow: "rgba(205,127,50,0.25)", border: "border-amber-600/40", bg: "bg-amber-700/10" };
  if (rank <= 10) return { label: null, color: "#EF4444", glow: null, border: "border-red-900/20", bg: "" };
  if (rank <= 50) return { label: null, color: "#9CA3AF", glow: null, border: "border-white/[0.05]", bg: "" };
  return { label: null, color: "#4B5563", glow: null, border: "border-white/[0.03]", bg: "" };
};

const medalIcon = (rank) => {
  if (rank === 1) return <FaCrown className="text-yellow-400 text-base" />;
  if (rank === 2) return <FaMedal className="text-gray-300 text-base" />;
  if (rank === 3) return <FaMedal className="text-amber-600 text-base" />;
  return null;
};

export default function CompetePage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [leaderboard, setLeaderboard] = useState([]);
  const [profilePic,  setProfilePic]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [userStats, setUserStats] = useState({ rank: 0, points: 0, level: 1, streak: 0 });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/auth/me`, { credentials: "include" });
        if (r.ok) { const d = await r.json(); setProfilePic(d.user?.profile_pic || null); }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [sRes, stRes] = await Promise.allSettled([
          fetch(`${API}/api/practice/stats`, { credentials: "include" }),
          fetch(`${API}/api/streak/user-streak/${user.id}`),
        ]);
        let pts = 0, rank = 0, level = 1, streak = 0;
        if (sRes.status === "fulfilled") {
          const d = await sRes.value.json();
          if (d.success) { pts = d.data.overview.total_points_earned || 0; rank = d.data.overview.rank || 0; level = Math.floor(pts / XP_PER_LEVEL) + 1; }
        }
        if (stRes.status === "fulfilled") {
          const d = await stRes.value.json();
          streak = d.streak?.current_streak || 0;
        }
        setUserStats({ rank, points: pts, level, streak });
      } catch {}
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API}/api/practice/leaderboard`);
        const d = await r.json();
        if (d.success) {
          setLeaderboard(d.data.map(u => ({ ...u, level: Math.floor((u.total_points || 0) / XP_PER_LEVEL) + 1 })));
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    logout(); router.push("/login");
  };

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  const top3      = leaderboard.slice(0, 3);
  const restList  = leaderboard.slice(3);
  const xpInLevel = userStats.points % XP_PER_LEVEL;
  const isRanked  = userStats.points > 0;

  /* find current user in leaderboard */
  const myRow = leaderboard.find(u => u.id === user?.id || u.username === user?.username);

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

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
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

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
                <span className="text-[10px] text-gray-600">{userStats.points} XP</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span>{xpInLevel} / {XP_PER_LEVEL} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(2, (xpInLevel / XP_PER_LEVEL) * 100)}%` }} />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${active ? "bg-red-600/12 text-red-400 border border-red-600/18" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"}`}>
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
            <p className="text-sm font-semibold text-white leading-none">Global Rankings</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">
              {leaderboard.length} players competing worldwide
            </p>
          </div>
          {/* live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)] animate-pulse" />
            Live
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-orange-600/20 rounded-lg">
            <FaFire className="text-orange-400 text-sm" />
            <span className="text-sm font-bold text-white">{userStats.streak}</span>
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
              <FiChevronDown className={`text-[11px] text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
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
        <main className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── YOUR RANK CARD ── */}
          <div className="relative overflow-hidden rounded-xl border border-red-900/30 bg-[#0F0F0F] p-5">
            {/* background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-red-600/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* avatar + name */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profilePic || hackerImg}
                    alt={user?.username}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-red-600/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-red-600 border border-[#0F0F0F] flex items-center justify-center text-[9px] font-bold text-white">
                    {userStats.level}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-0.5">YOUR POSITION</p>
                  <p className="text-base font-bold text-white">{user?.username || "Hacker"}</p>
                  <div className="mt-1 h-1 w-24 bg-[#1C1C1C] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.max(2, (xpInLevel / XP_PER_LEVEL) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* rank number — hero element */}
              <div className="sm:ml-8 flex-shrink-0">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-0.5">Global Rank</p>
                <p className="text-5xl font-black leading-none" style={{ color: isRanked ? "#EF4444" : "#374151" }}>
                  {isRanked ? `#${userStats.rank}` : "—"}
                </p>
              </div>

              {/* divider */}
              <div className="hidden sm:block w-px h-16 bg-white/[0.06] mx-4 flex-shrink-0" />

              {/* stat chips */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1">
                {[
                  { label: "Points",  value: userStats.points,  color: "#EF4444" },
                  { label: "Level",   value: userStats.level,   color: "#F97316" },
                  { label: "Streak",  value: `${userStats.streak}d`, color: "#FBBF24" },
                ].map((s, i) => (
                  <div key={i} className="flex-1 min-w-[70px] bg-[#141414] border border-white/[0.05] rounded-lg px-3 py-2.5 text-center">
                    <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* cta */}
              <Link href="/practice"
                className="flex-shrink-0 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-[0_0_16px_rgba(239,68,68,0.2)] hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                Keep Climbing →
              </Link>
            </div>
          </div>

          {/* ── TOP 3 CHAMPION STRIP ── */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[top3[1], top3[0], top3[2]].filter(Boolean).map((u, visualIdx) => {
                /* map visual order back to actual rank */
                const actualRank = u.user_rank;
                const isFirst    = actualRank === 1;
                const colors     = {
                  1: { border: "border-yellow-500/30", glow: "rgba(234,179,8,0.12)", label: "#FBBF24", crown: true },
                  2: { border: "border-gray-500/25",   glow: "rgba(156,163,175,0.08)", label: "#9CA3AF", crown: false },
                  3: { border: "border-amber-700/30",  glow: "rgba(180,83,9,0.1)",    label: "#D97706", crown: false },
                }[actualRank];

                return (
                  <div
                    key={u.user_rank}
                    onClick={() => router.push(`/profile/${u.username}`)}
                    className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border ${colors.border} bg-[#0F0F0F] cursor-pointer hover:bg-[#141414] transition-all duration-200 ${isFirst ? "ring-1 ring-yellow-500/20 order-first sm:order-none" : ""}`}
                    style={{ boxShadow: `0 0 32px ${colors.glow}` }}
                  >
                    {/* rank badge */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black"
                      style={{ background: `${colors.label}18`, color: colors.label, border: `1px solid ${colors.label}30` }}>
                      #{actualRank}
                    </div>

                    {colors.crown && (
                      <FaCrown className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400 text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    )}

                    <div className="relative">
                      <img src={u.profile_pic || (user?.id === u.id && profilePic) || hackerImg}
                        alt={u.username}
                        className="w-16 h-16 rounded-xl object-cover"
                        style={{ border: `2px solid ${colors.label}40` }}
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-white"
                        style={{ background: colors.label }}>
                        {u.level}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-bold text-white hover:text-red-400 transition-colors">{u.username}</p>
                      {u.country && (
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <CountryFlag country={u.country} size="12px" height="8px" />
                          <span className="text-[10px] text-gray-600">{u.country}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full h-px bg-white/[0.05]" />

                    <div className="w-full flex items-center justify-between">
                      <p className="text-lg font-black" style={{ color: colors.label }}>{u.total_points}</p>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-orange-400">
                          <FaFire className="text-[9px]" /> {u.current_streak}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                          <FaStar className="text-[9px]" /> {u.badges}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 self-start -mt-2">points earned</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FULL LEADERBOARD ── */}
          <div className="bg-[#0F0F0F] border border-white/[0.05] rounded-xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div>
                <h2 className="text-sm font-semibold text-white">All Rankings</h2>
                <p className="text-[11px] text-gray-600 mt-0.5">{leaderboard.length} total participants</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <FiUsers className="text-sm" />
                <span>{leaderboard.length} players</span>
              </div>
            </div>

            {/* column headers */}
            <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem_6rem] gap-0 px-5 py-2.5 border-b border-white/[0.04] bg-[#0A0A0A]">
              {["#", "Player", "Level", "Streak", "Badges", "Points"].map((h, i) => (
                <p key={h} className={`text-[10px] font-semibold text-gray-600 uppercase tracking-wider ${i > 1 ? "text-center" : ""} ${i === 5 ? "text-right" : ""}`}>
                  {h}
                </p>
              ))}
            </div>

            {/* loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-7 h-7 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-3" />
                <p className="text-xs text-gray-600">Loading rankings...</p>
              </div>
            )}

            {/* rows */}
            {!loading && (
              <div className="divide-y divide-white/[0.03]">
                {leaderboard.map((u) => {
                  const tier     = tierFor(u.user_rank);
                  const isMe     = u.id === user?.id || u.username === user?.username;
                  const rankIcon = medalIcon(u.user_rank);

                  return (
                    <div
                      key={u.user_rank}
                      onClick={() => router.push(`/profile/${u.username}`)}
                      className={`grid grid-cols-[3rem_1fr_5rem_5rem_5rem_6rem] gap-0 px-5 py-3.5 items-center cursor-pointer transition-all duration-150
                        ${isMe
                          ? "bg-red-600/8 border-l-2 border-red-500 hover:bg-red-600/12"
                          : "hover:bg-white/[0.025] border-l-2 border-transparent"
                        }`}
                    >
                      {/* rank */}
                      <div className="flex items-center gap-1.5">
                        {rankIcon ? (
                          rankIcon
                        ) : (
                          <span className="text-xs font-semibold" style={{ color: tier.color }}>
                            {u.user_rank}
                          </span>
                        )}
                      </div>

                      {/* player */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.profile_pic || (isMe && profilePic) || hackerImg}
                          alt={u.username}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          style={{ border: `1px solid ${tier.color}30` }}
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isMe ? "text-red-400" : "text-gray-200"}`}>
                            {u.username}
                            {isMe && <span className="ml-2 text-[9px] font-medium bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded border border-red-600/20 align-middle">YOU</span>}
                          </p>
                          {u.country && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <CountryFlag country={u.country} size="10px" height="7px" />
                              <span className="text-[10px] text-gray-600 truncate">{u.country}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* level */}
                      <div className="text-center">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 rounded">
                          {u.level}
                        </span>
                      </div>

                      {/* streak */}
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-[11px] text-orange-400">
                          <FaFire className="text-[9px]" /> {u.current_streak}
                        </span>
                      </div>

                      {/* badges */}
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-[11px] text-yellow-400">
                          <FaStar className="text-[9px]" /> {u.badges}
                        </span>
                      </div>

                      {/* points */}
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: u.user_rank <= 3 ? tier.color : u.user_rank <= 10 ? "#EF4444" : "#9CA3AF" }}>
                          {u.total_points}
                        </p>
                        <p className="text-[9px] text-gray-700">pts</p>
                      </div>
                    </div>
                  );
                })}

                {leaderboard.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BiTrophy className="text-4xl text-gray-700 mb-3" />
                    <p className="text-sm text-gray-500">No rankings yet</p>
                    <p className="text-xs text-gray-700 mt-1">Complete practice scenarios to appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── CTA ── */}
          <div className="relative overflow-hidden bg-[#0F0F0F] border border-red-900/25 rounded-xl p-6">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-1">Climb the Ranks</h3>
                <p className="text-xs text-gray-500">
                  Every scenario you complete earns XP — keep going to crack the top 10.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href="/practice"
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  Start Practicing
                </Link>
                <Link href="/roadmap"
                  className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#222] text-gray-300 text-xs font-semibold rounded-lg border border-white/[0.07] hover:border-white/[0.12] transition-colors">
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
