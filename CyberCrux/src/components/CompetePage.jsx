import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFlag, FiTrendingUp, FiAward, FiUsers, FiTarget } from "react-icons/fi";
import { FaCrown, FaTrophy, FaMedal, FaFire, FaStar } from "react-icons/fa";
import { BiBrain, BiMicrophone, BiLaptop, BiTrendingUp, BiDiamond } from "react-icons/bi";
import hackerImg from "../assets/hacker.png";
import DashNav from "./DashNav";
import Footer from "./Footer";
import CountryFlag from "./CountryFlag";
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';

export default function CompetePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    rank: 0,
    points: 0,
    level: 1,
    streak: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

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
    const fetchUserStats = async () => {
      if (!user) return;
      try {
        const statsResponse = await fetch('http://localhost:5000/api/practice/stats', {
          credentials: 'include'
        });
        const statsData = await statsResponse.json();
        
        // Fetch streak data separately
        const streakResponse = await fetch(`http://localhost:5000/api/streak/user-streak/${user.id}`);
        const streakData = await streakResponse.json();
        
        if (statsData.success) {
          const stats = statsData.data.overview;
          const totalPoints = stats.total_points_earned || 0;
          const calculatedLevel = Math.floor(totalPoints / 100) + 1;
          setUserStats({
            rank: stats.rank || 1,
            points: totalPoints,
            level: calculatedLevel,
            streak: streakData.streak?.current_streak || 0
          });
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };
    fetchUserStats();
  }, [user]);

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/practice/leaderboard');
        const data = await response.json();
        if (data.success) {
          // Add calculated level for each user
          const leaderboardWithLevel = data.data.map(user => ({
            ...user,
            level: Math.floor((user.total_points || 0) / 100) + 1
          }));
          setLeaderboard(leaderboardWithLevel);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <FaTrophy className="w-3 h-3 sm:w-4 sm:h-4" />
            Global Competition
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
            Compete with cybersecurity professionals worldwide and climb the ranks
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8 sm:mb-12 px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">🏆 Top Performers</h2>
          
          {/* Mobile Layout - Vertical Stack */}
          <div className="block sm:hidden space-y-4">
            {leaderboard.slice(0, 3).map((userItem, idx) => (
              <div
                key={userItem.user_rank}
                className={`relative flex items-center gap-4 p-4 rounded-2xl border border-white/20 shadow-lg ${
                  idx === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30' :
                  idx === 1 ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-400/30' :
                  'bg-gradient-to-br from-amber-600/20 to-orange-700/20 border-amber-500/30'
                }`}
              >
                {/* Rank Badge */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  idx === 0 ? 'bg-yellow-400 text-black' :
                  idx === 1 ? 'bg-gray-300 text-black' :
                  'bg-amber-600 text-white'
                }`}>
                  {idx + 1}
                </div>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`relative rounded-full border-2 ${
                    idx === 0 ? 'border-yellow-400' :
                    idx === 1 ? 'border-gray-300' :
                    'border-amber-500'
                  } shadow-lg`}>
                    <img
                      src={userItem.profile_pic ? userItem.profile_pic : (user && user.id === userItem.id && profilePic ? profilePic : hackerImg)}
                      alt={userItem.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-400 text-black' :
                      idx === 1 ? 'bg-gray-300 text-black' :
                      'bg-amber-600 text-white'
                    }`}>
                      {userItem.level}
                    </div>
                  </div>
                  {idx === 0 && (
                    <FaCrown className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300 text-xl drop-shadow-lg animate-bounce" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-bold text-lg mb-1 cursor-pointer hover:text-blue-400 transition-all duration-200"
                    onClick={() => handleUsernameClick(userItem.username)}
                    title="Click to view profile"
                  >
                    {userItem.username}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <CountryFlag 
                      country={userItem.country} 
                      size="14px" 
                      height="10px"
                      title={userItem.country}
                    />
                    <span>{userItem.country}</span>
                  </div>

                  <div className="text-2xl font-bold text-cyan-300 mb-2">{userItem.total_points} points</div>
                  
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                      <FaFire className="w-3 h-3" />
                      {userItem.current_streak}
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs">
                      <FaStar className="w-3 h-3" />
                      {userItem.badges}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout - Horizontal Podium */}
          <div className="hidden sm:flex justify-center items-end gap-4 sm:gap-4 md:gap-6 lg:gap-8">
            {leaderboard.slice(0, 3).map((userItem, idx) => (
              <div
                key={userItem.user_rank}
                className={`relative flex flex-col items-center ${
                  idx === 0 ? 'order-2 scale-110 z-20' : idx === 1 ? 'order-1 scale-100 z-10' : 'order-3 scale-100 z-10'
                } transition-all duration-500 hover:scale-105`}
              >
                {/* Podium Base */}
                <div className={`w-full h-4 md:h-6 rounded-t-2xl ${
                  idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  'bg-gradient-to-r from-amber-600 to-orange-700'
                } shadow-lg`}></div>
                
                {/* User Card */}
                <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl w-full max-w-[160px] md:max-w-[180px] lg:max-w-[200px] ${
                  idx === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30' :
                  idx === 1 ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-400/30' :
                  'bg-gradient-to-br from-amber-600/20 to-orange-700/20 border-amber-500/30'
                }`}>
                  {/* Crown for 1st */}
                  {idx === 0 && (
                    <FaCrown className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-2xl md:text-3xl drop-shadow-lg animate-bounce" />
                  )}
                  
                  {/* Rank Badge */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx === 0 ? 'bg-yellow-400 text-black' :
                    idx === 1 ? 'bg-gray-300 text-black' :
                    'bg-amber-600 text-white'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className={`relative rounded-full border-4 ${
                      idx === 0 ? 'border-yellow-400' :
                      idx === 1 ? 'border-gray-300' :
                      'border-amber-500'
                    } shadow-lg`}>
                      <img
                        src={userItem.profile_pic ? userItem.profile_pic : (user && user.id === userItem.id && profilePic ? profilePic : hackerImg)}
                        alt={userItem.username}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-black' :
                        idx === 1 ? 'bg-gray-300 text-black' :
                        'bg-amber-600 text-white'
                      }`}>
                        {userItem.level}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <h3 
                    className="font-bold text-center mb-2 text-sm md:text-base cursor-pointer hover:text-blue-400 transition-all duration-200"
                    onClick={() => handleUsernameClick(userItem.username)}
                    title="Click to view profile"
                  >
                    {userItem.username}
                  </h3>
                  
                  {/* Country */}
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-xs mb-3">
                    <CountryFlag 
                      country={userItem.country} 
                      size="14px" 
                      height="10px"
                      title={userItem.country}
                    />
                    <span>{userItem.country}</span>
                  </div>

                  {/* Points */}
                  <div className="text-center mb-3">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300">{userItem.total_points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <FaFire className="w-3 h-3 text-orange-400" />
                      {userItem.current_streak}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      {userItem.badges}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User Stats */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20 mx-2">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BiDiamond className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-lg">Your Position</h3>
                <p className="text-gray-300 text-xs sm:text-sm">Keep climbing the ranks!</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
                  {userStats.points > 0 ? `#${userStats.rank}` : 'Unranked'}
                </div>
                <div className="text-xs text-gray-400">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{userStats.points}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{userStats.level}</div>
                <div className="text-xs text-gray-400">Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">{userStats.streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden mx-2">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold">Global Rankings</h2>
            <p className="text-gray-300 text-xs sm:text-sm">Complete leaderboard of all participants</p>
          </div>
          
          <div className="w-full">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-3 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Rank</th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-3 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Player</th>
                  <th className="text-center py-3 sm:py-4 px-1 sm:px-2 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Level</th>
                  <th className="text-center py-3 sm:py-4 px-1 sm:px-2 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Streak</th>
                  <th className="text-center py-3 sm:py-4 px-1 sm:px-2 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Badges</th>
                  <th className="text-right py-3 sm:py-4 px-2 sm:px-3 md:px-6 font-semibold text-gray-300 text-xs sm:text-sm">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((userItem, idx) => (
                  <tr 
                    key={userItem.user_rank} 
                    className={`border-b border-white/5 transition-all duration-200 hover:bg-white/5 ${
                      idx % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                    }`}
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-3 md:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                          userItem.user_rank <= 10 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          userItem.user_rank <= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          {userItem.user_rank}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-3 md:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={userItem.profile_pic ? userItem.profile_pic : (user && user.id === userItem.id && profilePic ? profilePic : hackerImg)}
                          alt={userItem.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/20 hover:border-blue-400/50 scale-105 transition-all duration-200" 
                        />
                        <div>
                          <div 
                            className="font-semibold text-[10px] sm:text-sm cursor-pointer hover:text-blue-400 transition-all duration-200"
                            onClick={() => handleUsernameClick(userItem.username)}
                            title="Click to view profile"
                          >
                            {userItem.username}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs">
                            <CountryFlag 
                              country={userItem.country} 
                              size="12px" 
                              height="8px"
                              title={userItem.country}
                            />
                            <span className="hidden sm:inline">{userItem.country}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-1 sm:px-2 md:px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-1 sm:px-2 py-1 rounded-full text-xs sm:text-sm">
                        <BiBrain className="w-2 h-2 sm:w-3 sm:h-3" />
                        {userItem.level}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-1 sm:px-2 md:px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-1 sm:px-2 py-1 rounded-full text-xs sm:text-sm">
                        <FaFire className="w-2 h-2 sm:w-3 sm:h-3" />
                        {userItem.current_streak}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-1 sm:px-2 md:px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-1 sm:px-2 py-1 rounded-full text-xs sm:text-sm">
                        <FaStar className="w-2 h-2 sm:w-3 sm:h-3" />
                        {userItem.badges}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-3 md:px-6 text-right">
                      <div className="font-bold text-cyan-300 text-xs sm:text-sm">{userItem.total_points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 sm:mt-12 text-center px-2">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 sm:p-8 border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Compete?</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Start practicing scenarios, complete labs, and ace interviews to climb the leaderboard and become a cybersecurity champion!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
                <BiBrain className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Practicing
              </button>
              <button className="bg-white/10 backdrop-blur-xl text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                View Challenges
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
