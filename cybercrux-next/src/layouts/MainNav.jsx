"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { FiShield, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { BiMap, BiBook, BiWrench, BiHomeAlt, BiCode } from "react-icons/bi";

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Features", href: "/features" },
  { label: "Blog",     href: "/blog" },
  { label: "About",    href: "/about-us" },
];

const mobileLinks = [
  { label: "Home",     href: "/",          icon: BiHomeAlt },
  { label: "Features", href: "/features",  icon: BiWrench },
  { label: "Blog",     href: "/blog",      icon: BiBook },
  { label: "Roadmaps", href: "/roadmap",   icon: BiMap },
  { label: "About",    href: "/about-us",  icon: BiCode },
];

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname                     = usePathname();
  const { isAuthenticated, user }    = useAuth();
  const { theme, toggleTheme }       = useTheme();
  const drawerRef                    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-canvas)]/90 backdrop-blur-xl border-b border-[var(--color-edge)] shadow-[0_1px_0_rgba(225,29,72,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-[#E11D48] flex items-center justify-center transition-opacity group-hover:opacity-85 shadow-[0_0_10px_rgba(225,29,72,0.3)]">
              <FiShield className="text-white text-sm" />
            </div>
            <span className="text-[var(--color-ink)] font-semibold text-base tracking-tight group-hover:text-[#E11D48] transition-colors">CyberCrux</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 font-mono uppercase tracking-wider">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors duration-150 ${
                    active
                      ? "text-[#E11D48] bg-[#E11D48]/10"
                      : "text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors mr-2">
              {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
            </button>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-md text-xs font-bold font-mono tracking-widest uppercase text-[var(--color-muted)] hover:text-[#E11D48] transition-colors duration-150"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-xs font-bold font-mono tracking-widest uppercase py-1.5 px-4"
                >
                  Deploy
                </Link>
              </>
            ) : (
              <>
                <span className="text-[#E11D48] text-xs font-mono font-bold tracking-widest uppercase px-2">
                  OP: {user?.username}
                </span>
                <Link href="/dashboard" className="btn-primary text-xs font-bold font-mono tracking-widest uppercase py-1.5 px-4">
                  Terminal
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu className="text-lg" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 h-full w-72 bg-[var(--color-surface)] border-l border-[var(--color-edge-strong)] flex flex-col animate-slide-right shadow-[-20px_0_50px_rgba(225,29,72,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="h-14 flex items-center justify-between px-5 border-b border-[var(--color-edge)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#E11D48] flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.3)]">
                  <FiShield className="text-white text-xs" />
                </div>
                <span className="text-[var(--color-ink)] font-semibold text-sm">CyberCrux</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors"
                  aria-label="Close navigation"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto font-mono uppercase tracking-wider">
              <div className="space-y-1">
                {mobileLinks.map(({ label, href, icon: Icon }, i) => {
                  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors duration-150 animate-fade-in-up ${
                        active
                          ? "text-[#E11D48] bg-[#E11D48]/10 border border-[#E11D48]/20"
                          : "text-[var(--color-muted)] hover:text-[#E11D48] hover:bg-[#E11D48]/5"
                      }`}
                    >
                      <Icon className="text-base shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Auth actions */}
            <div className="px-4 py-5 border-t border-[var(--color-edge)] space-y-2 font-mono uppercase tracking-widest">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost w-full text-xs font-bold py-2"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full text-xs font-bold py-2"
                  >
                    Deploy
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-xs font-bold py-2"
                >
                  Terminal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
