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
  FiShield, FiMenu, FiX, FiSliders,
} from "react-icons/fi";
import {
  FaFire, FaEye, FaArrowRight,
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

const BLOG_CATEGORIES = [
  { name: "All",               value: "all"               },
  { name: "Beginner",          value: "beginner"          },
  { name: "Advanced",          value: "advanced"          },
  { name: "Development",       value: "development"       },
  { name: "AI & ML",           value: "ai-ml"             },
  { name: "Incident Response", value: "incident-response" },
  { name: "Cloud Security",    value: "cloud-security"    },
];

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
function Topbar({ onMenuClick, user, streak, search, onSearchChange }) {
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

      <h1 className="text-white font-semibold text-base flex-shrink-0">Blog</h1>

      {/* Inline search */}
      <div className="flex-1 max-w-sm relative">
        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#111] border border-red-900/15 text-gray-300 placeholder-gray-600 text-sm pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600/40"
        />
      </div>

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function CategoryBadge({ category }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/12 text-red-400 border border-red-500/20 font-medium">
      {category}
    </span>
  );
}

// ─── Featured hero card ───────────────────────────────────────────────────────
function FeaturedCard({ blog }) {
  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <article className="bg-[#0E0E0E] border border-red-600/25 rounded-2xl p-7 hover:border-red-500/40 transition-all duration-300 relative overflow-hidden">
        {/* red left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-600/60 rounded-l-2xl" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-600/15 text-red-400 border border-red-600/25 font-semibold uppercase tracking-wider">
                Featured
              </span>
              <CategoryBadge category={blog.category} />
              {blog.read_time && (
                <span className="text-gray-500 text-xs">{blog.read_time}</span>
              )}
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-red-300 transition-colors mb-3 line-clamp-2">
              {blog.title}
            </h2>

            {blog.excerpt && (
              <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                {blog.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {blog.author_avatar ? (
                  <img
                    src={blog.author_avatar}
                    alt={blog.author}
                    className="w-8 h-8 rounded-full border border-red-600/30"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center">
                    <span className="text-red-400 text-xs font-semibold">
                      {blog.author?.[0]?.toUpperCase() || "A"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{blog.author}</p>
                  <p className="text-gray-500 text-xs">{formatDate(blog.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {blog.views != null && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FaEye size={11} /> {blog.views}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-red-400 font-medium group-hover:gap-2.5 transition-all">
                  Read Now <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>

          {/* Tags column */}
          {blog.tags && (
            <div className="lg:w-52 flex-shrink-0">
              <div className="bg-[#111] border border-red-900/15 rounded-xl p-4 h-full">
                <p className="text-gray-600 text-xs uppercase tracking-wider mb-3">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.split(",").map((tag) => (
                    <span key={tag.trim()} className="text-xs px-2 py-0.5 bg-[#1A1A1A] border border-white/8 text-gray-400 rounded">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Regular blog card ────────────────────────────────────────────────────────
function BlogCard({ blog }) {
  return (
    <Link href={`/blog/${blog.id}`} className="block group">
      <article className="h-full bg-[#0E0E0E] border border-red-900/15 rounded-xl p-5 flex flex-col gap-3 hover:border-red-700/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.06)] transition-all duration-200">
        {/* Top meta */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={blog.category} />
          {blog.read_time && (
            <span className="text-gray-500 text-xs flex-shrink-0">{blog.read_time}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-snug group-hover:text-red-300 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Author + date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {blog.author_avatar ? (
            <img
              src={blog.author_avatar}
              alt={blog.author}
              className="w-5 h-5 rounded-full border border-red-900/20"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : null}
          <span>{blog.author}</span>
          <span>·</span>
          <span>{formatDate(blog.date)}</span>
        </div>

        {/* Tags */}
        {blog.tags && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.split(",").slice(0, 3).map((tag) => (
              <span key={tag.trim()} className="text-xs px-1.5 py-0.5 bg-[#1A1A1A] text-gray-500 rounded">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Read link */}
        <div className="mt-auto pt-1">
          <span className="flex items-center gap-1.5 text-xs text-red-400/80 group-hover:text-red-400 font-medium transition-colors group-hover:gap-2 transition-all">
            Read Article <FaArrowRight size={9} />
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy,           setSortBy]           = useState("date");
  const [isLoading,        setIsLoading]        = useState(true);
  const [blogs,            setBlogs]            = useState([]);

  const handleLogout = async () => {
    await logout?.();
    router.push("/login");
  };

  // ── Fetch blogs ────────────────────────────────────────────────────────────
  const fetchBlogs = async () => {
    try {
      const res  = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555") + "/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Simulate loading on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortBy]);

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.author.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      blog.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date":     return new Date(b.date) - new Date(a.date);
      case "views":    return b.views - a.views;
      case "readTime": return parseInt(a.read_time) - parseInt(b.read_time);
      default:         return 0;
    }
  });

  const featured = sorted.find((blog) => blog.featured);
  const latest   = sorted.filter((blog) => !blog.featured).slice(0, 3);
  const others   = sorted.filter((blog) => !blog.featured).slice(3);

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
          streak={user?.streakDays || 0}
          search={search}
          onSearchChange={setSearch}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map(({ name, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedCategory(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedCategory === value
                      ? "bg-red-600/15 text-red-400 border-red-600/30"
                      : "bg-transparent text-gray-400 border-red-900/15 hover:text-gray-200 hover:border-red-900/30"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FiSliders size={14} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0C0C0C] border border-red-900/15 text-gray-300 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-600/40"
              >
                <option value="date"     className="bg-[#111]">Newest First</option>
                <option value="views"    className="bg-[#111]">Most Views</option>
                <option value="readTime" className="bg-[#111]">Read Time</option>
              </select>
            </div>
          </div>

          {/* Loading spinner */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <>
              {/* Featured hero */}
              {featured && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-0.5 bg-red-600 rounded" />
                    <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Featured Article</h2>
                  </div>
                  <FeaturedCard blog={featured} />
                </section>
              )}

              {/* Latest 3 */}
              {latest.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-0.5 bg-red-900/60 rounded" />
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Latest</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latest.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                </section>
              )}

              {/* All other articles */}
              {others.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-0.5 bg-red-900/60 rounded" />
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">More Articles</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {others.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BiSearch className="text-5xl text-gray-700 mb-4" />
                  <p className="text-gray-400 font-medium">No articles found</p>
                  <p className="text-gray-600 text-sm mt-1">Try adjusting your search or category filter</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
