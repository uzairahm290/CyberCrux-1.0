"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop,
  BiMedal, BiTrophy, BiNews, BiHomeAlt, BiCode, BiSearch, BiStar,
} from 'react-icons/bi';
import {
  FaBook, FaDownload, FaStar, FaClock, FaUser, FaEye, FaFire,
} from 'react-icons/fa';
import {
  FiBell, FiSettings, FiUser, FiLogOut, FiChevronDown,
  FiShield, FiMenu, FiX, FiSliders,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import FloatingChatWidget from '@/components/chatbot/FloatingChatWidget';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Nav links
// ---------------------------------------------------------------------------

const navLinks = [
  { label: 'Dashboard',      href: '/dashboard',  Icon: BiHomeAlt    },
  { label: 'Practice',       href: '/practice',   Icon: BiBrain      },
  { label: 'Compete',        href: '/compete',    Icon: BiTrophy     },
  { label: 'Mock Interview', href: '/interviews', Icon: BiMicrophone },
  { label: 'Roadmaps',       href: '/roadmap',    Icon: BiMap        },
  { label: 'Labs',           href: '/labs',       Icon: BiLaptop     },
  { label: 'Books',          href: '/books',      Icon: BiBookOpen   },
  { label: 'Tools',          href: '/tools',      Icon: BiWrench     },
  { label: 'Projects',       href: '/projects',   Icon: BiCode       },
  { label: 'Blog',           href: '/blog',       Icon: BiNews       },
  { label: 'Badges',         href: '/badges',     Icon: BiMedal      },
];

// ---------------------------------------------------------------------------
// Category colour map for placeholder covers
// ---------------------------------------------------------------------------

const CATEGORY_COLORS = {
  beginner:     'bg-green-900/60 text-green-400',
  intermediate: 'bg-blue-900/60 text-blue-400',
  advanced:     'bg-red-900/60 text-red-400',
  tools:        'bg-purple-900/60 text-purple-400',
  forensics:    'bg-yellow-900/60 text-yellow-400',
  default:      'bg-zinc-800 text-zinc-400',
};

function categoryColor(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-zinc-700'}`}
        />
      ))}
      <span className="ml-1 text-xs text-zinc-400">{rating}</span>
    </span>
  );
}

