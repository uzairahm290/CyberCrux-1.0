"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiHomeAlt, BiBrain, BiTrophy, BiMicrophone, BiMap, BiLaptop,
  BiBookOpen, BiWrench, BiCode, BiNews, BiMedal, BiSearch, BiStar,
} from "react-icons/bi";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX,
} from "react-icons/fi";
import {
  FaFire, FaEye, FaStar,
  FaMedal, FaTrophy, FaBrain, FaShieldAlt, FaCode, FaRocket,
  FaCrown, FaGem, FaCheckCircle, FaClock, FaTimes, FaLock,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Dashboard",      href: "/dashboard",  Icon: BiHomeAlt    },
  { label: "Practice",       href: "/practice",   Icon: BiBrain      },
  { label: "Compete",        href: "/compete",    Icon: BiTrophy     },
  { label: "Mock Interview", href: "/interviews", Icon: BiMicrophone },
  { label: "Roadmaps",       href: "/roadmap",    Icon: BiMap        },
  { label: "Labs",           href: "/labs",       Icon: BiLaptop     },
  { label: "Books",          href: "/books",      Icon: BiBookOpen   },
  { label: "Tools",          href: "/tools",      Icon: BiWrench     },
  { label: "Projects",       href: "/projects",   Icon: BiCode       },
  { label: "Blog",           href: "/blog",       Icon: BiNews       },
  { label: "Badges",         href: "/badges",     Icon: BiMedal      },
];

// ─── Badge helpers ────────────────────────────────────────────────────────────
function getBadgeTypeIcon(badgeType) {
  const icons = {
    streak:      FaFire,
    category:    FaShieldAlt,
    scenario:    FaCode,
    points:      FaStar,
    special:     FaCrown,
    time_based:  FaClock,
    achievement: FaTrophy,
    milestone:   FaGem,
    skill:       FaBrain,
    challenge:   FaRocket,
  };
  return icons[badgeType] || FaMedal;
}

function getBadgeTypeLabel(badgeType) {
  const labels = {
    streak:      "Streak",
    category:    "Category",
    scenario:    "Scenario",
    points:      "Points",
    special:     "Special",
    time_based:  "Time-Based",
    achievement: "Achievement",
    milestone:   "Milestone",
    skill:       "Skill",
    challenge:   "Challenge",
  };
  if (labels[badgeType]) return labels[badgeType];
  if (!badgeType) return "General";
  return badgeType.charAt(0).toUpperCase() + badgeType.slice(1).replace(/_/g, " ");
}

