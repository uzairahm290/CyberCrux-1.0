"use client";

import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  BiBrain, BiLaptop, BiMedal, BiHomeAlt, BiMap, BiBookOpen,
  BiWrench, BiNews, BiCode, BiMicrophone, BiTrophy, BiTargetLock,
} from "react-icons/bi";
import {
  FaArrowLeft, FaTwitter, FaLinkedin, FaCopy, FaEye,
  FaClock, FaUser, FaCalendarAlt, FaTags, FaFacebookF,
  FaFire, FaShareAlt, FaCheckCircle,
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

const XP_PER_LEVEL = 100;

function getExcerpt(html, maxLen = 110) {
  if (typeof document === "undefined") return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

const formatDate = (s) =>
  new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function BlogViewPage() {
  const { id }       = useParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const { user, logout } = useAuth();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [blog,      setBlog]      = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [shareUrl,  setShareUrl]  = useState("");

  const [userStats, setUserStats] = useState({ totalPoints: 0, currentStreak: 0, level: 1 });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

  useEffect(() => { setShareUrl(window.location.href); }, []);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        setBlog(await res.json());
      } catch (err) {
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    }
    async function fetchSuggested() {
      try {
        const res = await fetch(`${API}/api/blogs`);
        const all = await res.json();
        setSuggested(all.filter((b) => String(b.id) !== String(id)).slice(0, 3));
      } catch {}
    }
    fetchBlog();
    fetchSuggested();
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.allSettled([
      fetch(`${API}/api/practice/stats`, { credentials: "include" }),
      fetch(`${API}/api/streak/user-streak/${user.id}`),
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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const xpInLevel  = userStats.totalPoints % XP_PER_LEVEL;
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

  /* ── Sidebar + Topbar shell ── */
  const Shell = ({ children }) => (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
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
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.username || "Hacker"}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-red-400 font-medium bg-red-600/10 px-1.5 py-0.5 rounded border border-red-600/20">LVL {userStats.level}</span>
                <span className="text-[10px] text-gray-600">{userStats.totalPoints} XP</span>
              </div>
            </div>
          </div>
          <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-700" style={{ width: `${Math.max(2, xpProgress)}%` }} />
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center gap-3 px-5 border-b border-red-900/15 bg-[#0A0A0A] flex-shrink-0">
          <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setSidebarOpen(true)}>
            <FiMenu className="text-base" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none truncate">{blog?.title || "Blog"}</p>
            <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">Blog · {blog?.category || "Article"}</p>
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

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );

  /* ── Loading ── */
  if (loading) return (
    <Shell>
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-600">Loading article…</p>
      </div>
    </Shell>
  );

  /* ── Error ── */
  if (error || !blog) return (
    <Shell>
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-14 h-14 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
          <BiTargetLock className="text-gray-600 text-2xl" />
        </div>
        <p className="text-sm font-semibold text-white mb-1">Article Not Found</p>
        <p className="text-xs text-gray-600 mb-5">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
          <FaArrowLeft className="text-[10px]" /> Back to Blog
        </Link>
      </div>
    </Shell>
  );

  /* ── Article ── */
  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors mb-6">
          <FaArrowLeft className="text-[10px]" /> Back to Blog
        </Link>

        {/* Article card */}
        <article className="bg-[#0F0F0F] border border-white/[0.06] rounded-xl overflow-hidden mb-8">

          {/* Header */}
          <div className="p-6 border-b border-white/[0.05]">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {blog.category && (
                <span className="text-[10px] px-2 py-0.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded font-medium">
                  {blog.category}
                </span>
              )}
              {blog.readTime && (
                <span className="flex items-center gap-1 text-[11px] text-gray-600">
                  <FaClock className="text-[9px]" /> {blog.readTime}
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-gray-600">
                <FaEye className="text-[9px]" /> {Number(blog.views || 0).toLocaleString()} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-sm text-gray-400 leading-relaxed mb-5">{blog.excerpt}</p>
            )}

            {/* Author + share row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600/10 border border-red-600/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {blog.author_avatar
                    ? <img src={blog.author_avatar} alt={blog.author} className="w-full h-full object-cover" />
                    : <FaUser className="text-red-400 text-sm" />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{blog.author}</p>
                  <p className="text-[11px] text-gray-600 flex items-center gap-1">
                    <FaCalendarAlt className="text-[9px]" /> {formatDate(blog.date)}
                  </p>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-1.5">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-gray-500 hover:text-[#1DA1F2] transition-all">
                  <FaTwitter className="text-xs" />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-gray-500 hover:text-[#0A66C2] transition-all">
                  <FaLinkedin className="text-xs" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-gray-500 hover:text-[#1877F2] transition-all">
                  <FaFacebookF className="text-xs" />
                </a>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all
                    ${copied
                      ? "bg-green-600/15 border-green-600/30 text-green-400"
                      : "bg-white/[0.04] border-white/[0.07] text-gray-500 hover:text-white hover:bg-white/[0.08]"
                    }`}>
                  {copied ? <><FaCheckCircle className="text-[10px]" /> Copied</> : <><FaCopy className="text-[10px]" /> Copy</>}
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && (
            <div className="px-6 py-3 border-b border-white/[0.05] flex flex-wrap items-center gap-2">
              <FaTags className="text-gray-600 text-[10px]" />
              {blog.tags.split(",").map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] text-gray-500 rounded">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-400 prose-p:leading-relaxed
                prose-li:text-gray-400
                prose-strong:text-white
                prose-code:text-red-400 prose-code:bg-red-950/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-[#0A0A0F] prose-pre:border prose-pre:border-white/[0.07] prose-pre:rounded-xl
                prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-red-600 prose-blockquote:bg-red-950/20 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-400
                prose-hr:border-white/[0.07]
                prose-img:rounded-xl prose-img:border prose-img:border-white/[0.07]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        {/* Related articles */}
        {suggested.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-red-600 rounded-full" />
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Related Articles</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {suggested.map((s) => (
                <Link key={s.id} href={`/blog/${s.id}`}
                  className="group bg-[#0F0F0F] border border-white/[0.05] hover:border-red-900/40 rounded-xl p-4 transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.07)] flex flex-col">
                  {s.category && (
                    <span className="self-start text-[10px] px-1.5 py-0.5 bg-red-600/10 text-red-400 border border-red-600/20 rounded font-medium mb-2">
                      {s.category}
                    </span>
                  )}
                  <h3 className="text-xs font-semibold text-gray-300 group-hover:text-white mb-2 line-clamp-2 leading-snug transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 line-clamp-2 flex-1 mb-3">{getExcerpt(s.content)}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaUser className="text-[8px]" /> {s.author}
                    </span>
                    {s.readTime && (
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[8px]" /> {s.readTime}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </Shell>
  );
}