function BookCoverPlaceholder({ book }) {
  const initial = book.category ? book.category.charAt(0).toUpperCase() : 'B';
  return (
    <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${categoryColor(book.category)}`}>
      {initial}
    </div>
  );
}

function BookCard({ book }) {
  const isIconsCover = !book.cover || book.cover.includes('icons8');
  return (
    <div
      className={`relative flex bg-[#0C0C0C] border rounded-xl overflow-hidden transition-all duration-200 hover:border-red-600/30 hover:shadow-lg hover:shadow-red-900/10 ${
        book.featured ? 'border-yellow-600/30' : 'border-red-900/15'
      }`}
    >
      {/* Featured left accent stripe */}
      {book.featured && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 to-yellow-700" />
      )}

      {/* Cover */}
      <div className="w-24 flex-shrink-0 bg-zinc-900" style={{ minHeight: '160px' }}>
        {!isIconsCover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <BookCoverPlaceholder book={book} />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${categoryColor(book.category)}`}>
            {book.category}
          </span>
          {book.featured && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{book.title}</h3>

        {/* Author */}
        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
          <FaUser className="w-2.5 h-2.5" />
          {book.author}
        </p>

        {/* Stars */}
        <StarRating rating={book.rating} />

        {/* Meta pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
            <FaClock className="w-2.5 h-2.5" />
            {book.readTime}
          </span>
          <span className="flex items-center gap-1 text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
            <FaBook className="w-2.5 h-2.5" />
            {book.pages}p
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 flex-1">{book.description}</p>

        {/* Download */}
        <a
          href={book.pdf || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center justify-center gap-2 text-xs font-semibold bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 hover:border-red-500/50 text-red-400 hover:text-red-300 py-2 px-3 rounded-lg transition-all duration-150"
        >
          <FaDownload className="w-3 h-3" />
          Download PDF
          <span className="text-zinc-500 font-normal">({(book.downloads || 0).toLocaleString()})</span>
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookPage() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [books,      setBooks]      = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Books' }]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery,      setSearchQuery]       = useState('');
  const [sortBy,           setSortBy]            = useState('featured');

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // ---------------------------------------------------------------------------
  // API fetch — preserves original logic
  // ---------------------------------------------------------------------------

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

      const booksResponse = await fetch(`${base}/api/books`);
      if (!booksResponse.ok) {
        const errorText = await booksResponse.text();
        throw new Error(`Failed to fetch books: ${booksResponse.status} - ${errorText}`);
      }
      const booksData = await booksResponse.json();

      const categoriesResponse = await fetch(`${base}/api/books/categories`);
      if (!categoriesResponse.ok) {
        const errorText = await categoriesResponse.text();
        throw new Error(`Failed to fetch categories: ${categoriesResponse.status} - ${errorText}`);
      }
      const categoriesData = await categoriesResponse.json();

      setBooks(booksData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // No fallback to defaultBooks

  // ---------------------------------------------------------------------------
  // Filter + sort
  // ---------------------------------------------------------------------------

  const filteredBooks = books
    .filter((b) => {
      const matchesCat  = selectedCategory === 'all' || b.category === selectedCategory;
      const q           = searchQuery.toLowerCase();
      const matchSearch = !q ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      return matchesCat && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':  return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':    return b.rating - a.rating;
        case 'downloads': return b.downloads - a.downloads;
        case 'newest':    return String(b.published).localeCompare(String(a.published));
        case 'title':     return a.title.localeCompare(b.title);
        default:          return 0;
      }
    });

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------

  const totalDownloads = books.reduce((s, b) => s + (b.downloads || 0), 0);
  const avgRating =
    books.length > 0
      ? (books.reduce((s, b) => s + (b.rating || 0), 0) / books.length).toFixed(1)
      : '0.0';

  // ---------------------------------------------------------------------------
  // Auth helpers
  // ---------------------------------------------------------------------------

  function handleLogout() {
    logout?.();
    router.push('/login');
  }

  const username    = user?.username || user?.name || 'User';
  const userInitial = username.charAt(0).toUpperCase();
  const streak      = user?.streak || 0;

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                              */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-60 bg-[#0C0C0C] border-r border-red-900/20 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-red-900/20">
          <FiShield className="w-6 h-6 text-red-500 flex-shrink-0" />
          <span className="text-base font-bold tracking-wide text-white">CyberCrux</span>
          <button
            className="ml-auto lg:hidden text-zinc-500 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* User card */}
        <div className="flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-xl bg-zinc-900/60 border border-red-900/10">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{username}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Member</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navLinks.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative ${
                  active
                    ? 'bg-red-600/12 text-red-400 border border-red-600/18'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-red-500 rounded-r-full" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: settings + logout */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-red-900/20 pt-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <FiSettings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-600/8 transition-all duration-150"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main area                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col flex-1 lg:ml-60 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex-shrink-0 flex items-center gap-4 px-5 bg-[#0A0A0A] border-b border-red-900/15">
          <button
            className="lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-white">Library</h1>

          <div className="ml-auto flex items-center gap-3">
            {/* Streak pill */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-900/30 border border-orange-700/30">
                <FaFire className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-orange-300">{streak}</span>
              </div>
            )}

            {/* Bell */}
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
              <FiBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-xs font-bold">
                  {userInitial}
                </div>
                <FiChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#0C0C0C] border border-red-900/20 rounded-xl shadow-xl z-50 overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <FiSettings className="w-3.5 h-3.5" />
                    Settings
                  </Link>
                  <div className="border-t border-red-900/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:text-red-400 hover:bg-red-600/8 transition-all"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Page content                                                       */}
        {/* ---------------------------------------------------------------- */}
        <main className="flex-1 overflow-y-auto">

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-red-600/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-zinc-500">Loading library...</p>
              </div>
            </div>
          )}

          {/* Non-blocking error banner — falls back to default data */}
          {!loading && error && (
            <div className="mx-6 mt-4 flex items-start gap-3 bg-red-900/10 border border-red-900/30 rounded-xl px-4 py-3">
              <FiBell className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-red-300 font-medium">API unavailable — showing offline data</p>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); fetchData(); }}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex-shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Main content */}
          {!loading && (
            <div className="p-6 space-y-6">

              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Books',     value: books.length,             icon: <BiBookOpen className="w-4 h-4" />, color: 'text-red-400'    },
                  { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: <FaDownload className="w-4 h-4" />, color: 'text-blue-400'   },
                  { label: 'Avg Rating',      value: avgRating,                       icon: <FaStar className="w-4 h-4" />,     color: 'text-yellow-400' },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="flex items-center gap-3 bg-[#0C0C0C] border border-red-900/15 rounded-xl px-4 py-3">
                    <span className={color}>{icon}</span>
                    <div>
                      <p className="text-lg font-bold text-white leading-tight">{value}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Category pills */}
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                        selectedCategory === cat.id
                          ? 'bg-red-600/15 border-red-600/40 text-red-400'
                          : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-56 flex-shrink-0">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0C0C0C] border border-zinc-800 focus:border-red-600/40 rounded-lg text-white placeholder-zinc-600 outline-none transition-colors"
                  />
                </div>

                {/* Sort */}
                <div className="relative flex-shrink-0">
                  <FiSliders className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-9 pr-8 py-2 text-sm bg-[#0C0C0C] border border-zinc-800 focus:border-red-600/40 rounded-lg text-zinc-300 outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Top Rated</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="newest">Newest</option>
                    <option value="title">A - Z</option>
                  </select>
                </div>
              </div>

              {/* Result count */}
              <p className="text-xs text-zinc-600">
                Showing{' '}
                <span className="text-zinc-400 font-medium">{filteredBooks.length}</span>{' '}
                of {books.length} books
              </p>

              {/* Books grid */}
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                    <BiBookOpen className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-1">No books found</h3>
                  <p className="text-xs text-zinc-600">Try adjusting your search or filter</p>
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      <FloatingChatWidget />
    </div>
  );
}
