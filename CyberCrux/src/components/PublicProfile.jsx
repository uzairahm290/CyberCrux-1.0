import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CountryFlag from './CountryFlag';
import { 
  FaTrophy, FaFire, FaUser, FaCalendarAlt, FaMedal, FaStar,
  FaEye, FaHeart, FaClock, FaChartLine, FaAward, FaGem
} from 'react-icons/fa';
import { 
  BiTrendingUp, BiDiamond, BiTime, BiTrophy, BiMedal, BiTargetLock, BiChart, BiCrown
} from 'react-icons/bi';
import DashNav from './DashNav';
import MainNav from './MainNav';
import Footer from './Footer';
import { useAuth } from '../AuthContext';

// Badge images will now come directly from URLs in the database
// Fallback images for local development
import badge1 from '../assets/badges/1.png';
import badge2 from '../assets/badges/2.png';
import badge3 from '../assets/badges/3.png';
import badge4 from '../assets/badges/4.png';
import badge5 from '../assets/badges/5.png';
import badge6 from '../assets/badges/6.png';
import badge7 from '../assets/badges/7.png';
import badge8 from '../assets/badges/8.png';
import badge9 from '../assets/badges/9.png';
import badge10 from '../assets/badges/10.png';

const fallbackBadgeImages = {
  '1.png': badge1,
  '2.png': badge2,
  '3.png': badge3,
  '4.png': badge4,
  '5.png': badge5,
  '6.png': badge6,
  '7.png': badge7,
  '8.png': badge8,
  '9.png': badge9,
  '10.png': badge10
};

// Helper function to get badge image URL
const getBadgeImageUrl = (badge) => {
  // If icon is already a full URL, use it
  if (badge.icon && badge.icon.startsWith('http')) {
    return badge.icon;
  }
  // Otherwise, use fallback mapping for local images
  return fallbackBadgeImages[badge.icon] || badge1;
};

// Helper function to format streak text
const formatStreak = (streak) => {
  if (streak === 1) return '1 day';
  return `${streak} days`;
};



const StatCard = ({ icon, label, value, color, subtitle, isUnranked = false }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-right">
        <div className={`font-bold text-white ${isUnranked ? 'text-lg' : 'text-2xl'}`}>{value}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
    </div>
    <h3 className="text-gray-300 text-sm font-medium">{label}</h3>
  </div>
);

const Badge = ({ badge, onClick }) => (
  <div 
    className="group relative cursor-pointer"
    onClick={() => onClick(badge)}
  >
    <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
      <img 
        src={getBadgeImageUrl(badge)} 
        alt={badge.name}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to first badge image if URL fails to load
          e.target.src = badge1;
        }}
      />
    </div>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
        <div className="font-semibold">{badge.name}</div>
        <div className="text-gray-300">{badge.description}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {children}
  </button>
);

