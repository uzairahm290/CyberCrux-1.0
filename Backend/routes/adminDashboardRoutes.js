const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const { authenticateAdmin } = require('../middleware/adminAuthMiddleware');

// Get overall platform statistics
router.get('/api/admin/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    // Total Users
    const usersCount = await prisma.user.count();
    
    // Active Users (logged in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsersCount = await prisma.userStreak.count({
      where: {
        last_login_date: { gte: sevenDaysAgo }
      }
    });

    // Total Scenarios
    const scenariosCount = await prisma.practiceScenario.count();

    // Total Tools
    const toolsCount = await prisma.tool.count();
    
    // Total completions today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCompletions = await prisma.userPracticeProgress.count({
      where: {
        is_completed: true,
        completed_at: { gte: startOfToday }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers: usersCount,
        activeUsers: activeUsersCount,
        totalScenarios: scenariosCount,
        totalTools: toolsCount,
        todayCompletions: todayCompletions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// Get user growth over time
router.get('/api/admin/dashboard/user-growth', authenticateAdmin, async (req, res) => {
  try {
    const userGrowth = await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
      LIMIT 30
    `;
    
    res.json({ success: true, growth: userGrowth });
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user growth' });
  }
});

// Get recent activity
router.get('/api/admin/dashboard/recent-activity', authenticateAdmin, async (req, res) => {
  try {
    // Get recent completions
    const recentCompletions = await prisma.$queryRaw`
      SELECT 
        upp.id, 
        u.username, 
        ps.title as scenario_title, 
        upp.completed_at,
        'completion' as type
      FROM user_practice_progress upp
      JOIN users u ON upp.user_id = u.id
      JOIN practice_scenarios ps ON upp.scenario_id = ps.id
      WHERE upp.is_completed = true
      ORDER BY upp.completed_at DESC
      LIMIT 5
    `;

    // Get recent signups
    const recentUsers = await prisma.$queryRaw`
      SELECT 
        id, 
        username, 
        created_at,
        'signup' as type
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const activity = [...recentCompletions, ...recentUsers]
      .sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at))
      .slice(0, 10);

    res.json({ success: true, activity });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
  }
});

module.exports = router;