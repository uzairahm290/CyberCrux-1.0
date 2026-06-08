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

// ==================== BADGE API ENDPOINTS ====================

// Test endpoint for badge system
router.get('/api/test/badges/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // We are mocking getUserBadges because it's not exported from badgeService.
    const badges = await prisma.userBadge.findMany({
      where: { user_id: parseInt(userId, 10) },
      include: { badge: true }
    });
    res.json({
      success: true,
      userId: userId,
      badgeCount: badges.length,
      badges: badges
    });
  } catch (error) {
    console.error('Test badges error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to update badge icon
router.put('/api/admin/badges/:badgeId/icon', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { iconUrl } = req.body;
    
    if (!iconUrl) {
      return res.status(400).json({ success: false, message: 'Icon URL is required' });
    }
    
    const result = await prisma.badge.update({
      where: { id: parseInt(badgeId, 10) },
      data: { icon: iconUrl }
    });
    
    res.json({ success: true, message: 'Badge icon updated successfully' });
  } catch (error) {
    console.error('Error updating badge icon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to create new badge
router.post('/api/admin/badges', async (req, res) => {
  try {
    const { name, description, icon, badge_type, criteria, points_required, is_active } = req.body;
    
    // Validate required fields
    if (!name || !description || !icon || !badge_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, description, icon, badge_type' 
      });
    }
    
    // Insert badge into database
    const result = await prisma.badge.create({
      data: {
        name,
        description,
        icon,
        badge_type,
        criteria: criteria || {},
        points_reward: points_required || 0,
        is_active: is_active !== undefined ? is_active : true
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Badge created successfully',
      badgeId: result.id 
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to update badge criteria
router.put('/api/admin/badges/:badgeId/criteria', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { criteria } = req.body;
    
    if (!criteria) {
      return res.status(400).json({ success: false, message: 'Criteria is required' });
    }
    
    await prisma.badge.update({
      where: { id: parseInt(badgeId, 10) },
      data: { criteria }
    });
    
    res.json({ success: true, message: 'Badge criteria updated successfully' });
  } catch (error) {
    console.error('Error updating badge criteria:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to update badge (comprehensive)
router.put('/api/admin/badges/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { name, description, icon, badge_type, criteria, points_required, is_active } = req.body;
    
    // Build update data dynamically based on provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (badge_type !== undefined) updateData.badge_type = badge_type;
    if (criteria !== undefined) updateData.criteria = criteria;
    if (points_required !== undefined) updateData.points_reward = points_required;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    await prisma.badge.update({
      where: { id: parseInt(badgeId, 10) },
      data: updateData
    });
    
    res.json({ success: true, message: 'Badge updated successfully' });
  } catch (error) {
    console.error('Error updating badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to delete badge
router.delete('/api/admin/badges/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    
    // Delete the badge (Cascade will handle user_badges)
    await prisma.badge.delete({
      where: { id: parseInt(badgeId, 10) }
    });
    
    res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }
    console.error('Error deleting badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all available badges
router.get('/api/badges', async (req, res) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { created_at: 'desc' }
    });
    
    res.json({
      success: true,
      badges: badges
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch badges' });
  }
});

// Get user's badges
router.get('/api/badges/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userBadges = await prisma.$queryRaw`
      SELECT 
        b.id,
        b.name,
        b.description,
        b.icon,
        b.rarity,
        b.points_reward,
        ub.earned_at,
        ub.progress_data
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${parseInt(userId, 10)}
      ORDER BY ub.earned_at DESC
    `;
    
    res.json({
      success: true,
      badges: userBadges
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user badges' });
  }
});

// Manually trigger badge check for a user (admin only or for testing)
router.post('/api/badges/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventType = 'manual', eventData = {} } = req.body;
    
    await checkAndAwardBadges(parseInt(userId, 10), eventType, eventData);
    
    res.json({
      success: true,
      message: 'Badge check completed'
    });
  } catch (error) {
    console.error('Error checking badges:', error);
    res.status(500).json({ success: false, message: 'Failed to check badges' });
  }
});

// Get badge leaderboard
router.get('/api/badges/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.$queryRaw`
      SELECT 
        u.username,
        COUNT(ub.badge_id)::int as total_badges,
        COUNT(CASE WHEN b.rarity = 'legendary' THEN 1 END)::int as legendary_badges,
        COUNT(CASE WHEN b.rarity = 'epic' THEN 1 END)::int as epic_badges,
        COUNT(CASE WHEN b.rarity = 'rare' THEN 1 END)::int as rare_badges,
        COUNT(CASE WHEN b.rarity = 'common' THEN 1 END)::int as common_badges,
        SUM(b.points_reward)::int as total_badge_points
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN badges b ON ub.badge_id = b.id
      GROUP BY u.id, u.username
      HAVING COUNT(ub.badge_id) > 0
      ORDER BY total_badges DESC, total_badge_points DESC
      LIMIT 50
    `;
    
    res.json({
      success: true,
      leaderboard: leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }))
    });
  } catch (error) {
    console.error('Error fetching badge leaderboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch badge leaderboard' });
  }
});

module.exports = router;