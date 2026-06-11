const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');
const { authenticateAdmin, adminRateLimit } = require('../middleware/adminAuthMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_google_api_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const { checkAndAwardBadges } = require('../services/badgeService');
const { notifyNewScenariosAdded } = require('../services/notificationService');
const { safeRecordUserLogin } = require('../services/streakService');

// Record user login
router.post('/api/streak/record-login', async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Use the safer login recording function
    console.log(`📊 Recording login for user ${user_id}`);
    await safeRecordUserLogin(null, user_id); // Pass null for connection since it uses prisma now
    console.log(`✅ Login recorded successfully for user ${user_id}`);
    
    // Check for first login badge
    await checkAndAwardBadges(user_id, 'login', { timestamp: new Date() });
    
    // Get updated streak information
    const streakRow = await prisma.userStreak.findUnique({
      where: { user_id: parseInt(user_id, 10) }
    });

    // Check for streak badges
    if (streakRow && streakRow.current_streak) {
      await checkAndAwardBadges(user_id, 'streak', { 
        current_streak: streakRow.current_streak,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Login recorded successfully',
      streak: {
        current_streak: streakRow?.current_streak || 0,
        longest_streak: streakRow?.longest_streak || 0,
        last_login_date: streakRow?.last_login_date || null,
        streak_start_date: streakRow?.streak_start_date || null
      }
    });
  } catch (error) {
    console.error('Error recording login:', error);
    res.status(500).json({ error: 'Failed to record login' });
  }
});

// Get user streak data
router.get('/api/streak/user-streak/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
      
    const streakRow = await prisma.userStreak.findUnique({
      where: { user_id: parseInt(userId, 10) }
    });

    res.json({
      streak: streakRow || {
        current_streak: 0,
        longest_streak: 0,
        last_login_date: null,
        streak_start_date: null
      }
    });
  } catch (error) {
    console.error('Error getting user streak:', error);
    res.status(500).json({ error: 'Failed to get user streak' });
  }
});

// Get practice categories
router.get('/api/practice/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await prisma.practiceCategory.findMany({
      orderBy: { label: 'asc' }
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching practice categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch categories',
      error: error.message 
    });
  }
});

// Admin Authentication Routes
router.post('/api/admin/login', adminRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Check admin credentials (use environment variables)
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (username !== adminUsername || password !== adminPassword) {
      // Increment failed attempts
      const clientIP = req.ip || req.connection.remoteAddress;
      if (!req.app.locals.adminAttempts) {
        req.app.locals.adminAttempts = {};
      }
      if (!req.app.locals.adminAttempts[clientIP]) {
        req.app.locals.adminAttempts[clientIP] = { count: 0, resetTime: Date.now() + 15 * 60 * 1000 };
      }
      req.app.locals.adminAttempts[clientIP].count++;
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate admin JWT token
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'admin_super_secret_key';
    console.log('🔐 Admin login: Using JWT secret:', jwtSecret ? 'Secret set' : 'Using fallback secret');
    
    const adminToken = jwt.sign(
      { 
        username: adminUsername, 
        isAdmin: true,
        loginTime: Date.now()
      },
      jwtSecret,
      { expiresIn: '8h' } // 8 hour session
    );
    
    console.log('🔐 Admin login: Token generated with payload:', {
      username: adminUsername,
      isAdmin: true,
      loginTime: Date.now()
    });
    
    // Set secure HTTP-only cookie
    res.cookie('admin_token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });
    
    // Log successful admin login
    console.log(`🔐 Admin login successful: ${username} from IP: ${req.ip || req.connection.remoteAddress}`);

    res.json({
      success: true, 
      message: 'Admin login successful',
      admin: { username: adminUsername }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.post('/api/admin/logout', (req, res) => {
  try {
    // Clear admin cookie
    res.clearCookie('admin_token');
    
    res.json({ 
      success: true, 
      message: 'Admin logged out successfully' 
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

router.get('/api/admin/verify', authenticateAdmin, (req, res) => {
  console.log('✅ Admin verify endpoint called successfully for:', req.admin.username);
  res.json({ 
    success: true, 
    message: 'Admin token valid',
    admin: req.admin
  });
});

// Get user's category-specific progress for badges
router.get('/api/badges/category-progress', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Get progress for each category
    const categoryProgress = await prisma.$queryRaw`
      SELECT 
        ps.category,
        COUNT(upp.id)::int as completed_count
      FROM practice_scenarios ps
      LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ${userId} AND upp.is_completed = TRUE
      WHERE ps.is_active = TRUE
      GROUP BY ps.category
    `;

    const progress = {};
    categoryProgress.forEach(cat => {
      progress[cat.category] = cat.completed_count;
    });

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error fetching category progress:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category progress' });
  }
});

module.exports = router;