// src/components/Navbar.jsx
import { FaSearch, FaBell } from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import { BiDotsHorizontalRounded, BiBook, BiMap, BiWrench, BiHomeAlt, BiSupport, BiGroup, BiMenu, BiX } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../AuthContext';

export default function MainNavbar({ streak }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [menuLocked, setMenuLocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMouseEnter = () => {
    setMenuOpen(true);
    setMenuLocked(true);
  };

  const handleMouseLeave = () => {
    setMenuLocked(false);
  };

  const handleButtonClick = () => {
    setMenuOpen((open) => !open);
    setMenuLocked(false);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-blue-500/10">
      <Link to="/" className="flex items-center gap-3 group">
        <img src="/src/assets/Logo.png" alt="Logo" className="h-12 group-hover:opacity-80 transition" />
        <span className="text-2xl font-bold pb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:opacity-80 transition">
          CyberCrux
        </span>
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-10 font-medium text-md relative">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/features"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Features
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/about-us"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          About Us
        </NavLink>
      </div>
      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="px-5 py-1.5 rounded-xl border border-blue-400 text-white font-semibold text-base shadow-sm hover:bg-blue-500/10 hover:text-blue-400 tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base shadow-sm hover:from-blue-600 hover:to-purple-600 tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
              Join Now
            </Link>
          </>
        ) : (
          <>
            <span className="text-white/80 text-sm">Welcome, {user?.username}</span>
            <Link to="/dashboard" className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-base shadow-sm hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-pink-400">
              Dashboard
            </Link>
          </>
        )}
      </div>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <BiMenu className="text-2xl text-white" />
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-72 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 backdrop-blur-2xl shadow-2xl shadow-blue-400/30 border-l border-blue-400/20 rounded-l-2xl py-8 px-6 flex flex-col gap-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-3xl text-white hover:text-blue-400 focus:outline-none" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <BiX />
            </button>
            <div className="mt-8" />
            {/* Mobile Navigation Links */}
            <Link to="/" className="flex items-center gap-3 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-400/10 hover:text-blue-400 transition-all" onClick={() => setMobileMenuOpen(false)}>
              <BiHomeAlt className="text-xl" />
              Home
            </Link>
            <Link to="/features" className="flex items-center gap-3 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-400/10 hover:text-purple-400 transition-all" onClick={() => setMobileMenuOpen(false)}>
              <BiGroup className="text-xl" />
              Features
            </Link>
            <Link to="/blog" className="flex items-center gap-3 text-white font-semibold py-3 px-4 rounded-lg hover:bg-pink-400/10 hover:text-pink-400 transition-all" onClick={() => setMobileMenuOpen(false)}>
              <BiBook className="text-xl" />
              Blog
            </Link>
            <Link to="/about-us" className="flex items-center gap-3 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-400/10 hover:text-green-400 transition-all" onClick={() => setMobileMenuOpen(false)}>
              <BiSupport className="text-xl" />
              About Us
            </Link>
            <div className="border-t border-blue-200 my-4" />
            {/* Mobile Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="w-full px-5 py-3 rounded-xl border border-blue-400 text-white font-semibold text-base shadow-sm hover:bg-blue-500/10 hover:text-blue-400 tracking-wide transition-all mb-3" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/signup" className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-base shadow-sm hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 tracking-wide transition-all" onClick={() => setMobileMenuOpen(false)}>
                  Join Now
                </Link>
              </>
            ) : (
              <>
                <div className="w-full px-5 py-3 text-white font-semibold text-base mb-3">
                  Welcome, {user?.username}
                </div>
                <Link to="/dashboard" className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-base shadow-sm hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 tracking-wide transition-all" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
