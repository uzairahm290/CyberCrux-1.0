const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');
const { authenticateAdmin, adminRateLimit } = require('../middleware/adminAuthMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_google_api_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const { checkAndAwardBadges } = require('../services/badgeService');
const { notifyNewScenariosAdded } = require('../services/notificationService');
const { safeRecordUserLogin } = require('../services/streakService');

// ==================== PUBLIC PROFILE API ENDPOINTS ====================

// Get public profile by username or user ID
router.get('/api/profile/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is a number (user ID) or string (username)
    const isUserId = !isNaN(identifier);
    
    const user = await prisma.user.findFirst({
      where: isUserId ? { id: parseInt(identifier, 10) } : { username: identifier },
      select: {
        id: true, username: true, email: true, profile_pic: true, created_at: true, country: true, description: true, linkedin_url: true, github_url: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user's practice statistics
    const practiceStats = await prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END)::int as completed_scenarios,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::float as average_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.time_taken END)::int as total_time,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::int as total_points_earned,
        MAX(upp.completed_at) as last_completed
      FROM practice_scenarios ps
      LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ${user.id}
      WHERE ps.is_active = TRUE
    `;
    
    // Get user's streak data
    const streakData = await prisma.userStreak.findMany({
      where: { user_id: user.id }
    });
    
    // Calculate user's rank using same logic as leaderboard (sequential ranking with tie-breaking)
    // Only rank users who have completed at least one scenario
    const rankData = await prisma.$queryRaw`
      SELECT user_rank::int
      FROM (
        SELECT 
          u.id,
          ROW_NUMBER() OVER (
            ORDER BY 
            COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END), 0) DESC,
              COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) DESC,
              AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) DESC,
              MAX(upp.completed_at) ASC
          ) as user_rank
        FROM users u
        LEFT JOIN user_practice_progress upp ON u.id = upp.user_id
        LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
        GROUP BY u.id
        HAVING COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END), 0) > 0
      ) as ranked_users
      WHERE id = ${user.id}
    `;
    
    // Get user's earned badges from database
    const userBadges = await prisma.$queryRaw`
      SELECT 
        b.id,
        b.name,
        b.description,
        b.icon,
        b.rarity,
        b.points_reward,
        ub.earned_at
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${user.id}
      ORDER BY ub.earned_at DESC
    `;
    
    // Calculate level
    const level = Math.floor((practiceStats[0]?.total_points_earned || 0) / 100) + 1;
    
    res.json({
      success: true,
      profile: {
        user: {
          id: user.id,
          username: user.username,
          profile_pic: user.profile_pic,
          created_at: user.created_at,
          country: user.country,
          description: user.description,
          linkedin_url: user.linkedin_url,
          github_url: user.github_url
        },
        stats: {
          rank: rankData[0]?.user_rank || null,
          level: level,
          total_points: practiceStats[0]?.total_points_earned || 0,
          completed_scenarios: practiceStats[0]?.completed_scenarios || 0,
          average_score: Math.round(practiceStats[0]?.average_score || 0),
          current_streak: streakData[0]?.current_streak || 0,
          longest_streak: streakData[0]?.longest_streak || 0,
          total_time: practiceStats[0]?.total_time || 0,
          last_completed: practiceStats[0]?.last_completed
        },
        badges: userBadges
      }
    });
    
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Get all users for profile discovery
router.get('/api/profiles', async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    
    let query = `
      SELECT 
        u.id, u.username, u.profile_pic, u.created_at,
        COALESCE(SUM(upp.score), 0)::int as total_points,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END)::int as completed_scenarios,
        COALESCE(us.current_streak, 0)::int as current_streak
      FROM users u
      LEFT JOIN user_practice_progress upp ON u.id = upp.user_id AND upp.is_completed = TRUE
      LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
      LEFT JOIN user_streaks us ON u.id = us.user_id
    `;
    
    let users;
    if (search) {
      const searchPattern = `%${search}%`;
      users = await prisma.$queryRawUnsafe(`${query} WHERE u.username ILIKE $1 GROUP BY u.id, u.username, u.profile_pic, u.created_at, us.current_streak ORDER BY total_points DESC, completed_scenarios DESC LIMIT $2 OFFSET $3`, searchPattern, limitNum, offsetNum);
    } else {
      users = await prisma.$queryRawUnsafe(`${query} GROUP BY u.id, u.username, u.profile_pic, u.created_at, us.current_streak ORDER BY total_points DESC, completed_scenarios DESC LIMIT $1 OFFSET $2`, limitNum, offsetNum);
    }
    
    // Add level calculation and badge count for each user
    const usersWithExtras = users.map((user, index) => ({
      ...user,
      rank: parseInt(offset) + index + 1,
      level: Math.floor(user.total_points / 100) + 1,
      badge_count: calculateBadgeCount(user)
    }));
    
    res.json({
      success: true,
      profiles: usersWithExtras
    });
    
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profiles' });
  }
});

// Helper function to calculate badge count
function calculateBadgeCount(stats) {
  let badgeCount = 0;
  if (stats.completed_scenarios >= 1) badgeCount++;
  if (stats.completed_scenarios >= 10) badgeCount++;
  if (stats.completed_scenarios >= 25) badgeCount++;
  if (stats.completed_scenarios >= 50) badgeCount++;
  if (stats.completed_scenarios >= 100) badgeCount++;
  if (stats.current_streak >= 7) badgeCount++;
  if (stats.current_streak >= 30) badgeCount++;
  if (stats.total_points >= 1000) badgeCount++;
  // Note: average_score and rank badges would need additional queries
  return badgeCount;
}


module.exports = router;