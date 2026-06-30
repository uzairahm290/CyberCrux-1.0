"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop,
  BiMedal, BiTrophy, BiNews, BiHomeAlt, BiCode, BiSearch,
  BiChevronRight, BiTime, BiShow,
} from "react-icons/bi";
import {
  FaMap, FaStar, FaClock, FaUser, FaEye, FaLightbulb, FaFire,
} from "react-icons/fa";
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiSliders, FiBookOpen, FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChatWidget from "@/components/chatbot/FloatingChatWidget";

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

/* cycling accent colors for roadmap cards */
const ACCENTS = ["#EF4444", "#F97316", "#FBBF24", "#22C55E", "#3B82F6", "#A78BFA", "#EC4899", "#14B8A6"];

export default function RoadmapPage() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [roadmaps,    setRoadmaps]    = useState([]);
  const [guides,      setGuides]      = useState([]);
  const [categories,  setCategories]  = useState([{ id: "all", name: "All", count: 0 }]);
  const [selCat,      setSelCat]      = useState("all");
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState("featured");
  const [loadingRM,   setLoadingRM]   = useState(true);
  const [loadingG,    setLoadingG]    = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => {
    (async () => {
      try {
        setLoadingRM(true);
        const res = await axios.get(`${API}/api/blogs1`);
        const rm  = res.data
          .filter(b => b.title.toLowerCase().includes("roadmap"))
          .map((b, i) => ({
            id:       b.id || i + 1,
            title:    b.title,
            excerpt:  b.excerpt || "",
            category: b.category || "general",
            author:   b.author || "CyberCrux",
            duration: b.read_time || "2–3 hrs",
            views:    b.views || 0,
            featured: b.featured || false,
            skills:   b.tags ? b.tags.split(",").map(t => t.trim()) : [],
            accent:   ACCENTS[i % ACCENTS.length],
          }));
        setRoadmaps(rm);

        const counts = {};
        rm.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
        setCategories([
          { id: "all", name: "All", count: rm.length },
          ...Object.entries(counts).map(([k, c]) => ({
            id: k, name: k.charAt(0).toUpperCase() + k.slice(1), count: c,
          })),
        ]);
      } catch {}
      finally { setLoadingRM(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingG(true);
        const res = await axios.get(`${API}/api/blogs`);
        const kw  = ["guide","how to","tutorial","tips","career","certification","learning","beginner","fundamentals"];
        setGuides(
          res.data
            .filter(b => !b.title.toLowerCase().includes("roadmap") &&
              kw.some(k => b.title.toLowerCase().includes(k) || (b.category || "").toLowerCase().includes(k)))
            .slice(0, 3)
            .map(b => ({
              id:       b.id,
              title:    b.title,
              excerpt:  b.excerpt || (b.content || "").substring(0, 120) + "…",
              author:   b.author || "CyberCrux",
              readTime: b.read_time || "5 min",
              category: b.category || "Guide",
            }))
        );
      } catch {}
      finally { setLoadingG(false); }
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

  const handleView = async (id) => {
    try { await axios.post(`${API}/api/blogs/${id}/view`); } catch {}
    router.push(`/roadmap/${id}`);
  };

  const displayed = roadmaps
    .filter(r => {
      if (selCat !== "all" && r.category !== selCat) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
          !r.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "featured") return b.featured - a.featured;
      if (sortBy === "views")    return b.views - a.views;
      if (sortBy === "newest")   return b.id - a.id;
      if (sortBy === "title")    return a.title.localeCompare(b.title);
      return 0;
    });

  const featured = displayed.filter(r => r.featured);
  const rest     = displayed.filter(r => !r.featured);

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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/25 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || "Hacker"}</p>
              <p className="text-[10px] text-gray-600">{roadmaps.length} paths available</p>
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
            <p className="text-sm font-semibold text-white leading-none">Learning Paths</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">
              {roadmaps.length} curated cybersecurity roadmaps
            </p>
          </div>
          {/* inline search */}
          <div className="relative hidden md:block w-56">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search paths…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#141414] border border-white/[0.07] hover:border-white/[0.12] focus:border-red-600/40 rounded-lg text-xs text-white placeholder-gray-600 outline-none transition-colors"
            />
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
                  { icon: FiUser, label: "Profile", href: `/profile/${user?.username}` },
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

        <main className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* ── filter row ── */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* category pills */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {categories.map(c => (
                <button key={c.id} onClick={() => setSelCat(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all
                    ${selCat === c.id
                      ? "bg-red-600/15 text-red-400 border-red-600/20"
                      : "bg-[#0F0F0F] text-gray-500 border-white/[0.06] hover:text-gray-300 hover:border-white/[0.10]"
                    }`}>
                  {c.name}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold
                    ${selCat === c.id ? "bg-red-600/20 text-red-400" : "bg-white/5 text-gray-600"}`}>
                    {c.count}
                  </span>
                </button>
              ))}
            </div>

            {/* sort */}
            <div className="relative flex-shrink-0">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-[#0F0F0F] border border-white/[0.07] hover:border-white/[0.12] rounded-lg text-[11px] text-gray-400 outline-none cursor-pointer transition-colors">
                <option value="featured">Featured</option>
                <option value="views">Most Viewed</option>
                <option value="newest">Newest</option>
                <option value="title">A–Z</option>
              </select>
              <FiSliders className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-[10px] pointer-events-none" />
            </div>

            {/* mobile search */}
            <div className="relative md:hidden flex-shrink-0">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none" />
              <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 bg-[#0F0F0F] border border-white/[0.07] rounded-lg text-xs text-white placeholder-gray-600 outline-none w-36" />
            </div>
          </div>

          {/* ── loading ── */}
          {loadingRM && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-7 h-7 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-3" />
              <p className="text-xs text-gray-600">Loading paths…</p>
            </div>
          )}

          {!loadingRM && (
            <>
              {/* ── featured strip ── */}
              {featured.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FaStar className="text-yellow-400 text-[10px]" /> Featured Paths
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featured.map((rm, i) => (
                      <RoadmapCard key={rm.id} rm={rm} idx={i} onView={handleView} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* ── all paths ── */}
              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      All Paths
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rest.map((rm, i) => (
                      <RoadmapCard key={rm.id} rm={rm} idx={featured.length + i} onView={handleView} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── empty ── */}
              {displayed.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center mb-4">
                    <FaMap className="text-2xl text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">No roadmaps found</p>
                  <p className="text-xs text-gray-600 mb-4">Try adjusting your filters</p>
                  <button onClick={() => { setSearch(""); setSelCat("all"); }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                    Clear Filters
                  </button>
                </div>
              )}

              {/* ── guides strip ── */}
              {!loadingG && guides.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FaLightbulb className="text-yellow-400 text-[10px]" /> Guides & Resources
                    </p>
                    <Link href="/blog" className="text-[11px] text-red-400 hover:text-red-300 transition-colors">
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {guides.map((g, i) => (
                      <Link key={i} href={`/blog/${g.id}`}
                        className="group flex flex-col gap-3 p-4 bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/30 rounded-xl transition-all">
                        <div className="flex items-center gap-2">
                          <FiBookOpen className="text-sm text-yellow-400 flex-shrink-0" />
                          <span className="text-[10px] text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded capitalize">{g.category}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-300 group-hover:text-white leading-snug line-clamp-2 transition-colors">{g.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-auto">
                          <span>{g.author}</span>
                          <span className="flex items-center gap-1"><FaClock className="text-[9px]" />{g.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ── CTA ── */}
              <div className="relative overflow-hidden bg-[#0F0F0F] border border-red-900/25 rounded-xl p-6">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1">Need a custom roadmap?</h3>
                    <p className="text-xs text-gray-500">Can't find the path you need? Request one from our experts.</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href="/practice"
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
                      Start Practicing
                    </Link>
                    <Link href="/blog"
                      className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#222] text-gray-300 text-xs font-semibold rounded-lg border border-white/[0.07] hover:border-white/[0.12] transition-colors">
                      Browse Blogs
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}

/* ── Roadmap card component ── */
function RoadmapCard({ rm, idx, onView, featured }) {
  const num = String(idx + 1).padStart(2, "0");

  return (
    <div
      className={`group flex flex-col bg-[#0F0F0F] border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_0_24px_rgba(239,68,68,0.06)]
        ${featured ? "border-yellow-500/20 hover:border-yellow-500/30" : "border-white/[0.05] hover:border-red-900/30"}`}
    >
      {/* top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${rm.accent}, transparent)` }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* number + featured */}
        <div className="flex items-start justify-between mb-4">
          <span className="font-black text-2xl leading-none" style={{ color: `${rm.accent}30` }}>
            {num}
          </span>
          <div className="flex items-center gap-1.5">
            {featured && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                Featured
              </span>
            )}
            {rm.category && (
              <span className="text-[10px] text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded capitalize">
                {rm.category}
              </span>
            )}
          </div>
        </div>

        {/* title */}
        <h3 className="text-sm font-bold text-gray-200 group-hover:text-white mb-2 line-clamp-2 leading-snug transition-colors">
          {rm.title}
        </h3>

        {/* excerpt */}
        {rm.excerpt && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed flex-1">
            {rm.excerpt}
          </p>
        )}

        {/* skill tags */}
        {rm.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {rm.skills.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: `${rm.accent}10`, color: `${rm.accent}cc`, border: `1px solid ${rm.accent}20` }}>
                {s}
              </span>
            ))}
            {rm.skills.length > 3 && (
              <span className="text-[10px] text-gray-700">+{rm.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="px-5 py-3 bg-[#0C0C0C] border-t border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <FaClock className="text-[9px]" /> {rm.duration}
          </span>
          <span className="flex items-center gap-1">
            <FaEye className="text-[9px]" /> {rm.views}
          </span>
          {rm.author && (
            <span className="flex items-center gap-1 hidden sm:flex">
              <FaUser className="text-[9px]" /> {rm.author}
            </span>
          )}
        </div>
        <button
          onClick={() => onView(rm.id)}
          className="flex items-center gap-1.5 text-[11px] font-semibold transition-all px-3 py-1.5 rounded-lg"
          style={{
            background: `${rm.accent}18`,
            color: rm.accent,
            border: `1px solid ${rm.accent}25`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${rm.accent}28`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${rm.accent}18`; }}
        >
          Start Path <FiArrowRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}