export default function PublicProfile() {
  const { identifier } = useParams(); // Can be username or user ID
  const { user: currentUser } = useAuth(); // Get current logged-in user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBadge, setSelectedBadge] = useState(null);

  console.log('PublicProfile component rendered, identifier:', identifier);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('Fetching profile for:', identifier);
        const response = await fetch(`http://localhost:5000/api/profile/${identifier}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          setProfile(data.profile);
          console.log('Profile set successfully:', data.profile);
        } else {
          setError(data.message || 'Profile not found');
          console.log('Profile error:', data.message);
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      fetchProfile();
    }
  }, [identifier]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getRankColor = (rank) => {
    if (!rank) return 'from-gray-500 to-gray-700'; // No rank yet
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank <= 3) return 'from-gray-400 to-gray-600';
    if (rank <= 10) return 'from-orange-400 to-orange-600';
    if (rank <= 100) return 'from-green-400 to-green-600';
    return 'from-blue-400 to-blue-600';
  };

  const getPercentile = (rank) => {
    if (!rank) return 'Not ranked yet';
    if (rank === 1) return 'top 0.1%';
    if (rank <= 10) return 'top 1%';
    if (rank <= 100) return 'top 5%';
    return 'top 20%';
  };

  // Helper function to render the appropriate navigation
  const renderNavigation = () => {
    return currentUser ? <DashNav /> : <MainNav />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        {renderNavigation()}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white">Loading profile for: {identifier}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        {renderNavigation()}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaUser className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link 
              to={currentUser ? "/dashboard" : "/"}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              {currentUser ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, stats, badges } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      {renderNavigation()}
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400 border-blue-300 hover:border-blue-400 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    {user.profile_pic ? (
                      <img 
                        src={user.profile_pic} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {user.username}
                </h1>
                {user.description ? (
                  <p className="text-gray-300 mb-3 text-base leading-relaxed">
                    {user.description}
                  </p>
                ) : (
                  <p className="text-gray-400 mb-3">
                    {stats.completed_scenarios === 0 ? (
                      'New Cybersecurity Practitioner - Complete your first scenario to get started!'
                    ) : (
                      `Level ${stats.level} Cybersecurity Practitioner`
                    )}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  {user.country && (
                    <div className="flex items-center gap-2">
                      <CountryFlag 
                        country={user.country}
                        size="16px"
                        height="12px"
                          title={user.country}
                        />
                      <span>{user.country}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>Level {stats.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    <span>Joined {formatDate(user.created_at)}</span>
                  </div>
                </div>
                
                {/* Social Links */}
                {(user.linkedin_url || user.github_url) && (
                  <div className="flex gap-3">
                    {user.linkedin_url && (
                      <a 
                        href={user.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#005885] hover:to-[#0077B5] px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {user.github_url && (
                      <a 
                        href={user.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>


            </div>

            {/* Stats Cards */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<BiTrophy className="w-6 h-6 text-white" />}
                label="Rank"
                value={stats.rank ? `#${stats.rank}` : 'Unranked'}
                subtitle={getPercentile(stats.rank)}
                color={getRankColor(stats.rank)}
                isUnranked={!stats.rank}
              />
              
              <StatCard
                icon={<FaFire className="w-6 h-6 text-white" />}
                label="Streak"
                value={stats.current_streak}
                subtitle={`Best: ${stats.longest_streak}`}
                color="from-orange-500 to-red-500"
              />
              
              <StatCard
                icon={<BiDiamond className="w-6 h-6 text-white" />}
                label="Points"
                value={stats.total_points.toLocaleString()}
                color="from-blue-500 to-cyan-500"
              />
              
              <StatCard
                icon={<FaMedal className="w-6 h-6 text-white" />}
                label="Badges"
                value={badges.length}
                color="from-purple-500 to-pink-500"
              />
              
              <StatCard
                icon={<BiTargetLock className="w-6 h-6 text-white" />}
                label="Completed rooms"
                value={stats.completed_scenarios}
                color="from-green-500 to-emerald-500"
              />
              
              <StatCard
                icon={<FaStar className="w-6 h-6 text-white" />}
                label="Level"
                value={stats.level}
                color="from-yellow-500 to-orange-500"
              />

            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={<FaEye className="w-4 h-4" />}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'badges'}
            onClick={() => setActiveTab('badges')}
            icon={<FaMedal className="w-4 h-4" />}
          >
            Badges
          </TabButton>
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<FaChartLine className="w-4 h-4" />}
          >
            Detailed Stats
          </TabButton>
        </div>

        {/* Tab Content */}
        {activeTab === 'badges' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaAward className="w-6 h-6 text-yellow-400" />
              Achievements & Badges
            </h2>
            
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
                {badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    badge={badge}
                    onClick={setSelectedBadge}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaMedal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No badges earned yet</p>
                {stats.completed_scenarios === 0 ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">You're just getting started!</p>
                    <p className="text-xs text-gray-600">Complete your first practice scenario to earn your first badge</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Complete more scenarios to earn badges!</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Badges */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaStar className="w-5 h-5 text-yellow-400" />
                Recent Badges
              </h3>
              
              {badges.slice(-6).length > 0 ? (
                <div className="grid grid-cols-5 gap-0.5">
                  {badges.slice(-6).map((badge) => (
                    <Badge
                      key={badge.id}
                      badge={badge}
                      onClick={setSelectedBadge}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No badges earned yet</p>
                  {stats.completed_scenarios === 0 && (
                    <p className="text-sm text-gray-500">Complete your first scenario to earn your first badge!</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BiChart className="w-5 h-5 text-blue-400" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Level</span>
                  <span className="font-semibold">{stats.level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Global Rank</span>
                  <span className="font-semibold">{stats.rank ? `#${stats.rank}` : 'Unranked'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="font-semibold">{stats.average_score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Streak</span>
                  <span className="font-semibold">{formatStreak(stats.current_streak)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Longest Streak</span>
                  <span className="font-semibold">{formatStreak(stats.longest_streak)}</span>
                </div>
                {stats.completed_scenarios === 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">🎯 Start your journey by completing your first scenario!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaChartLine className="w-6 h-6 text-blue-400" />
              Detailed Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-blue-400">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Scenarios Completed</span>
                    <span>{stats.completed_scenarios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Score</span>
                    <span>{stats.average_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Points</span>
                    <span>{stats.total_points.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-green-400">Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Streak</span>
                    <span>{formatStreak(stats.current_streak)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Longest Streak</span>
                    <span>{formatStreak(stats.longest_streak)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time Spent</span>
                    <span>{formatTime(stats.total_time)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-purple-400">Achievements</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Badges Earned</span>
                    <span>{badges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Level</span>
                    <span>{stats.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Global Rank</span>
                    <span>{stats.rank ? `#${stats.rank}` : 'Unranked'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badge Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-white/10 p-3">
                <img 
                  src={getBadgeImageUrl(selectedBadge)} 
                  alt={selectedBadge.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to first badge image if URL fails to load
                    e.target.src = badge1;
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-300 mb-6">{selectedBadge.description}</p>
              <button
                onClick={() => setSelectedBadge(null)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
