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

// Admin endpoint to send notifications to all users
router.post('/api/admin/notifications/broadcast', authenticateAdmin, async (req, res) => {
  try {
    const { type, title, message } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and message are required'
      });
    }
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true }
    });
    
    // Prepare notifications
    const notifications = users.map(user => ({
      user_id: user.id,
      type: type,
      title: title,
      message: message,
      is_read: false
    }));
    
    // Send notification to all users
    await prisma.userNotification.createMany({
      data: notifications
    });
    
    res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      usersNotified: users.length
    });
    
    console.log(`📢 Admin broadcast: "${title}" sent to ${users.length} users`);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
});
// ==================== NOTIFICATION SYSTEM ====================

// Get user notifications
router.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await prisma.userNotification.findMany({
      where: { user_id: parseInt(userId, 10) },
      orderBy: { created_at: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        created_at: true,
        is_read: true
      }
    });
    
    res.json({ 
      success: true, 
      notifications: notifications.map(n => ({
        ...n,
        created_at: n.created_at ? n.created_at.toISOString() : null
      }))
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await prisma.userNotification.updateMany({
      where: { id: parseInt(id, 10), user_id: parseInt(userId, 10) },
      data: { is_read: true }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});

// Clear all notifications
router.delete('/api/notifications/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await prisma.userNotification.deleteMany({
      where: { user_id: parseInt(userId, 10) }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
});

module.exports = router;