"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiShield, FiSearch, FiBell, FiMenu, FiX, FiSettings,
  FiUser, FiLogOut, FiChevronDown, FiSun, FiMoon,
} from "react-icons/fi";
import {
  BiMap, BiBook, BiWrench, BiHomeAlt, BiCode, BiTrophy,
  BiBrain, BiMicrophone, BiMedal,
} from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import SearchModal from "@/components/ui/SearchModal";

const primaryLinks = [
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Practice",   href: "/practice" },
  { label: "Compete",    href: "/compete" },
  { label: "Mock",       href: "/interviews" },
];

const moreLinks = [
  { label: "Roadmaps",  href: "/roadmap",   icon: BiMap },
  { label: "Books",     href: "/books",     icon: BiBook },
  { label: "Tools",     href: "/tools",     icon: BiWrench },
  { label: "Labs",      href: "/labs",      icon: BiHomeAlt },
  { label: "Projects",  href: "/projects",  icon: BiCode },
  { label: "Blog",      href: "/blog",      icon: BiBook },
];

const mobileLinks = [
  { label: "Dashboard",  href: "/dashboard",  icon: BiHomeAlt },
  { label: "Practice",   href: "/practice",   icon: BiBrain },
  { label: "Compete",    href: "/compete",    icon: BiTrophy },
  { label: "Mock",       href: "/interviews", icon: BiMicrophone },
  { label: "Roadmaps",   href: "/roadmap",    icon: BiMap },
  { label: "Books",      href: "/books",      icon: BiBook },
  { label: "Tools",      href: "/tools",      icon: BiWrench },
  { label: "Labs",       href: "/labs",       icon: BiHomeAlt },
  { label: "Badges",     href: "/badges",     icon: BiMedal },
  { label: "Blog",       href: "/blog",       icon: BiBook },
];

function NotifIcon(type) {
  const map = {
    badge:       <BiMedal className="text-[#F59E0B]" />,
    scenario:    <BiBrain className="text-[#5B4FF5]" />,
    achievement: <BiMedal className="text-[#22C55E]" />,
    system:      <FiSettings className="text-[#8888AA]" />,
  };
  return map[type] || <FiBell className="text-[#8888AA]" />;
}