function getRarityLabel(rarity) {
  const map = { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary" };
  return map[rarity] || "Common";
}

// glow ring style by rarity (for earned badges)
function getRarityRingClass(rarity) {
  switch (rarity) {
    case "legendary": return "ring-2 ring-yellow-400/60 shadow-[0_0_18px_rgba(250,204,21,0.25)]";
    case "epic":      return "ring-2 ring-purple-400/60 shadow-[0_0_18px_rgba(167,139,250,0.25)]";
    case "rare":      return "ring-2 ring-blue-400/60 shadow-[0_0_14px_rgba(96,165,250,0.2)]";
    default:          return "ring-1 ring-gray-500/40";
  }
}

function getRarityBadgeClass(rarity) {
  switch (rarity) {
    case "legendary": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "epic":      return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "rare":      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    default:          return "bg-gray-500/15 text-gray-400 border-gray-500/25";
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose, user, onLogout }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-60 bg-[#0C0C0C] border-r border-red-900/20
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-red-900/20">
          <FiShield className="text-red-500 text-xl flex-shrink-0" />
          <span className="font-bold text-white text-lg tracking-wide">CyberCrux</span>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-red-900/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 font-semibold text-sm">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.username || "User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email || "member"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${active
                    ? "bg-red-600/12 text-red-400 border border-red-600/18"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <Icon className="text-base flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-3 border-t border-red-900/20 space-y-0.5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
          >
            <FiSettings className="text-base" />
            <span>Settings</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-600/8 transition-all"
          >
            <FiLogOut className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ onMenuClick, user, streak }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);
  const router  = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout?.();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-[#0A0A0A] border-b border-red-900/15 flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
      >
        <FiMenu size={20} />
      </button>

      <h1 className="text-white font-semibold text-base">Badges</h1>
      <div className="flex-1" />

      {streak > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <FaFire className="text-orange-400 text-xs" />
          <span className="text-orange-300 text-xs font-semibold">{streak}d</span>
        </div>
      )}

      <button className="relative text-gray-400 hover:text-white transition-colors p-2">
        <FiBell size={18} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
      </button>

      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center">
            <span className="text-red-400 font-semibold text-xs">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <FiChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-[#111] border border-red-900/20 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-2.5 border-b border-red-900/10">
              <p className="text-white text-sm font-medium truncate">{user?.username || "User"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
            <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              <FiUser size={14} /> Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              <FiSettings size={14} /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-600/8 transition-all"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Badge card ───────────────────────────────────────────────────────────────
function BadgeCard({ badge, earned, onClick }) {
  const IconComponent = getBadgeTypeIcon(badge.badge_type);

  return (
    <div
      className={`
        group relative cursor-pointer rounded-xl p-4 flex flex-col items-center gap-3
        bg-[#0E0E0E] border transition-all duration-200
        ${earned
          ? "border-red-900/20 hover:border-red-700/30"
          : "border-red-900/10 opacity-45 hover:opacity-60"
        }
      `}
      onClick={() => onClick(badge)}
    >
      {/* Icon circle */}
      <div
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          ${earned ? getRarityRingClass(badge.rarity) : "ring-1 ring-gray-700/40"}
          ${earned ? "" : "grayscale"}
          bg-[#141414] transition-all duration-200 group-hover:scale-105
        `}
      >
        {badge.icon ? (
          <img
            src={badge.icon}
            alt={badge.name}
            className="w-10 h-10 object-contain rounded-full"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
          />
        ) : null}
        <IconComponent
          className="text-2xl text-white"
          style={{ display: badge.icon ? "none" : "block" }}
        />

        {/* Overlay: check or lock */}
        {earned ? (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <FaCheckCircle className="text-white text-xs" />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1A1A1A] border border-gray-700 rounded-full flex items-center justify-center">
            <FaLock className="text-gray-500 text-xs" />
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-white text-xs font-semibold text-center line-clamp-2 leading-tight">
        {badge.name}
      </p>

      {/* Rarity chip */}
      <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${getRarityBadgeClass(badge.rarity)}`}>
        {getRarityLabel(badge.rarity)}
      </span>
    </div>
  );
}

// ─── Badge detail modal ───────────────────────────────────────────────────────
function BadgeModal({ badge, earned, earnedData, onClose }) {
  const IconComponent = getBadgeTypeIcon(badge.badge_type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0E0E0E] border border-red-900/20 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg truncate pr-4">{badge.name}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all flex-shrink-0"
          >
            <FaTimes className="text-gray-400 hover:text-white text-xs" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className={`relative w-24 h-24 rounded-full bg-[#141414] flex items-center justify-center ${earned ? getRarityRingClass(badge.rarity) : "ring-1 ring-gray-700/40 grayscale"}`}>
            {badge.icon ? (
              <img
                src={badge.icon}
                alt={badge.name}
                className="w-16 h-16 object-contain rounded-full"
                onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
              />
            ) : null}
            <IconComponent className="text-4xl text-white" style={{ display: badge.icon ? "none" : "block" }} />

            {earned ? (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <FaCheckCircle className="text-white text-sm" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1A1A1A] border border-gray-700 rounded-full flex items-center justify-center">
                <FaLock className="text-gray-400 text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Status pill */}
        <div className="flex justify-center mb-5">
          {earned ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/15 border border-green-500/25 rounded-full">
              <FaCheckCircle className="text-green-400 text-xs" />
              <span className="text-green-400 text-xs font-semibold">ACHIEVED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-500/10 border border-gray-500/20 rounded-full">
              <FaLock className="text-gray-500 text-xs" />
              <span className="text-gray-500 text-xs font-medium">Locked</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="bg-[#141414] border border-red-900/10 rounded-xl p-4">
            <p className="text-gray-300 text-sm leading-relaxed">{badge.description}</p>
          </div>

          {/* Rarity + type */}
          <div className="flex gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getRarityBadgeClass(badge.rarity)}`}>
              {getRarityLabel(badge.rarity)}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full border border-red-900/20 bg-red-900/10 text-red-400/80 font-medium">
              {getBadgeTypeLabel(badge.badge_type)}
            </span>
          </div>

          {/* Points */}
          <div className="bg-yellow-500/8 border border-yellow-500/15 rounded-xl p-3 text-center">
            <p className="text-yellow-400 font-bold text-xl">+{badge.points_reward}</p>
            <p className="text-yellow-400/60 text-xs">Points Reward</p>
          </div>

          {/* Earned date */}
          {earned && earnedData?.earned_at && (
            <div className="bg-green-500/8 border border-green-500/15 rounded-xl p-3 text-center">
              <p className="text-green-400/70 text-xs mb-1">Earned On</p>
              <p className="text-green-300 text-sm font-medium">
                {new Date(earnedData.earned_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-red-600/15 hover:bg-red-600/25 border border-red-600/25 text-red-400 text-sm font-medium rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BadgesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [allBadges,        setAllBadges]        = useState([]);
  const [userBadges,       setUserBadges]        = useState([]);
  const [userStats,        setUserStats]         = useState({
    totalPoints: 0, scenariosCompleted: 0, streakDays: 0, rank: "Unranked", level: 1,
  });
  const [loading,          setLoading]           = useState(true);
  const [selectedCategory, setSelectedCategory]  = useState("all");
  const [selectedBadge,    setSelectedBadge]     = useState(null);
  const [showModal,        setShowModal]         = useState(false);
  const [sidebarOpen,      setSidebarOpen]       = useState(false);

  const handleLogout = async () => {
    await logout?.();
    router.push("/login");
  };

  // ── Fetch all data ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // All badges
      const badgesRes  = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/badges", { credentials: "include" });
      const badgesData = await badgesRes.json();
      if (badgesData.success) {
        setAllBadges(badgesData.badges);
        console.log("All badges loaded:", badgesData.badges);
      }

      // User badges — multi-attempt
      let userBadgesData = null;

      try {
        const authRes  = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        console.log("Auth response:", authData);

        if (authData.success && authData.user) {
          const ubRes  = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"}/api/badges/user/${authData.user.id}`, { credentials: "include" });
          userBadgesData = await ubRes.json();
          console.log("User badges response (with user ID):", userBadgesData);
        }
      } catch (err) {
        console.log("Error with auth endpoint:", err);
      }

      if (!userBadgesData || !userBadgesData.success) {
        try {
          const ubRes  = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/badges/user/me", { credentials: "include" });
          userBadgesData = await ubRes.json();
          console.log("User badges response (me):", userBadgesData);
        } catch (err) {
          console.log("Error with /me endpoint:", err);
        }
      }

      if (userBadgesData && userBadgesData.success) {
        setUserBadges(userBadgesData.badges);
        console.log("User badges set successfully:", userBadgesData.badges);
      } else {
        console.log("Failed to load user badges:", userBadgesData);
        setUserBadges([]);

      }

      // Stats
      const statsRes  = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/practice/stats", { credentials: "include" });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setUserStats({
          totalPoints:        statsData.data.totalPoints  || 0,
          scenariosCompleted: statsData.data.totalCompleted || 0,
          streakDays:         statsData.data.streakDays   || 0,
          rank:               statsData.data.rank         || "Unranked",
          level:              statsData.data.level        || 1,
        });
      }
    } catch (err) {
      console.error("Error fetching badges data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isBadgeEarned  = (id) => userBadges.some((b) => b.id === id);
  const getUserBadge   = (id) => userBadges.find((b) => b.id === id);

  const openBadgeModal  = (badge) => { setSelectedBadge(badge); setShowModal(true); };
  const closeBadgeModal = ()      => { setShowModal(false); setSelectedBadge(null); };

  // ── Category filter pills derived from data ────────────────────────────────
  const uniqueTypes = ["all", ...new Set(allBadges.map((b) => b.badge_type).filter(Boolean))];

  const filteredBadges = selectedCategory === "all"
    ? allBadges
    : allBadges.filter((b) => b.badge_type === selectedCategory);

  // ── Stats strip ────────────────────────────────────────────────────────────
  const completionPct = allBadges.length > 0
    ? Math.round((userBadges.length / allBadges.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          streak={user?.streakDays || userStats.streakDays || 0}
        />

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Badges", value: allBadges.length,          color: "text-white"       },
                { label: "Earned",       value: userBadges.length,          color: "text-green-400"  },
                { label: "Points",       value: userStats.totalPoints,      color: "text-yellow-400" },
                { label: "Level",        value: `Lv. ${userStats.level}`,   color: "text-red-400"    },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#0C0C0C] border border-red-900/15 rounded-xl px-5 py-4">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* User stats micro row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>Scenarios: <span className="text-gray-300 font-medium">{userStats.scenariosCompleted}</span></span>
              <span>Streak: <span className="text-orange-400 font-medium">{userStats.streakDays}d</span></span>
              <span>Rank: <span className="text-red-400 font-medium">{userStats.rank}</span></span>
              <span>Completion: <span className="text-white font-medium">{completionPct}%</span></span>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2">
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedCategory === type
                      ? "bg-red-600/15 text-red-400 border-red-600/30"
                      : "bg-transparent text-gray-400 border-red-900/15 hover:text-gray-200 hover:border-red-900/30"
                  }`}
                >
                  {type === "all" ? "All" : getBadgeTypeLabel(type)}
                </button>
              ))}
            </div>

            {/* Badge grid */}
            {filteredBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={isBadgeEarned(badge.id)}
                    onClick={openBadgeModal}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FaMedal className="text-4xl text-gray-700 mb-4" />
                <p className="text-gray-400 font-medium">No badges in this category</p>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Badge detail modal */}
      {showModal && selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          earned={isBadgeEarned(selectedBadge.id)}
          earnedData={getUserBadge(selectedBadge.id)}
          onClose={closeBadgeModal}
        />
      )}

      <FloatingChatWidget />
    </div>
  );
}
