"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BiBrain, BiLaptop, BiMedal, BiHomeAlt, BiMap, BiBookOpen,
  BiWrench, BiNews, BiCode, BiMicrophone, BiTrophy, BiFilter,
  BiSearch, BiTargetLock,
} from "react-icons/bi";
import {
  FaStar, FaClock, FaUser, FaEye, FaDownload,
  FaLightbulb, FaFire, FaServer,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiSliders,
} from "react-icons/fi";
import axios from "axios";
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

const XP_PER_LEVEL = 100;

const HOMELAB_KEYWORDS = [
  "homelab", "home lab", "lab setup", "virtual lab", "pentesting lab",
  "security lab", "testing environment", "vulnerable", "practice lab",
  "malware lab", "ad lab", "active directory", "cloud lab", "iot lab",
  "mobile lab", "network lab", "web lab", "forensics lab",
];

const GUIDE_KEYWORDS = [
  "guide", "how to", "tutorial", "tips", "best practices",
  "setup", "installation", "configuration", "troubleshooting",
  "beginner", "advanced", "fundamentals", "strategy", "planning",
];

export default function LabsPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [labs,             setLabs]             = useState([]);
  const [guides,           setGuides]           = useState([]);
  const [loadingLabs,      setLoadingLabs]      = useState(true);
  const [loadingGuides,    setLoadingGuides]    = useState(true);
  const [error,            setError]            = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery,      setSearchQuery]      = useState("");
  const [sortBy,           setSortBy]           = useState("featured");
  const [viewMode,         setViewMode]         = useState("grid");

  const [userStats, setUserStats] = useState({ totalPoints: 0, currentStreak: 0, level: 1 });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API}/api/blogs`);
        const all = res.data;

        const homelabBlogs = all
          .filter((b) => {
            const t = b.title.toLowerCase();
            const c = (b.content || "").toLowerCase();
            const cat = (b.category || "").toLowerCase();
            return HOMELAB_KEYWORDS.some((k) => t.includes(k) || cat.includes(k) || c.includes(k));
          })
          .map((b, i) => ({
            id: b.id || i + 1,
            title: b.title,
            excerpt: b.excerpt || (b.content ? b.content.substring(0, 150) + "..." : ""),
            category: b.category || "general",
            author: b.author || "Anonymous",
            date: b.date,
            setupTime: b.read_time || "2-3 hours",
            tags: b.tags ? b.tags.split(",").map((t) => t.trim()) : ["VirtualBox", "Kali Linux"],
            featured: b.featured || false,
            views: b.views || 0,
            rating: 4.5,
            difficulty: "Beginner",
            downloads: b.views || Math.floor(Math.random() * 500) + 50,
            requirements: "8GB RAM, 50GB Storage",
          }));

        setLabs(homelabBlogs);
        setLoadingLabs(false);

        const guideBlogs = all
          .filter((b) => {
            const t = b.title.toLowerCase();
            const c = (b.content || "").toLowerCase();
            const cat = (b.category || "").toLowerCase();
            if (["homelab", "home lab", "lab setup"].some((k) => t.includes(k))) return false;
            return GUIDE_KEYWORDS.some((k) => t.includes(k) || cat.includes(k) || c.includes(k));
          })
          .map((b, i) => ({
            id: b.id || i + 1,
            title: b.title,
            excerpt: b.excerpt || (b.content ? b.content.substring(0, 120) + "..." : ""),
            author: b.author || "Anonymous",
            readTime: b.read_time || "8 min read",
            category: b.category || "Guide",
            link: `/blog/${b.id}`,
          }))
          .slice(0, 3);

        setGuides(guideBlogs);
        setLoadingGuides(false);
      } catch (err) {
        setError("Failed to load labs. Please try again.");
        setLoadingLabs(false);
        setLoadingGuides(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    Promise.allSettled([
      fetch(`${API}/api/practice/stats`, { credentials: "include" }),
      fetch(`${API}/api/streak/user-streak/${user.id}`),
    ]).then(async ([statsRes, streakRes]) => {
      if (statsRes.status === "fulfilled") {
        const d = await statsRes.value.json();
        if (d.success) {
          const pts = d.data.overview?.total_points_earned || 0;
          setUserStats((p) => ({ ...p, totalPoints: pts, level: Math.floor(pts / XP_PER_LEVEL) + 1 }));
        }
      }
      if (streakRes.status === "fulfilled") {
        const d = await streakRes.value.json();
        if (d.streak) setUserStats((p) => ({ ...p, currentStreak: d.streak.current_streak || 0 }));
      }
    });
  }, [user]);

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

  const categories = [
    { id: "all", name: "All Labs", count: labs.length },
    ...Array.from(new Set(labs.map((l) => l.category))).map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: labs.filter((l) => l.category === cat).length,
    })),
  ];

  const filteredLabs = labs
    .filter((lab) => {
      const matchCat = selectedCategory === "all" || lab.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      return matchCat && (
        lab.title.toLowerCase().includes(q) ||
        (lab.excerpt || "").toLowerCase().includes(q) ||
        lab.author.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "featured")  return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === "rating")    return b.rating - a.rating;
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "newest")    return b.id - a.id;
      if (sortBy === "title")     return a.title.localeCompare(b.title);
      return 0;
    });

  const xpInLevel  = userStats.totalPoints % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {/* Mobile overlay */}
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
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-red-900/15 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)]">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-white font-bold tracking-tight">CyberCrux</span>
          <button className="ml-auto p-1 rounded text-gray-600 hover:text-white lg:hidden transition-colors" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* User card */}
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
              <span>{xpInLevel} / {XP_PER_LEVEL} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(2, xpProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5 scrollbar-hide">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
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

        {/* Bottom */}
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

        {/* Topbar */}
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Home Lab Setups</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">
              {labs.length} lab setups · build your own environment
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
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
            >
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
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-600/10 transition-colors">
                  <FiLogOut className="text-sm" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto flex flex-col lg:flex-row">

          {/* ── Category Sidebar ── */}
          <aside className="w-full lg:w-56 xl:w-60 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.05] bg-[#0A0A0A]">
            <div className="p-4">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BiFilter className="text-sm" /> Categories
              </p>
              <div className="space-y-0.5 flex flex-row lg:flex-col gap-1 lg:gap-0 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 whitespace-nowrap flex-shrink-0
                      ${selectedCategory === cat.id
                        ? "bg-red-600/15 text-red-400 border border-red-600/20"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
                      }`}
                  >
                    <BiLaptop className={`text-base ${selectedCategory === cat.id ? "text-red-400" : "text-gray-600"}`} />
                    <span className="flex-1 truncate">{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-auto
                      ${selectedCategory === cat.id ? "bg-red-600/20 text-red-400" : "bg-white/5 text-gray-600"}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Labs Area ── */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* Search + Sort + View */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-base pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search labs by title, excerpt, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0F0F0F] border border-white/[0.07] hover:border-white/[0.12] focus:border-red-600/40 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 bg-[#0F0F0F] border border-white/[0.07] hover:border-white/[0.12] rounded-lg text-sm text-gray-300 outline-none cursor-pointer transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Highest Rated</option>
                    <option value="downloads">Most Viewed</option>
                    <option value="newest">Newest</option>
                    <option value="title">A–Z</option>
                  </select>
                  <FiSliders className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none" />
                </div>
                <div className="flex bg-[#0F0F0F] border border-white/[0.07] rounded-lg p-0.5">
                  {["grid", "list"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all capitalize
                        ${viewMode === mode ? "bg-red-600/20 text-red-400" : "text-gray-600 hover:text-gray-300"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result count + clear */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">
                <span className="text-white font-semibold">{filteredLabs.length}</span> lab{filteredLabs.length !== 1 ? "s" : ""} found
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear filters ×
                </button>
              )}
            </div>

            {/* Loading */}
            {loadingLabs && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-600">Loading labs...</p>
              </div>
            )}

            {/* Error */}
            {error && !loadingLabs && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4">
                  <BiTargetLock className="text-red-400 text-xl" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">Failed to load labs</p>
                <p className="text-xs text-gray-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Retry
                </button>
              </div>
            )}

            {/* Grid View */}
            {!loadingLabs && !error && viewMode === "grid" && filteredLabs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="group flex flex-col bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/40 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.07)]"
                  >
                    <div className={`h-0.5 w-full ${
                      lab.difficulty === "Advanced"     ? "bg-gradient-to-r from-red-700 to-red-500" :
                      lab.difficulty === "Intermediate" ? "bg-gradient-to-r from-yellow-700 to-yellow-500" :
                                                          "bg-gradient-to-r from-green-700 to-green-500"
                    }`} />

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/15 flex items-center justify-center">
                          <FaServer className="text-red-400 text-sm" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {lab.featured && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded font-medium">
                              Featured
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <FaStar className="text-yellow-400 text-[9px]" />
                            {lab.rating}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white mb-2 line-clamp-2 leading-snug transition-colors">
                        {lab.title}
                      </h3>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-gray-500 rounded">
                          {lab.difficulty}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] text-gray-500 rounded">
                          {lab.setupTime}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed mb-4">
                        {lab.excerpt || "No description available."}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <FaUser className="text-[9px]" /> {lab.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye className="text-[9px]" /> {lab.views.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-[#0C0C0C] border-t border-white/[0.04]">
                      <Link
                        href={`/labs/${lab.id}`}
                        className="block w-full py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-[11px] font-semibold text-white text-center transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                      >
                        View Lab
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {!loadingLabs && !error && viewMode === "list" && filteredLabs.length > 0 && (
              <div className="space-y-3">
                {filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="group bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/40 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.07)]"
                  >
                    <div className={`h-0.5 w-full ${
                      lab.difficulty === "Advanced"     ? "bg-gradient-to-r from-red-700 to-red-500" :
                      lab.difficulty === "Intermediate" ? "bg-gradient-to-r from-yellow-700 to-yellow-500" :
                                                          "bg-gradient-to-r from-green-700 to-green-500"
                    }`} />
                    <div className="p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-600/15 flex items-center justify-center flex-shrink-0">
                        <FaServer className="text-red-400 text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{lab.title}</h3>
                          {lab.featured && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded font-medium">
                              Featured
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 ml-auto">
                            <FaStar className="text-yellow-400 text-[9px]" /> {lab.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{lab.excerpt || "No description available."}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-600 mb-3">
                          <span className="flex items-center gap-1"><FaUser className="text-[9px]" />{lab.author}</span>
                          <span className="flex items-center gap-1"><FaClock className="text-[9px]" />{lab.setupTime}</span>
                          <span className="flex items-center gap-1"><FaEye className="text-[9px]" />{lab.views.toLocaleString()} views</span>
                          <span className="flex items-center gap-1"><FaDownload className="text-[9px]" />{lab.requirements}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {lab.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-[10px] text-gray-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/labs/${lab.id}`}
                          className="inline-flex items-center px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-[11px] font-semibold text-white transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                        >
                          View Lab
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loadingLabs && !error && filteredLabs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center mb-4">
                  <BiLaptop className="text-gray-600 text-2xl" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">No labs found</p>
                <p className="text-xs text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="px-4 py-2 bg-red-600/10 border border-red-600/20 text-red-400 text-xs font-semibold rounded-lg transition-colors hover:bg-red-600/20"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* ── Guides Section ── */}
            {!loadingGuides && guides.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4">
                  <FaLightbulb className="text-yellow-400 text-sm" />
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Guides &amp; Resources</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guides.map((guide) => (
                    <Link
                      key={guide.id}
                      href={guide.link}
                      className="group bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/40 rounded-xl p-5 transition-all duration-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.07)]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded font-medium">
                          {guide.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white mb-2 line-clamp-2 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{guide.excerpt}</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-600">
                        <span>{guide.author}</span>
                        <span className="flex items-center gap-1"><FaClock className="text-[9px]" />{guide.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA ── */}
            <div className="mt-10 bg-[#0F0F0F] border border-red-900/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-1">Have a cool lab setup to share?</p>
                <p className="text-xs text-gray-500">Submit your home lab and help the community grow.</p>
              </div>
              <button className="flex-shrink-0 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]">
                Submit Your Lab
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