export default function DashNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout }       = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [profilePic,  setProfilePic]  = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);

  const moreRef  = useRef(null);
  const userRef  = useRef(null);
  const notifRef = useRef(null);

  /* ── Keyboard shortcut ───────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── Profile pic ─────────────────────────────────── */
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setProfilePic(d?.user?.profile_pic || null))
      .catch(() => {});
  }, []);

  /* ── Notifications ───────────────────────────────── */
  const fetchNotifications = async () => {
    if (!user) return;
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    try {
      const r = await fetch(`${API}/api/notifications`, { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        const list = d.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.is_read).length);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, [user]);

  const markRead = async (id) => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    await fetch(`${API}/api/notifications/${id}/read`, { method: "PUT", credentials: "include" }).catch(() => {});
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const clearAll = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    await fetch(`${API}/api/notifications/clear`, { method: "DELETE", credentials: "include" }).catch(() => {});
    setNotifications([]);
    setUnreadCount(0);
    setNotifOpen(false);
  };

  /* ── Click-outside ───────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current  && !moreRef.current.contains(e.target))  setMoreOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Logout ──────────────────────────────────────── */
  const handleLogout = async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";
    try {
      await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (_) {}
    logout();
    router.push("/login");
  };

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <nav className="sticky top-0 z-50 h-14 flex items-center px-4 md:px-6 bg-[rgba(10,10,15,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)]">
        {/* Mobile hamburger */}
        <button
          className="md:hidden mr-3 p-1.5 rounded-md text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu className="text-lg" />
        </button>

        {/* Logo */}
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 shrink-0 group mr-8">
          <div className="w-7 h-7 rounded-lg bg-[#5B4FF5] flex items-center justify-center transition-opacity group-hover:opacity-85">
            <FiShield className="text-white text-sm" />
          </div>
          <span className="text-[#F0F0FF] font-semibold text-base tracking-tight">CyberCrux</span>
        </Link>

        {/* Desktop primary nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {primaryLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive(href)
                  ? "text-[#F0F0FF] bg-[rgba(255,255,255,0.06)]"
                  : "text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors duration-150 ${
                moreOpen
                  ? "text-[#F0F0FF] bg-[rgba(255,255,255,0.06)]"
                  : "text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              More
              <FiChevronDown
                className={`text-xs transition-transform duration-150 ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-[#111118] border border-[rgba(255,255,255,0.09)] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1 animate-slide-down z-50">
                {moreLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                      isActive(href)
                        ? "text-[#F0F0FF] bg-[rgba(91,79,245,0.1)]"
                        : "text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <Icon className="text-base shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            aria-label="Search (⌘K)"
          >
            <FiSearch className="text-base" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-md text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="text-base" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#5B4FF5] animate-notif-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-[#111118] border border-[rgba(255,255,255,0.09)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-down z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
                  <span className="text-sm font-semibold text-[#F0F0FF]">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-[#5B4FF5] hover:text-[#7B6FF8] transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <FiBell className="text-2xl text-[#4A4A6A]" />
                      <p className="text-sm text-[#8888AA]">All caught up</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.03)] ${
                            !n.is_read ? "bg-[rgba(91,79,245,0.05)]" : ""
                          }`}
                        >
                          <span className="mt-0.5 text-base shrink-0">
                            {NotifIcon(n.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#F0F0FF] leading-snug">{n.title}</p>
                            <p className="text-xs text-[#8888AA] mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-xs text-[#4A4A6A] mt-1">
                              {new Date(n.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!n.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FF5] mt-1.5 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative ml-1" ref={userRef}>
            <button
              onClick={() => setUserOpen((o) => !o)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4FF5]"
              aria-label="User menu"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={user?.username}
                  className="w-7 h-7 rounded-full object-cover border border-[rgba(255,255,255,0.12)]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#5B4FF5]/20 border border-[rgba(91,79,245,0.3)] flex items-center justify-center text-[#7B6FF8] text-xs font-semibold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <FiChevronDown
                className={`text-xs text-[#8888AA] transition-transform duration-150 ${userOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-[#111118] border border-[rgba(255,255,255,0.09)] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-1 animate-slide-down z-50">
                <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.07)] mb-1">
                  <p className="text-sm font-semibold text-[#F0F0FF] truncate">{user?.username}</p>
                  <p className="text-xs text-[#8888AA] truncate">{user?.email}</p>
                </div>
                {[
                  { icon: FiUser,     label: "My Profile", href: `/profile/${user?.username}` },
                  { icon: BiMedal,    label: "Badges",     href: "/badges" },
                  { icon: FiSettings, label: "Settings",   href: "/settings" },
                ].map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                  >
                    <Icon className="text-base shrink-0" />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                >
                  {theme === "dark" ? (
                    <><FiSun className="text-base shrink-0" /> Light mode</>
                  ) : (
                    <><FiMoon className="text-base shrink-0" /> Dark mode</>
                  )}
                </button>
                <div className="my-1 h-px bg-[rgba(255,255,255,0.07)]" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.06)] transition-colors"
                >
                  <FiLogOut className="text-base shrink-0" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-72 bg-[#111118] border-r border-[rgba(255,255,255,0.07)] flex flex-col animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.07)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#5B4FF5] flex items-center justify-center">
                  <FiShield className="text-white text-xs" />
                </div>
                <span className="text-[#F0F0FF] font-semibold text-sm">CyberCrux</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <div className="w-8 h-8 rounded-full bg-[rgba(91,79,245,0.2)] border border-[rgba(91,79,245,0.3)] flex items-center justify-center text-[#7B6FF8] text-sm font-semibold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#F0F0FF] truncate">{user?.username}</p>
                  <p className="text-xs text-[#8888AA] truncate">{user?.email}</p>
                </div>
              </div>
            )}

            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
              {mobileLinks.map(({ label, href, icon: Icon }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors animate-fade-in-up ${
                    isActive(href)
                      ? "text-[#F0F0FF] bg-[rgba(91,79,245,0.12)] border border-[rgba(91,79,245,0.2)]"
                      : "text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <Icon className="text-base shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.07)] space-y-1">
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                {theme === "dark" ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.06)] transition-colors"
              >
                <FiLogOut className="text-base" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
