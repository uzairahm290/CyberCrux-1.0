
import { BiDotsHorizontalRounded, BiBook, BiMap, BiWrench, BiHomeAlt, BiSupport, BiGroup, BiMenu, BiX, BiCode } from "react-icons/bi";
import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaCog, FaMedal, FaMoon, FaSun, FaSearch , FaBell} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import SearchModal from './SearchModal';

export default function DashNav({ streak }) {
  // Add custom CSS for hiding scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [menuLocked, setMenuLocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setProfilePic(data.user?.profile_pic || null);
        } else {
          setProfilePic(null);
        }
      } catch (error) {
        setProfilePic(null);
      }
    };
    fetchProfilePic();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Fetch notifications
    fetchNotifications();
    
    // Set up interval to check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Close notifications dropdown when clicking outside
      if (showNotifications && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    }
    if (menuOpen || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, showNotifications]);

  // For mobile: close dropdown on outside tap
  useEffect(() => {
    if (!isTouch || !dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTouch, dropdownOpen]);

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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      logout(); // Clear user from context
      navigate('/login');
    } catch (err) {
      alert('Logout failed. Please try again.');
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Fetch notifications including badge notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter(n => !n.is_read).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/clear', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      setNotifications([]);
      setUnreadCount(0);
      setShowNotifications(false);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-blue-500/10">
      {/* Hamburger (mobile only, left) */}
      <button
        className="block md:hidden mr-2"
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label="Open menu"
      >
        <BiMenu className="text-2xl text-white" />
      </button>

      {/* Logo + Brand (desktop only, center/left) */}
      <Link to="/" className="hidden md:flex items-center gap-3 group">
        <img src="/src/assets/Logo.png" alt="Logo" className="h-10 group-hover:opacity-80 transition" />
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:opacity-80 transition">
          CyberCrux
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex ml-10 items-center gap-6 font-medium text-md relative">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/practice"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Practice
        </NavLink>
        <NavLink
          to="/compete"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Compete
        </NavLink>
        <NavLink
          to="/interviews"
          className={({ isActive }) =>
            `transition-all hover:text-blue-400 hover:underline underline-offset-8 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isActive ? "underline text-blue-400 decoration-2 decoration-blue-400" : "text-white"
            }`
          }
        >
          Mock
        </NavLink>
        <div
          className="relative flex items-center"
          ref={menuRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleButtonClick}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="More"
            tabIndex={0}
          >
            <BiDotsHorizontalRounded className="text-2xl text-white" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-10 top-0 w-56 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 backdrop-blur-2xl shadow-lg shadow-blue-400/30 border border-blue-400/20 rounded-xl py-2 flex flex-col z-50 animate-fade-in">
              <NavLink to="/roadmap" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiMap className="text-xl" />Roadmaps</NavLink>
              <NavLink to="/books" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiBook className="text-xl" />Books</NavLink>
              <NavLink to= "/tools" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiWrench className="text-xl" />Tools</NavLink>
              <NavLink to= "/labs" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiHomeAlt className="text-xl" />Home Labs</NavLink>
              <NavLink to= "/projects" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiCode className="text-xl" />Projects</NavLink>
              <NavLink to= "/blog" className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-white font-semibold hover:bg-blue-400/10 hover:text-blue-400 rounded-lg transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => { setMenuOpen(false); setMenuLocked(false); }}><BiCode className="text-xl" />Blogs</NavLink>

            </div>
          )}
        </div>
      </div>

      {/* Action Icons (always right, mobile and desktop) */}
      <div className="flex items-center gap-6 ml-auto">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Search"
        >
          <FaSearch className="text-white text-xl hover:text-blue-400 transition-colors" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <FaBell className="text-white text-xl hover:text-blue-400 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 backdrop-blur-xl border border-blue-400/20 rounded-xl shadow-2xl shadow-blue-400/30 z-50 max-h-80 sm:max-h-96 overflow-y-auto notifications-dropdown">
              <div className="p-3 sm:p-4 border-b border-blue-400/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-400/10"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <FaBell className="text-3xl sm:text-4xl text-gray-500 mx-auto mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto scrollbar-hide">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          notification.is_read 
                            ? 'bg-white/5 hover:bg-white/10' 
                            : 'bg-blue-500/20 border border-blue-500/30'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <div className="flex-shrink-0">
                            {notification.type === 'badge' && (
                              <FaMedal className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            )}
                            {notification.type === 'scenario' && (
                              <BiBook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                            )}
                            {notification.type === 'achievement' && (
                              <FaMedal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                            )}
                            {notification.type === 'system' && (
                              <FaCog className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-white mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-300 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={!isTouch ? () => setDropdownOpen(true) : undefined}
          onMouseLeave={!isTouch ? () => setDropdownOpen(false) : undefined}
        >
          <button
            className="focus:outline-none"
            onClick={isTouch ? () => setDropdownOpen((open) => !open) : undefined}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover hover:border-blue-500"
              />
            ) : (
              <FaUserCircle className="text-4xl text-blue-300 border-2 border-white rounded-full hover:border-blue-500" />
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 text-white rounded-lg shadow-lg z-50 py-2">
              <button
                onClick={handleThemeToggle}
                className="flex items-center w-full px-4 py-2 hover:bg-blue-400/10"
              >
                {theme === 'dark' ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                {theme === 'dark' ? "Light Theme" : "Dark Theme"}
              </button>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 hover:bg-green-400/10"
              >
                <FaCog className="mr-2" /> Settings
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center px-4 py-2 hover:bg-blue-400/10"
              >
                <FaUserCircle className="mr-2" /> My Profile
              </Link>
              <Link
                to="/badges"
                className="flex items-center px-4 py-2 hover:bg-purple-400/10"
              >
                <FaMedal className="mr-2" /> Badges
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-pink-400/10"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-0 left-0 w-72 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 backdrop-blur-2xl shadow-2xl shadow-blue-400/30 border-r border-blue-400/20 rounded-r-2xl py-8 px-6 flex flex-col gap-2 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-3xl text-white hover:text-blue-400 focus:outline-none" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <BiX />
            </button>
            <div className="mt-8" />
            <NavLink to="/practice" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-purple-400/10 hover:text-purple-400 transition-all ${isActive ? 'underline text-purple-400 decoration-2 decoration-purple-400' : ''}` }><BiBook className="text-xl" />Practice</NavLink>
            <NavLink to="/compete" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-pink-400/10 hover:text-pink-400 transition-all ${isActive ? 'underline text-pink-400 decoration-2 decoration-pink-400' : ''}` }><BiGroup className="text-xl" />Compete</NavLink>
            <NavLink to="/mock" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-green-400/10 hover:text-green-400 transition-all ${isActive ? 'underline text-green-400 decoration-2 decoration-green-400' : ''}` }><BiSupport className="text-xl" />Mock</NavLink>
            <NavLink to="/roadmap" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-blue-400/10 hover:text-blue-400 transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` }><BiMap className="text-xl" />Roadmaps</NavLink>
            <NavLink to="/books" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-green-400/10 hover:text-green-400 transition-all ${isActive ? 'underline text-green-400 decoration-2 decoration-green-400' : ''}` }><BiBook className="text-xl" />Books</NavLink>
            <NavLink to="/tools" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-purple-400/10 hover:text-purple-400 transition-all ${isActive ? 'underline text-purple-400 decoration-2 decoration-purple-400' : ''}` }><BiWrench className="text-xl" />Tools</NavLink>
            <NavLink to="/labs" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-pink-400/10 hover:text-pink-400 transition-all ${isActive ? 'underline text-pink-400 decoration-2 decoration-pink-400' : ''}` }><BiHomeAlt className="text-xl" />Home Labs</NavLink>
            <NavLink to="/projects" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-orange-400/10 hover:text-orange-400 transition-all ${isActive ? 'underline text-orange-400 decoration-2 decoration-orange-400' : ''}` } onClick={() => setMobileMenuOpen(false)}><BiCode className="text-xl" />Projects</NavLink>
            <NavLink to="/badges" className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-yellow-400/10 hover:text-yellow-400 transition-all ${isActive ? 'underline text-yellow-400 decoration-2 decoration-yellow-400' : ''}` } onClick={() => setMobileMenuOpen(false)}><FaMedal className="text-xl" />Badges</NavLink>
            <NavLink to={`/profile/${user?.username}`} className={({ isActive }) => `flex items-center gap-3 text-white font-semibold py-2 px-2 rounded-lg hover:bg-blue-400/10 hover:text-blue-400 transition-all ${isActive ? 'underline text-blue-400 decoration-2 decoration-blue-400' : ''}` } onClick={() => setMobileMenuOpen(false)}><FaUserCircle className="text-xl" />My Profile</NavLink>
            <div className="border-t border-blue-200 my-2" />
            <Link to="/login" className="w-full px-5 py-2 rounded-xl border border-blue-400 text-white font-semibold text-base shadow-sm hover:bg-blue-500/10 hover:text-blue-400 tracking-wide transition-all mb-2" onClick={() => setMobileMenuOpen(false)}>
              Premium
            </Link>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </nav>
  );
}
