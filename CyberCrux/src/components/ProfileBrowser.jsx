import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaUser, FaTrophy, FaFire, FaMedal, FaEye, FaCrown
} from 'react-icons/fa';
import { BiDiamond, BiTrendingUp, BiCrown } from 'react-icons/bi';
import DashNav from './DashNav';
import Footer from './Footer';

const UserCard = ({ user, rank }) => (
  <Link 
    to={`/profile/${user.username}`}
    className="block group"
  >
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            {user.profile_pic ? (
              <img 
                src={user.profile_pic} 
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FaUser className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          {/* Rank badge for top users */}
          {rank <= 3 && (
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900' :
              rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900' :
              'bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900'
            }`}>
              {rank}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
              {user.username}
            </h3>
            {rank <= 10 && (
              <BiCrown className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <p className="text-gray-400 text-sm">
            Level {user.level} • Rank #{rank}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BiDiamond className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white">{user.total_points.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">Points</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FaTrophy className="w-4 h-4 text-green-400" />
            <span className="font-semibold text-white">{user.completed_scenarios}</span>
          </div>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-1">
          <FaFire className="w-3 h-3 text-orange-400" />
          <span className="text-sm font-medium">{user.current_streak} day streak</span>
        </div>
        
        <div className="flex items-center gap-1">
          <FaMedal className="w-3 h-3 text-purple-400" />
          <span className="text-sm font-medium">{user.badge_count} badges</span>
        </div>
      </div>
    </div>
  </Link>
);

const TopUserCard = ({ user, rank }) => {
  const getRankColor = () => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getRankIcon = () => {
    if (rank === 1) return <FaCrown className="w-6 h-6 text-yellow-400" />;
    if (rank <= 3) return <FaTrophy className="w-6 h-6 text-gray-400" />;
    return <FaMedal className="w-6 h-6 text-blue-400" />;
  };

  return (
    <Link 
      to={`/profile/${user.username}`}
      className="block group"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 hover:shadow-3xl hover:scale-105 transition-all duration-300">
        <div className="text-center">
          {/* Rank Badge */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getRankColor()} flex items-center justify-center font-bold text-2xl text-white shadow-lg`}>
            {rank}
          </div>

          {/* Profile Picture */}
          <div className="relative mx-auto mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 mx-auto">
              {user.profile_pic ? (
                <img 
                  src={user.profile_pic} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <FaUser className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              {getRankIcon()}
            </div>
          </div>

          {/* User Info */}
          <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors mb-2">
            {user.username}
          </h3>
          <p className="text-gray-400 mb-4">Level {user.level}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg text-blue-400">{user.total_points.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Points</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-green-400">{user.completed_scenarios}</div>
              <div className="text-xs text-gray-400">Rooms</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-orange-400">{user.current_streak}</div>
              <div className="text-xs text-gray-400">Streak</div>
            </div>
          </div>

          {/* Badge Count */}
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <FaMedal className="w-4 h-4" />
            <span className="font-semibold">{user.badge_count} badges earned</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ProfileBrowser() {
  const [profiles, setProfiles] = useState([]);
  const [topProfiles, setTopProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Fetch top 3 users
        const topResponse = await fetch('http://localhost:5000/api/profiles?limit=3');
        const topData = await topResponse.json();
        
        if (topData.success) {
          setTopProfiles(topData.profiles);
        }
        
        // Fetch more users for general listing
        const response = await fetch('http://localhost:5000/api/profiles?limit=20&offset=3');
        const data = await response.json();
        
        if (data.success) {
          setProfiles(data.profiles);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      // Reset to original data
      const response = await fetch('http://localhost:5000/api/profiles?limit=20&offset=3');
      const data = await response.json();
      if (data.success) {
        setProfiles(data.profiles);
      }
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(`http://localhost:5000/api/profiles?search=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setProfiles(data.profiles);
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
        <DashNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Community Profiles
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and connect with cybersecurity learners from around the world
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
              />
              {searchLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Top 3 Users */}
        {topProfiles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaTrophy className="w-6 h-6 text-yellow-400" />
              Top Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topProfiles.map((user, index) => (
                <TopUserCard 
                  key={user.id} 
                  user={user} 
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Users Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaEye className="w-6 h-6 text-blue-400" />
            All Users
          </h2>
          
          {profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((user, index) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  rank={user.rank}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
              {searchQuery && (
                <p className="text-gray-500 mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
