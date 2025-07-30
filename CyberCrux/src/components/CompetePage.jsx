import React, { useState, useEffect } from "react";
import { FiFlag, FiTrendingUp, FiAward, FiUsers, FiTarget } from "react-icons/fi";
import { FaCrown, FaTrophy, FaMedal, FaFire, FaStar } from "react-icons/fa";
import { BiBrain, BiMicrophone, BiLaptop, BiTrendingUp, BiDiamond } from "react-icons/bi";
import hackerImg from "../assets/hacker.png";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { useTheme } from '../ThemeContext';

const leaderboard = [
  { 
    rank: 1, 
    username: "Cic1ad3031", 
    country: "Pakistan", 
    points: 1350, 
    avatar: hackerImg,
    level: 15,
    streak: 28,
    badges: 12,
    recentActivity: "Completed Advanced Pentesting Lab"
  },
  { 
    rank: 3, 
    username: "NoobFighter", 
    country: "India", 
    points: 1320, 
    avatar: hackerImg,
    level: 14,
    streak: 21,
    badges: 10,
    recentActivity: "Aced SOC Analyst Interview"
  },
  { 
    rank: 1, 
    username: "UZII-404", 
    country: "Pakistan", 
    points: 1270, 
    avatar: hackerImg,
    level: 13,
    streak: 18,
    badges: 9,
    recentActivity: "Mastered Web Security Scenarios"
  },
  { 
    rank: 4, 
    username: "ShadowByte", 
    country: "Pakistan", 
    points: 1210,
    level: 12,
    streak: 15,
    badges: 8,
    recentActivity: "Completed Incident Response Lab"
  },
  { 
    rank: 5, 
    username: "bugHunter01", 
    country: "Pakistan", 
    points: 1205,
    level: 12,
    streak: 12,
    badges: 7,
    recentActivity: "Found Critical Vulnerability"
  },
  { 
    rank: 6, 
    username: "0xfailure", 
    country: "Pakistan", 
    points: 1190,
    level: 11,
    streak: 10,
    badges: 6,
    recentActivity: "Completed Malware Analysis"
  },
  { 
    rank: 7, 
    username: "airoverflow", 
    country: "India", 
    points: 1150,
    level: 11,
    streak: 8,
    badges: 6,
    recentActivity: "Aced Network Security Quiz"
  },
  { 
    rank: 8, 
    username: "0xwn0b", 
    country: "Pakistan", 
    points: 1100,
    level: 10,
    streak: 7,
    badges: 5,
    recentActivity: "Completed Cryptography Lab"
  },
  { 
    rank: 9, 
    username: "NCA", 
    country: "Pakistan", 
    points: 1100,
    level: 10,
    streak: 6,
    badges: 5,
    recentActivity: "Mastered Forensics Tools"
  },
  { 
    rank: 10, 
    username: "Ab.afridi101", 
    country: "Pakistan", 
    points: 1080,
    level: 9,
    streak: 5,
    badges: 4,
    recentActivity: "Completed Security Assessment"
  },
  { 
    rank: 11, 
    username: "Error404", 
    country: "Pakistan", 
    points: 1050,
    level: 9,
    streak: 4,
    badges: 4,
    recentActivity: "Finished Basic Pentesting"
  },
];

const stats = [
  { label: "Total Participants", value: "2,847", icon: <FiUsers className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
  { label: "Active This Week", value: "1,234", icon: <FiTrendingUp className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
  { label: "Average Points", value: "856", icon: <FiTarget className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
  { label: "Top Streak", value: "45 days", icon: <FaFire className="w-6 h-6" />, color: "from-orange-500 to-red-500" },
];

const categories = [
  { name: "All", active: true },
  { name: "This Week", active: false },
  { name: "This Month", active: false },
  { name: "All Time", active: false },
];

export default function CompetePage() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState({
    rank: 156,
    points: 2840,
    level: 12,
    streak: 7
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
            <FaTrophy className="w-4 h-4" />
            Global Competition
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Compete with cybersecurity professionals worldwide and climb the ranks
          </p>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <BiTrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div> */}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.name
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 backdrop-blur-xl text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">🏆 Top Performers</h2>
          <div className="flex justify-center items-end gap-4 sm:gap-6 lg:gap-8">
            {leaderboard.slice(0, 3).map((user, idx) => (
              <div
                key={user.rank}
                className={`relative flex flex-col items-center ${
                  idx === 0 ? 'order-2 scale-110 z-20' : idx === 1 ? 'order-1 scale-100 z-10' : 'order-3 scale-100 z-10'
                } transition-all duration-500 hover:scale-105`}
              >
                {/* Podium Base */}
                <div className={`w-full h-4 sm:h-6 rounded-t-2xl ${
                  idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  'bg-gradient-to-r from-amber-600 to-orange-700'
                } shadow-lg`}></div>
                
                {/* User Card */}
                <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl w-full max-w-[200px] ${
                  idx === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30' :
                  idx === 1 ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-400/30' :
                  'bg-gradient-to-br from-amber-600/20 to-orange-700/20 border-amber-500/30'
                }`}>
                  {/* Crown for 1st */}
                  {idx === 0 && (
                    <FaCrown className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-2xl sm:text-3xl drop-shadow-lg animate-bounce" />
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
                        src={user.avatar} 
                        alt={user.username} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" 
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-black' :
                        idx === 1 ? 'bg-gray-300 text-black' :
                        'bg-amber-600 text-white'
                      }`}>
                        {user.level}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <h3 className="font-bold text-center mb-2 text-sm sm:text-base">{user.username}</h3>
                  
                  {/* Country */}
                  <div className="flex items-center justify-center gap-1 text-gray-300 text-xs mb-3">
                    <FiFlag className="w-3 h-3" />
                    {user.country}
                  </div>

                  {/* Points */}
                  <div className="text-center mb-3">
                    <div className="text-2xl sm:text-3xl font-bold text-cyan-300">{user.points}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <FaFire className="w-3 h-3 text-orange-400" />
                      {user.streak}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      {user.badges}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current User Stats */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BiDiamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Your Position</h3>
                <p className="text-gray-300 text-sm">Keep climbing the ranks!</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">#{currentUser.rank}</div>
                <div className="text-xs text-gray-400">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{currentUser.points}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{currentUser.level}</div>
                <div className="text-xs text-gray-400">Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">Global Rankings</h2>
            <p className="text-gray-300 text-sm">Complete leaderboard of all participants</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Rank</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-300">Player</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-300">Level</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-300">Streak</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-300">Badges</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-300">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(3).map((user, idx) => (
                  <tr 
                    key={user.rank} 
                    className={`border-b border-white/5 transition-all duration-200 hover:bg-white/5 ${
                      idx % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank <= 10 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          user.rank <= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                          {user.rank}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || hackerImg} 
                          alt={user.username} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/20" 
                        />
                        <div>
                          <div className="font-semibold">{user.username}</div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <FiFlag className="w-3 h-3" />
                            {user.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm">
                        <BiBrain className="w-3 h-3" />
                        {user.level}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-sm">
                        <FaFire className="w-3 h-3" />
                        {user.streak}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-sm">
                        <FaStar className="w-3 h-3" />
                        {user.badges}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold text-cyan-300">{user.points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Compete?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Start practicing scenarios, complete labs, and ace interviews to climb the leaderboard and become a cybersecurity champion!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <BiBrain className="w-5 h-5" />
                Start Practicing
              </button>
              <button className="bg-white/10 backdrop-blur-xl text-white px-8 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
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
