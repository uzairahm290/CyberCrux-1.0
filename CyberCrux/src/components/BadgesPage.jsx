import React, { useState, useEffect } from 'react';
import { FaMedal, FaTrophy, FaStar, FaFire, FaBrain, FaShieldAlt, FaCode, FaNetworkWired, FaLock, FaEye, FaBug, FaUserSecret, FaRocket, FaCrown, FaGem, FaCheckCircle, FaClock, FaTimes, FaFilter } from 'react-icons/fa';
import { BiTargetLock, BiTime, BiCheckCircle, BiXCircle } from 'react-icons/bi';
import DashNav from './DashNav';
import Footer from './Footer';

export default function BadgesPage() {
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    scenariosCompleted: 0,
    streakDays: 0,
    rank: 'Unranked',
    level: 1
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all badges from platform
      const badgesResponse = await fetch('http://localhost:5000/api/badges', {
        credentials: 'include'
      });
      const badgesData = await badgesResponse.json();
      
      if (badgesData.success) {
        setAllBadges(badgesData.badges);
        console.log('All badges loaded:', badgesData.badges); // Debug log
      }

      // Fetch user's earned badges - try multiple approaches
      let userBadgesData = null;
      
      // First try to get current user info
      try {
        const authResponse = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        const authData = await authResponse.json();
        console.log('Auth response:', authData); // Debug log
        
        if (authData.success && authData.user) {
          // Try with actual user ID
          const userBadgesResponse = await fetch(`http://localhost:5000/api/badges/user/${authData.user.id}`, {
            credentials: 'include'
          });
          userBadgesData = await userBadgesResponse.json();
          console.log('User badges response (with user ID):', userBadgesData); // Debug log
        }
      } catch (error) {
        console.log('Error with auth endpoint:', error);
      }
      
      // If that fails, try the 'me' endpoint
      if (!userBadgesData || !userBadgesData.success) {
        try {
          const userBadgesResponse = await fetch('http://localhost:5000/api/badges/user/me', {
            credentials: 'include'
          });
          userBadgesData = await userBadgesResponse.json();
          console.log('User badges response (me):', userBadgesData); // Debug log
        } catch (error) {
          console.log('Error with /me endpoint:', error);
        }
      }
      
      if (userBadgesData && userBadgesData.success) {
        setUserBadges(userBadgesData.badges);
        console.log('User badges set successfully:', userBadgesData.badges); // Debug log
      } else {
        console.log('Failed to load user badges:', userBadgesData);
        setUserBadges([]); // Set empty array if failed
        
        // TEMPORARY: For testing, create some dummy earned badges
        if (allBadges.length > 0) {
          const dummyEarnedBadges = allBadges.slice(0, 2).map(badge => ({
            id: badge.id,
            badge_id: badge.id,
            user_id: 1,
            earned_at: new Date().toISOString(),
            points_earned: badge.points_reward
          }));
          console.log('Setting dummy earned badges for testing:', dummyEarnedBadges);
          setUserBadges(dummyEarnedBadges);
        }
      }

      // Fetch user stats
      const statsResponse = await fetch('http://localhost:5000/api/practice/stats', {
        credentials: 'include'
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setUserStats({
          totalPoints: statsData.data.totalPoints || 0,
          scenariosCompleted: statsData.data.totalCompleted || 0,
          streakDays: statsData.data.streakDays || 0,
          rank: statsData.data.rank || 'Unranked',
          level: statsData.data.level || 1
        });
      }

    } catch (error) {
      console.error('Error fetching badges data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isBadgeEarned = (badgeId) => {
    return userBadges.some(userBadge => userBadge.id === badgeId);
  };

  const getUserBadge = (badgeId) => {
    return userBadges.find(userBadge => userBadge.id === badgeId);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'common': 'from-gray-400 to-gray-600',
      'rare': 'from-blue-400 to-blue-600',
      'epic': 'from-purple-400 to-purple-600',
      'legendary': 'from-yellow-400 to-orange-600'
    };
    return colors[rarity] || 'from-gray-400 to-gray-600';
  };

  const getRarityLabel = (rarity) => {
    const labels = {
      'common': 'Common',
      'rare': 'Rare',
      'epic': 'Epic',
      'legendary': 'Legendary'
    };
    return labels[rarity] || 'Common';
  };

  const getBadgeTypeIcon = (badgeType) => {
    const icons = {
      'streak': FaFire,
      'category': FaShieldAlt,
      'scenario': FaCode,
      'points': FaStar,
      'special': FaCrown,
      'time_based': FaClock,
      'achievement': FaTrophy,
      'milestone': FaGem,
      'skill': FaBrain,
      'challenge': FaRocket
    };
    return icons[badgeType] || FaMedal;
  };

  const getBadgeTypeLabel = (badgeType) => {
    const labels = {
      'streak': 'Streak',
      'category': 'Category',
      'scenario': 'Scenario',
      'points': 'Points',
      'special': 'Special',
      'time_based': 'Time-Based',
      'achievement': 'Achievement',
      'milestone': 'Milestone',
      'skill': 'Skill',
      'challenge': 'Challenge'
    };
    
    // If we have a label for this type, use it
    if (labels[badgeType]) {
      return labels[badgeType];
    }
    
    // If badge_type is null/undefined, return 'General'
    if (!badgeType) {
      return 'General';
    }
    
    // For unknown types, capitalize the first letter and format nicely
    return badgeType.charAt(0).toUpperCase() + badgeType.slice(1).replace(/_/g, ' ');
  };

  const filteredBadges = selectedCategory === 'all' 
    ? allBadges 
    : allBadges.filter(badge => badge.badge_type === selectedCategory);

  const openBadgeModal = (badge) => {
    setSelectedBadge(badge);
    setShowModal(true);
  };

  const closeBadgeModal = () => {
    setShowModal(false);
    setSelectedBadge(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />


      <div className="p-6">
        <div className="max-w-7xl mx-auto">
                     {/* Header */}
           <div className="relative mb-12">             
             <div className="text-center">
               <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                 Achievement Badges
               </h1>
               <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                 Unlock exclusive badges by mastering cybersecurity challenges, maintaining streaks, and demonstrating your expertise. 
                 <span className="block mt-2 text-lg text-blue-400">Every achievement tells a story of your hacking journey!</span>
               </p>
               
               {/* Badge Progress Summary */}
               <div className="mt-8 inline-flex items-center gap-6 bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20">
                 <div className="text-center">
                   <div className="text-3xl font-bold text-green-400">{userBadges.length}</div>
                   <div className="text-sm text-gray-400">Badges Earned</div>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-blue-400">{allBadges.length}</div>
                   <div className="text-sm text-gray-400">Total Available</div>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-yellow-400">
                     {allBadges.length > 0 ? Math.round((userBadges.length / allBadges.length) * 100) : 0}%
                   </div>
                   <div className="text-sm text-gray-400">Completion</div>
                 </div>
               </div>
             </div>
           </div>

                                {/* Filters Section */}
           <div className="mb-8">
             <div className="flex items-center justify-center gap-4">
               <button
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 border font-medium ${
                   showFilters 
                     ? 'bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-lg shadow-blue-500/20' 
                     : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                 }`}
               >
                 <FaFilter className={`text-lg transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                 <span>{showFilters ? 'Hide Filters' : 'Filter Badges'}</span>
               </button>
               
                               {showFilters && (
                  <div className="flex gap-3">
                    <div className="relative">
                      <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 pr-12 cursor-pointer hover:bg-white/20 hover:border-white/40"
                      >
                        <option value="all" className="bg-gray-800 text-white">All Categories</option>
                        {(() => {
                          // Get unique badge types from actual data
                          const uniqueTypes = [...new Set(allBadges.map(badge => badge.badge_type))];
                          console.log('Available badge types:', uniqueTypes); // Debug log
                          return uniqueTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-800 text-white">
                              {getBadgeTypeLabel(type)} Badges
                            </option>
                          ));
                        })()}
                      </select>
                      
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {/* Selected value display */}
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
           </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => {
              const IconComponent = getBadgeTypeIcon(badge.badge_type);
              const earned = isBadgeEarned(badge.id);
              const userBadge = getUserBadge(badge.id);
              
              return (
                <div
                  key={badge.id}
                  className={`group relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    earned ? 'opacity-100' : 'opacity-70'
                  }`}
                  onClick={() => openBadgeModal(badge)}
                >
                  {/* Badge Image */}
                  <div className="relative">
                    <div className="w-30 h-30 mx-auto relative">
                      {/* Badge Background */}
                      <div className={` flex items-center justify-center`}>
                        {badge.icon ? (
                          <img 
                            src={badge.icon} 
                            alt={badge.name}
                            className="w-35 h-35 object-contain rounded-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <IconComponent className="text-3xl text-white" style={{ display: badge.icon ? 'none' : 'block' }} />
                      </div>
                      
                                         {/* Achievement Checkmark */}
                   {earned && (
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                       <FaCheckCircle className="text-white text-sm" />
                     </div>
                   )}
                   
                   
                    </div>
                  </div>

                  {/* Badge Info */}
                  <div className="text-center mt-3">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2">{badge.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">{badge.description}</p>
                    
                    {/* Rarity Badge */}
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                      {getRarityLabel(badge.rarity)}: {badge.rarity === 'common' ? '20.5%' : 
                                                       badge.rarity === 'rare' ? '8.4%' : 
                                                       badge.rarity === 'epic' ? '3.1%' : '1.3%'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

                                {/* Achievement Summary */}
           <div className="mt-12">
             <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
               <h2 className="text-2xl font-bold mb-6 text-center">Your Achievement Progress</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {(() => {
                   // Get unique badge types from actual data
                   const uniqueTypes = [...new Set(allBadges.map(badge => badge.badge_type))];
                   const colors = ['blue', 'green', 'purple', 'yellow', 'orange', 'pink', 'indigo', 'teal'];
                   
                   return uniqueTypes.slice(0, 8).map((type, index) => {
                     const count = userBadges.filter(b => b.badge_type === type).length;
                     const color = colors[index % colors.length];
                     return (
                       <div key={type} className="text-center">
                         <div className={`text-3xl font-bold text-${color}-400`}>
                           {count}
                         </div>
                         <div className="text-sm text-gray-300">{getBadgeTypeLabel(type)} Badges</div>
                       </div>
                     );
                   });
                 })()}
               </div>
             </div>
           </div>
        </div>
      </div>

                    {/* Badge Detail Modal */}
       {showModal && selectedBadge && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 ease-out"
           onClick={closeBadgeModal}
         >
           <div 
             className="bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-indigo-900/95 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 max-w-lg w-full mx-4 shadow-2xl shadow-blue-500/20 transform transition-all duration-300 ease-out scale-100 opacity-100"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-2xl font-bold text-white truncate">{selectedBadge.name}</h2>
               <button
                 onClick={closeBadgeModal}
                 className="group w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
               >
                 <FaTimes className="text-white group-hover:text-red-400 transition-colors duration-300" />
               </button>
             </div>

             {/* Badge Image & Status */}
             <div className="text-center mb-4">
               <div className="relative inline-block">
                 <div className={` flex items-center justify-center`}>
                   {selectedBadge.icon ? (
                     <img 
                       src={selectedBadge.icon} 
                       alt={selectedBadge.name}
                       className="w-25 h-25 object-contain rounded-full"
                       onError={(e) => {
                         e.target.style.display = 'none';
                         e.target.nextSibling.style.display = 'block';
                       }}
                     />
                   ) : null}
                   {(() => {
                     const IconComponent = getBadgeTypeIcon(selectedBadge.badge_type);
                     return <IconComponent className="text-4xl text-white" style={{ display: selectedBadge.icon ? 'none' : 'block' }} />;
                   })()}
                 </div>
                 
                 {/* Achievement Status */}
                 {isBadgeEarned(selectedBadge.id) ? (
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                     <FaCheckCircle className="text-white text-sm" />
                   </div>
                 ) : null}
               </div>
               
               {/* Status Text */}
               <div className="mt-3">
                 {isBadgeEarned(selectedBadge.id) ? (
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                     <FaCheckCircle className="text-green-400 text-sm" />
                     <span className="text-green-400 font-semibold text-sm">ACHIEVED!</span>
                   </div>
                 ) : (
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                     <FaClock className="text-blue-400 text-sm" />
                     <span className="text-blue-400 font-semibold text-sm">Available</span>
                   </div>
                 )}
               </div>
             </div>

             {/* Badge Info */}
             <div className="space-y-3 mb-4">
               {/* Description */}
               <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                 <p className="text-gray-300 text-sm leading-relaxed">{selectedBadge.description}</p>
               </div>

               {/* Type & Rarity */}
               <div className="flex gap-2">
                 <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                   selectedBadge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                   selectedBadge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                   selectedBadge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                   'bg-gray-500/20 text-gray-300'
                 }`}>
                   {getRarityLabel(selectedBadge.rarity)}
                 </span>
                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                   {getBadgeTypeLabel(selectedBadge.badge_type)}
                 </span>
               </div>

               {/* Points Reward */}
               <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 text-center">
                 <div className="text-2xl font-bold text-yellow-400">+{selectedBadge.points_reward} Points</div>
               </div>

               {/* Earned Date (if earned) */}
               {isBadgeEarned(selectedBadge.id) && getUserBadge(selectedBadge.id)?.earned_at && (
                 <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 text-center">
                   <div className="text-green-400 font-medium text-sm mb-1">Earned On</div>
                   <div className="text-green-300 text-sm">
                     {new Date(getUserBadge(selectedBadge.id).earned_at).toLocaleDateString('en-US', {
                       year: 'numeric',
                       month: 'short',
                       day: 'numeric'
                     })}
                   </div>
                 </div>
               )}
             </div>

             {/* Close Button */}
             <div className="flex justify-center">
               <button
                 onClick={closeBadgeModal}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       )}



      {/* CSS for Text Clipping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      <Footer />
    </div>
  );
}
