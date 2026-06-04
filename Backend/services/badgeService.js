const { prisma } = require('../config/db');

async function checkAndAwardBadges(userId, eventType, eventData) {
  try {
    const badges = await prisma.badge.findMany({
      where: { is_active: true },
      select: { id: true, name: true, badge_type: true, criteria: true, description: true, icon: true, rarity: true, points_reward: true }
    });
    
    for (const badge of badges) {
      console.log(`🔍 Checking badge: ${badge.name} (ID: ${badge.id}) for user ${userId}`);
      
      const existingBadge = await prisma.userBadge.findFirst({
        where: { user_id: userId, badge_id: badge.id }
      });
      
      if (!existingBadge) {
        const criteria = typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria;
        const shouldAward = await checkBadgeCriteria(userId, badge.badge_type, criteria, eventType, eventData);
        
        if (shouldAward) {
          try {
            await prisma.userBadge.create({
              data: {
                user_id: userId,
                badge_id: badge.id,
                progress_data: eventData || {}
              }
            });
            
            const userInfo = await prisma.user.findUnique({
              where: { id: userId },
              select: { email: true, FullName: true }
            });
            
            console.log(`🔍 User info for badge email:`, { userId, userInfo });
            
            await prisma.userNotification.create({
              data: {
                user_id: userId,
                type: 'badge',
                title: `🏆 New Badge: ${badge.name}`,
                message: `Congratulations! You've earned the "${badge.name}" badge. Keep up the great work!`,
                is_read: false
              }
            });
            
            if (userInfo && userInfo.email) {
              try {
                console.log(`📧 Attempting to send badge earned email to: ${userInfo.email}`);
                const emailService = require('./emailService');
                const { sendBadgeEarnedEmail } = emailService;
                
                await sendBadgeEarnedEmail(
                  userInfo.email,
                  userInfo.FullName,
                  badge.name,
                  badge.description || 'Achievement unlocked!',
                  badge.icon || 'https://img.icons8.com/color/96/000000/trophy.png',
                  badge.rarity || 'common',
                  badge.points_reward || 0
                );
                console.log(`✅ Badge earned email sent successfully to: ${userInfo.email}`);
              } catch (emailError) {
                console.error(`❌ Failed to send badge earned email:`, emailError);
              }
            } else {
              console.log(`⚠️ No user info or email found for user ${userId}, skipping email`);
            }
            
            console.log(`🏆 Awarded badge: ${badge.name} to user ${userId}`);
          } catch (error) {
            console.error(`⚠️ Error awarding badge to user ${userId}:`, error.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

async function checkBadgeCriteria(userId, badgeType, criteria, eventType, eventData) {
  try {
    switch (criteria.type) {
      case 'first_login':
        return eventType === 'login';
        
      case 'streak_days':
        if (eventType === 'streak' && eventData.current_streak >= criteria.days) {
          return true;
        }
        const streakData = await prisma.userStreak.findUnique({
          where: { user_id: userId }
        });
        return (streakData?.current_streak || 0) >= criteria.days;
        
      case 'scenarios_completed':
        const completedCount = await prisma.userPracticeProgress.count({
          where: {
            user_id: userId,
            is_completed: true,
            scenario: { is_active: true }
          }
        });
        return completedCount >= criteria.count;
        
      case 'scenario_category':
        if (criteria.scenario_tags) {
          const catData = await prisma.$queryRaw`
            SELECT COUNT(*)::int as count
            FROM user_practice_progress upp
            INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
            WHERE upp.user_id = ${userId} AND upp.is_completed = TRUE AND ps.is_active = TRUE AND ps.category = ${criteria.category}
            AND ps.tags::jsonb @> ${JSON.stringify(criteria.scenario_tags)}::jsonb
          `;
          return (catData[0]?.count || 0) >= criteria.count;
        } else {
          const basicCatCount = await prisma.userPracticeProgress.count({
            where: {
              user_id: userId,
              is_completed: true,
              scenario: {
                is_active: true,
                category: criteria.category
              }
            }
          });
          return basicCatCount >= criteria.count;
        }
        
      case 'perfect_score':
        if (eventType === 'scenario_completion' && eventData.score === 100) {
          return true;
        }
        const perfectCount = await prisma.userPracticeProgress.count({
          where: {
            user_id: userId,
            is_completed: true,
            score: 100,
            scenario: { is_active: true }
          }
        });
        return perfectCount >= 1;
        
      case 'completion_time':
        return eventType === 'scenario_completion' && eventData.time_taken <= criteria.max_time;
        
      case 'average_score':
        const scoreAgg = await prisma.userPracticeProgress.aggregate({
          where: {
            user_id: userId,
            is_completed: true,
            scenario: { is_active: true }
          },
          _avg: { score: true },
          _count: true
        });
        return (scoreAgg._count || 0) >= criteria.min_scenarios && (scoreAgg._avg.score || 0) >= criteria.score;
        
      case 'mock_tests':
        return false;
        
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking badge criteria:', error);
    return false;
  }
}

async function createBadge(badgeData) {
  try {
    const result = await prisma.badge.create({
      data: {
        name: badgeData.name,
        description: badgeData.description,
        icon: badgeData.icon,
        badge_type: badgeData.badge_type,
        criteria: badgeData.criteria,
        points_reward: badgeData.points_reward,
        rarity: badgeData.rarity,
        is_active: badgeData.is_active !== undefined ? badgeData.is_active : true
      }
    });
    return { success: true, badgeId: result.id };
  } catch (error) {
    console.error('❌ Error creating badge:', error);
    return { success: false, error: error.message };
  }
}

async function updateBadgeIcon(badgeId, iconUrl) {
  try {
    await prisma.badge.update({
      where: { id: parseInt(badgeId, 10) },
      data: { icon: iconUrl }
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating badge icon:', error);
    return { success: false, error: error.message };
  }
}

async function getUserBadges(userId) {
  try {
    const badges = await prisma.userBadge.findMany({
      where: { user_id: parseInt(userId, 10) },
      include: { badge: true },
      orderBy: { earned_at: 'desc' }
    });
    return badges.map(b => ({
      id: b.badge.id,
      name: b.badge.name,
      description: b.badge.description,
      icon: b.badge.icon,
      rarity: b.badge.rarity,
      points_reward: b.badge.points_reward,
      earned_at: b.earned_at
    }));
  } catch (error) {
    console.error('❌ Error fetching user badges:', error);
    return [];
  }
}

async function getBadgeLeaderboard(limit = 10) {
  try {
    const leaderboard = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.profile_pic,
        COUNT(ub.badge_id)::int as total_badges,
        COALESCE(SUM(b.points_reward), 0)::int as badge_points
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN badges b ON ub.badge_id = b.id
      GROUP BY u.id, u.username, u.profile_pic
      HAVING COUNT(ub.badge_id) > 0
      ORDER BY badge_points DESC, total_badges DESC
      LIMIT ${Number(limit)}
    `;
    return leaderboard;
  } catch (error) {
    console.error('❌ Error fetching badge leaderboard:', error);
    return [];
  }
}

module.exports = {
  checkAndAwardBadges,
  checkBadgeCriteria,
  createBadge,
  updateBadgeIcon,
  getUserBadges,
  getBadgeLeaderboard
};
