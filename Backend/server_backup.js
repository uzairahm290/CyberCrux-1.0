require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { sendWelcomeEmail, sendVerificationEmail } = require('./services/emailService');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const session = require('express-session');
const { pool, executeQuery } = require('./config/db');
const authenticateToken = require('./middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI for chatbot
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_google_api_key');

const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Uanova7i@',
  database: process.env.DB_DATABASE || 'cybercrux'
};


// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Security headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict transport security (for production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Increase request body size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cybercrux_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('❌ Admin auth failed: No token provided');
      return res.status(401).json({ success: false, message: 'Admin access denied' });
    }

    console.log('🔍 Admin auth: Token found, verifying...');
    
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin_super_secret_key');
    
    console.log('🔍 Admin auth: Token decoded:', { 
      username: decoded.username, 
      isAdmin: decoded.isAdmin, 
      loginTime: decoded.loginTime 
    });
    
    if (!decoded.isAdmin) {
      console.log('❌ Admin auth failed: isAdmin flag missing');
      return res.status(403).json({ success: false, message: 'Admin privileges required' });
    }

    console.log('✅ Admin auth successful for:', decoded.username);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
};

// Rate limiting middleware for admin routes
const adminRateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!req.app.locals.adminAttempts) {
    req.app.locals.adminAttempts = {};
  }
  
  if (!req.app.locals.adminAttempts[clientIP]) {
    req.app.locals.adminAttempts[clientIP] = { count: 0, resetTime: now + 15 * 60 * 1000 }; // 15 minutes
  }
  
  if (now > req.app.locals.adminAttempts[clientIP].resetTime) {
    req.app.locals.adminAttempts[clientIP] = { count: 0, resetTime: now + 15 * 60 * 1000 };
  }
  
  if (req.app.locals.adminAttempts[clientIP].count >= 5) { // Max 5 attempts per 15 minutes
    return res.status(429).json({ 
      success: false, 
      message: 'Too many login attempts. Please try again later.' 
    });
  }
  
  next();
};


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

app.use('/api/books', require('./routes/bookRoutes'));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation using validator library
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Length validation
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Name must be between 1 and 100 characters' });
  }

  if (!validator.isLength(email, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Email must be between 1 and 100 characters' });
  }

  if (!validator.isLength(message, { min: 1, max: 2000 })) {
    return res.status(400).json({ success: false, message: 'Message must be between 1 and 2000 characters' });
  }

  // Email format validation using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }

  // Sanitize inputs using sanitize-html
  const sanitizedName = sanitizeHtml(name, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {}, // No attributes allowed
    disallowedTagsMode: 'recursiveEscape'
  }).trim();

  const sanitizedEmail = sanitizeHtml(email, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  }).trim();

  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['br', 'p'], // Allow basic formatting
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  }).trim();

  // Re-validate after sanitization
  if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
    return res.status(400).json({ success: false, message: 'Invalid input detected' });
  }

  // Rate limiting (basic implementation)
  const clientIP = req.ip || req.connection.remoteAddress;
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'contact.cybercrux@gmail.com',
        pass: 'mfca gvba beyd tsru'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contact.cybercrux@gmail.com',
      subject: `New Contact Form Message from ${sanitizedName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage}</p>
        <hr>
        <p><em>This message was sent from the CyberCrux contact form.</em></p>
        <p><strong>IP Address:</strong> ${clientIP}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Test endpoint to check database and table structure
app.get('/api/test/database', async (req, res) => {
  try {
    // Test database connection
    const conn = await pool.getConnection();
    console.log('✅ Database connection test successful');
    
    // Check table structure
    const [columns] = await conn.execute('DESCRIBE users');
    console.log('📋 Users table structure:', columns);
    
    // Check if google_id column exists
    const hasGoogleId = columns.some(col => col.Field === 'google_id');
    console.log('🔍 google_id column exists:', hasGoogleId);
    
    // Count users
    const [users] = await conn.execute('SELECT COUNT(*) as count FROM users');
    console.log('👥 Total users:', users[0].count);
    
    conn.release();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      tableStructure: columns,
      hasGoogleId: hasGoogleId,
      userCount: users[0].count
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Test endpoint to test account deletion email
app.post('/api/test/account-deletion-email', async (req, res) => {
  try {
    const { email, fullName, username } = req.body;
    
    if (!email || !fullName || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, fullName, and username are required'
      });
    }
    
    console.log('🧪 Testing account deletion email with data:', {
      email, fullName, username
    });
    
    // Test email service import
    console.log('🧪 Testing email service import...');
    const emailService = require('./services/emailService');
    console.log('🧪 Email service imported:', Object.keys(emailService));
    
    const { sendAccountDeletionEmail } = emailService;
    console.log('🧪 sendAccountDeletionEmail function type:', typeof sendAccountDeletionEmail);
    
    const result = await sendAccountDeletionEmail(
      email,
      fullName,
      username
    );
    
    console.log('🧪 Account deletion email result:', result);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Account deletion email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send account deletion email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Account deletion email test failed:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Account deletion email test failed',
      error: error.message
    });
  }
});

// Test endpoint to test badge earned email
app.post('/api/test/badge-email', async (req, res) => {
  try {
    const { email, fullName, badgeName, badgeDescription, badgeIcon, badgeRarity, pointsEarned } = req.body;
    
    if (!email || !fullName || !badgeName) {
      return res.status(400).json({
        success: false,
        message: 'Email, fullName, and badgeName are required'
      });
    }
    
    console.log('🧪 Testing badge email with data:', {
      email, fullName, badgeName, badgeDescription, badgeIcon, badgeRarity, pointsEarned
    });
    
    // Test email service import
    console.log('🧪 Testing email service import...');
    const emailService = require('./services/emailService');
    console.log('🧪 Email service imported:', Object.keys(emailService));
    
    const { sendBadgeEarnedEmail } = emailService;
    console.log('🧪 sendBadgeEarnedEmail function type:', typeof sendBadgeEarnedEmail);
    
    const result = await sendBadgeEarnedEmail(
      email,
      fullName,
      badgeName,
      badgeDescription || 'Test badge description',
      badgeIcon || 'https://img.icons8.com/color/96/000000/trophy.png',
      badgeRarity || 'common',
      pointsEarned || 100
    );
    
    console.log('🧪 Badge email result:', result);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Badge earned email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send badge earned email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Badge email test failed:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Badge email test failed',
      error: error.message
    });
  }
});


// ==================== PRACTICE API ENDPOINTS ====================

// ==================== SIMPLE TRYHACKME STYLE API ====================
// Only fill-in-blank questions, no complex types

// Get all practice scenarios
app.get('/api/practice/scenarios', async (req, res) => {
  try {
    const [scenarios] = await pool.execute(`
      SELECT 
        id, title, category, difficulty, time_estimate, 
        questions_count, points, completion_rate, likes, views,
        description, short_description, is_featured, is_active, file_url, tags
      FROM practice_scenarios 
      WHERE is_active = TRUE 
      ORDER BY difficulty DESC, points DESC
    `);

    // Get learning resources for each scenario
    const scenariosWithResources = await Promise.all(scenarios.map(async (scenario) => {
      const [resources] = await pool.execute(
        'SELECT id, title, url, type, description FROM learning_resources WHERE scenario_id = ?',
        [scenario.id]
      );

      return {
        ...scenario,
        learning_resources: resources
      };
    }));
    
    res.json({
      success: true,
      data: scenariosWithResources
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ message: 'Failed to fetch scenarios' });
  }
});

// Get specific scenario with questions
app.get('/api/practice/scenarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get scenario details
    const [scenarios] = await pool.execute(
      'SELECT id, title, category, difficulty, time_estimate, questions_count, points, completion_rate, likes, views, description, short_description, is_featured, is_active, file_url, tags FROM practice_scenarios WHERE id = ? AND is_active = TRUE',
      [id]
    );
    
    if (scenarios.length === 0) {
      return res.status(404).json({ message: 'Scenario not found' });
    }
    
    const scenario = scenarios[0];
    
    // Get questions for this scenario
    const [questions] = await pool.execute(
      'SELECT * FROM practice_questions WHERE scenario_id = ? ORDER BY question_order',
      [id]
    );
    
    // Get learning resources for this scenario
    const [resources] = await pool.execute(
      'SELECT id, title, url, type, description FROM learning_resources WHERE scenario_id = ?',
      [id]
    );
    
    const formattedScenario = {
      ...scenario,
      learning_resources: resources,
      questions: questions
    };
    
    res.json({
      success: true,
      data: formattedScenario
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ message: 'Failed to fetch scenario' });
  }
});

// Get user progress
app.get('/api/practice/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [progress] = await pool.execute(`
      SELECT 
        upp.id,
        upp.scenario_id,
        upp.score,
        upp.max_score,
        upp.is_completed,
        upp.completed_at,
        upp.time_taken,
        ps.title,
        ps.category,
        ps.difficulty,
        ps.points as scenario_points
      FROM user_practice_progress upp
      JOIN practice_scenarios ps ON upp.scenario_id = ps.id
      WHERE upp.user_id = ?
      ORDER BY upp.completed_at DESC
    `, [userId]);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Submit answers and get score (simple fill-in-blank scoring)
app.post('/api/practice/submit-answers', authenticateToken, async (req, res) => {
  try {
    const { scenarioId, answers } = req.body;
    const userId = req.user.id;

    if (!scenarioId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Get questions and correct answers
    const [questions] = await pool.execute(
      'SELECT id, correct_answer, points FROM practice_questions WHERE scenario_id = ? ORDER BY question_order',
      [scenarioId]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this scenario' });
    }

    // Simple scoring - exact match (case-insensitive)
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index] || '';
      const correctAnswer = question.correct_answer;
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      if (isCorrect) {
        totalScore += question.points;
      }
      
      maxScore += question.points;
      
      results.push({
        questionId: question.id,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      });
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);

    // Check if user has already completed this scenario
    const [existingProgress] = await pool.execute(
      'SELECT is_completed, score FROM user_practice_progress WHERE user_id = ? AND scenario_id = ?',
      [userId, scenarioId]
    );

    let pointsToAward = 0;
    let isNewCompletion = false;

    if (existingProgress.length === 0) {
      // First time completing this scenario
      isNewCompletion = true;
      pointsToAward = totalScore;
      
      // Insert new progress
    await pool.execute(`
      INSERT INTO user_practice_progress (user_id, scenario_id, score, max_score, is_completed, completed_at)
      VALUES (?, ?, ?, ?, TRUE, NOW())
    `, [userId, scenarioId, totalScore, maxScore]);
    } else if (!existingProgress[0].is_completed) {
      // User was working on it but hadn't completed it before
      isNewCompletion = true;
      pointsToAward = totalScore;
      
      // Update progress to completed
      await pool.execute(`
        UPDATE user_practice_progress 
        SET score = ?, max_score = ?, is_completed = TRUE, completed_at = NOW()
        WHERE user_id = ? AND scenario_id = ?
      `, [totalScore, maxScore, userId, scenarioId]);
    } else {
      // User has already completed this scenario - no new points awarded
      pointsToAward = 0;
      
      // Update progress but don't award new points
      await pool.execute(`
        UPDATE user_practice_progress 
        SET score = ?, max_score = ?, completed_at = NOW()
        WHERE user_id = ? AND scenario_id = ?
      `, [totalScore, maxScore, userId, scenarioId]);
    }

          // Only check and award badges for new completions
      if (isNewCompletion) {
    await checkAndAwardBadges(userId, 'scenario_completion', {
      scenarioId: scenarioId,
      score: finalScore,
      time_taken: 0, // You can add time tracking later
      category: 'practice'
    });
      }
      
    // Determine response message based on completion status
    let message;
    if (isNewCompletion) {
      message = `Scenario completed! Score: ${totalScore}/${maxScore} (${finalScore}%) - ${pointsToAward} points earned!`;
    } else {
      message = `Scenario replayed! Score: ${totalScore}/${maxScore} (${finalScore}%) - No new points (already completed)`;
    }
      
      res.json({
        success: true,
      score: totalScore,
      maxScore: maxScore,
      percentage: finalScore,
      results: results,
      message: message,
      pointsAwarded: pointsToAward,
      isNewCompletion: isNewCompletion
    });

  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Failed to submit answers' });
  }
});

// Get practice leaderboard
app.get('/api/practice/leaderboard', async (req, res) => {
  try {
    // Parse and sanitize limit/offset
    const limit = 50;
    const offset = 0;
    
    const leaderboard = await executeQuery(
      `SELECT 
        u.id,
        u.username,
        u.profile_pic,
        u.country,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed_scenarios,
        COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END), 0) as total_points,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as average_score,
        MAX(upp.completed_at) as last_completed,
        COALESCE(us.current_streak, 0) as current_streak,
        COALESCE(us.longest_streak, 0) as longest_streak
       FROM users u
       LEFT JOIN user_practice_progress upp ON u.id = upp.user_id
       LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
       LEFT JOIN user_streaks us ON u.id = us.user_id
       GROUP BY u.id, u.username, u.profile_pic, u.country, us.current_streak, us.longest_streak
       HAVING total_points > 0
       ORDER BY total_points DESC, completed_scenarios DESC, average_score DESC
       LIMIT ${limit} OFFSET ${offset}`
    );
    
    // Add rank and badge count to each user
    const rankedLeaderboard = await Promise.all(leaderboard.map(async (user, index) => {
      // Get badge count for each user
      const badgeCount = await executeQuery(
        'SELECT COUNT(*) as badges FROM user_badges WHERE user_id = ?',
        [user.id]
      );
      
      return {
        ...user,
        user_rank: offset + index + 1,
        badges: badgeCount[0]?.badges || 0
      };
    }));
    
    res.json({
      success: true,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

// Get practice statistics
app.get('/api/practice/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's practice statistics with correct point calculation
    const stats = await executeQuery(
      `SELECT 
        COUNT(*) as total_scenarios,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed_scenarios,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as average_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.time_taken END) as total_time,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as total_points_earned,
        MAX(upp.completed_at) as last_completed
       FROM practice_scenarios ps
       LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ?
       WHERE ps.is_active = TRUE`,
      [userId]
    );
    
    // Calculate day streak
    const streakData = await executeQuery(
      `SELECT 
        DATE(completed_at) as completion_date,
        COUNT(*) as completions_per_day
       FROM user_practice_progress upp
       INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
       WHERE upp.user_id = ? AND upp.is_completed = TRUE AND ps.is_active = TRUE
       GROUP BY DATE(completed_at)
       ORDER BY completion_date DESC`,
      [userId]
    );
    
    let currentStreak = 0;
    if (streakData.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      for (let i = 0; i < streakData.length; i++) {
        const date = streakData[i].completion_date;
        if (i === 0 && (date === today || date === yesterday)) {
          currentStreak = 1;
          // Check consecutive days
          for (let j = 1; j < streakData.length; j++) {
            const expectedDate = new Date(date);
            expectedDate.setDate(expectedDate.getDate() - j);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            if (streakData[j] && streakData[j].completion_date === expectedDateStr) {
              currentStreak++;
            } else {
              break;
            }
          }
          break;
        }
      }
    }
    
    // Get user's rank based on total points earned - simplified approach
    const allUserPoints = await executeQuery(
      `SELECT 
         u.id,
         COALESCE(SUM(upp.score), 0) as total_points
       FROM users u
       LEFT JOIN user_practice_progress upp ON u.id = upp.user_id AND upp.is_completed = TRUE
       LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
       GROUP BY u.id
       ORDER BY total_points DESC`,
      []
    );
    
    // Calculate user's rank in JavaScript
    const currentUserPoints = stats[0].total_points_earned || 0;
    const userRank = allUserPoints.findIndex(user => user.id === userId) + 1;
    const finalRank = userRank > 0 ? userRank : allUserPoints.length + 1;
    
    // Get total users count for ranking context
    const totalUsers = await executeQuery('SELECT COUNT(*) as count FROM users');
    
    // Get category breakdown
    const categoryStats = await executeQuery(
      `SELECT 
        ps.category,
        COUNT(*) as total,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as avg_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as points_earned
       FROM practice_scenarios ps
       LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ?
       WHERE ps.is_active = TRUE
       GROUP BY ps.category`,
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        overview: {
          ...stats[0],
          total_points_earned: stats[0].total_points_earned || 0,
          current_streak: currentStreak,
          rank: finalRank,
          total_users: totalUsers[0]?.count || 1
        },
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching practice stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice statistics',
      error: error.message
    });
  }
});
app.get("/api/tools", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tools");
    // Parse JSON columns safely
    const parsedRows = rows.map(tool => {
      try {
        return {
          ...tool,
          commands: typeof tool.commands === "string" ? JSON.parse(tool.commands) : (tool.commands || []),
          platforms: typeof tool.platforms === "string" ? JSON.parse(tool.platforms) : (tool.platforms || []),
        };
      } catch (parseError) {
        console.error(`Error parsing JSON for tool ${tool.id}:`, parseError);
        return {
          ...tool,
          commands: [],
          platforms: [],
        };
      }
    });
    res.json(parsedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving tools" });
  }
});

// Add tool
app.post("/api/tools", async (req, res) => {
  try {
    const tool = {
      ...req.body,
      commands: JSON.stringify(req.body.commands || []),
      platforms: JSON.stringify(req.body.platforms || []),
    };

    const [result] = await pool.query("INSERT INTO tools SET ?", tool);
    res.json({ id: result.insertId, ...tool });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding tool" });
  }
});

// Update tool
app.put("/api/tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove fields that shouldn't be updated manually
    const { created_at, updated_at, id: toolId, ...updateData } = req.body;
    
    // Handle JSON fields properly
    const updates = {
      ...updateData,
      commands: Array.isArray(updateData.commands) ? JSON.stringify(updateData.commands) : updateData.commands,
      platforms: Array.isArray(updateData.platforms) ? JSON.stringify(updateData.platforms) : updateData.platforms,
    };

    // Build dynamic query
    const fields = Object.keys(updates)
      .filter(key => updates[key] !== undefined && updates[key] !== null)
      .map((key) => `${key} = ?`)
      .join(", ");
    
    const values = Object.keys(updates)
      .filter(key => updates[key] !== undefined && updates[key] !== null)
      .map(key => updates[key]);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const [result] = await pool.query(`UPDATE tools SET ${fields} WHERE id = ?`, [...values, id]);
    res.json({ success: true, updatedRows: result.affectedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating tool" });
  }
});

// Delete tool
app.delete("/api/tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tools WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting tool" });
  }
});

// Search tools
app.get("/api/tools/search", async (req, res) => {
  const { category, search } = req.query;
  let query = "SELECT * FROM tools WHERE 1=1";
  const values = [];

  if (category && category !== "all") {
    query += " AND category = ?";
    values.push(category);
  }

  if (search) {
    query += " AND (name LIKE ? OR description LIKE ? OR type LIKE ?)";
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  try {
    const [rows] = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching tools" });
  }
});
app.get("/api/tools/categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT category FROM tools WHERE category IS NOT NULL AND category != ''"
    );
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving categories" });
  }
});

// Tool Practice API Endpoints

// Get all tool practice scenarios (simplified - no user tracking)
app.get("/api/tool-practice/scenarios", async (req, res) => {
  try {
    const { tool_name, admin } = req.query;
    
    // Different query for admin vs regular users
    let query = "SELECT id, tool_name, scenario_title, scenario_description, difficulty, correct_command, command_pieces, explanation, is_active FROM tool_practice_scenarios";
    
    // For regular users, only show active scenarios
    if (!admin) {
      query += " WHERE is_active = TRUE";
    }
    
    if (tool_name) {
      query += admin ? " WHERE" : " AND";
      query += ` tool_name = '${tool_name}'`;
    }
    
    query += " ORDER BY id";
    
    // Only limit for regular users
    if (!admin) {
      query += " LIMIT 10";
    }
    
    const [scenarios] = await pool.execute(query);
    
    // Parse JSON command_pieces for each scenario
    const parsedScenarios = scenarios.map(scenario => {
      try {
        // MySQL JSON fields are already parsed, but handle both cases
        let commandPieces = scenario.command_pieces;
        if (typeof commandPieces === 'string') {
          commandPieces = JSON.parse(commandPieces);
        }
        
        return {
          id: scenario.id,
          tool_name: scenario.tool_name,
          scenario_title: scenario.scenario_title,
          scenario_description: scenario.scenario_description,
          difficulty: scenario.difficulty,
          correct_command: scenario.correct_command,
          command_pieces: commandPieces || [],
          explanation: scenario.explanation,
          is_active: scenario.is_active
        };
      } catch (parseError) {
        console.error('Error parsing command_pieces for scenario', scenario.id, ':', parseError);
        return {
          id: scenario.id,
          tool_name: scenario.tool_name,
          scenario_title: scenario.scenario_title,
          scenario_description: scenario.scenario_description,
          difficulty: scenario.difficulty,
          correct_command: scenario.correct_command,
          command_pieces: [],
          explanation: scenario.explanation,
          is_active: scenario.is_active
        };
      }
    });
    
    res.json({
      success: true,
      data: parsedScenarios
    });
  } catch (error) {
    console.error('Error fetching tool practice scenarios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scenarios'
    });
  }
});

// Simple answer checker (no user tracking)
app.post("/api/tool-practice/check", async (req, res) => {
  try {
    const { scenarioId, submittedCommand } = req.body;
    
    // Get the scenario details
    const [scenarios] = await pool.execute(
      "SELECT * FROM tool_practice_scenarios WHERE id = ?",
      [scenarioId]
    );
    
    if (scenarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    
    const scenario = scenarios[0];
    const isCorrect = submittedCommand.trim().toLowerCase() === scenario.correct_command.trim().toLowerCase();
    
    res.json({
      success: true,
      isCorrect,
      correctCommand: scenario.correct_command,
      explanation: scenario.explanation
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check answer'
    });
  }
});

// Admin CRUD endpoints for tool practice scenarios

// Create new scenario
app.post("/api/tool-practice/scenarios", async (req, res) => {
  try {
    const {
      tool_name,
      scenario_title,
      scenario_description,
      difficulty,
      correct_command,
      command_pieces,
      explanation,
      is_active = true
    } = req.body;

    // Validate required fields
    if (!tool_name || !scenario_title || !scenario_description || !correct_command || !command_pieces) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate command_pieces is an array
    if (!Array.isArray(command_pieces)) {
      return res.status(400).json({
        success: false,
        message: 'command_pieces must be an array'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO tool_practice_scenarios 
       (tool_name, scenario_title, scenario_description, difficulty, correct_command, command_pieces, explanation, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tool_name, scenario_title, scenario_description, difficulty, correct_command, JSON.stringify(command_pieces), explanation, is_active]
    );

    res.json({
      success: true,
      message: 'Scenario created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario'
    });
  }
});

// Update scenario
app.put("/api/tool-practice/scenarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tool_name,
      scenario_title,
      scenario_description,
      difficulty,
      correct_command,
      command_pieces,
      explanation,
      is_active
    } = req.body;

    // Validate required fields
    if (!tool_name || !scenario_title || !scenario_description || !correct_command || !command_pieces) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate command_pieces is an array
    if (!Array.isArray(command_pieces)) {
      return res.status(400).json({
        success: false,
        message: 'command_pieces must be an array'
      });
    }

    const [result] = await pool.execute(
      `UPDATE tool_practice_scenarios 
       SET tool_name = ?, scenario_title = ?, scenario_description = ?, difficulty = ?, 
           correct_command = ?, command_pieces = ?, explanation = ?, is_active = ?
       WHERE id = ?`,
      [tool_name, scenario_title, scenario_description, difficulty, correct_command, JSON.stringify(command_pieces), explanation, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario updated successfully'
    });
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update scenario'
    });
  }
});

// Delete scenario
app.delete("/api/tool-practice/scenarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM tool_practice_scenarios WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scenario'
    });
  }
});


app.post("/api/blogs", async (req, res) => {
  const {
    title,
    author,
    author_avatar,
    date,
    read_time,
    category,
    tags,
    excerpt,
    content,
    featured,
    views = 0
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO blogs 
        (title, author, author_avatar, date, read_time, category, tags, excerpt, content, featured, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        author,
        author_avatar,
        date,
        read_time,
        category,
        Array.isArray(tags) ? tags.join(",") : tags, // Convert array to CSV if needed
        excerpt,
        content,
        featured,
        views
      ]
    );
    res.status(201).json({ id: result.insertId, message: "Blog saved successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});
// Only return blogs with 'roadmap' in the title (case-insensitive)
app.get("/api/blogs1", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE LOWER(title) LIKE '%roadmap%'");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// GET: Fetch roadmap blog by ID
app.get("/api/blogs1/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ? AND LOWER(title) LIKE '%roadmap%'", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Roadmap not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch roadmap by ID Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// POST: Increment roadmap view count
app.post("/api/blogs1/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment the views count
    await pool.query("UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = ? AND LOWER(title) LIKE '%roadmap%'", [id]);
    
    // Get the updated roadmap data
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ? AND LOWER(title) LIKE '%roadmap%'", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Roadmap not found" });
    }
    
    res.json({ 
      success: true, 
      message: "View count incremented",
      views: rows[0].views || 0
    });
  } catch (err) {
    console.error("Increment view count Error:", err);
    res.status(500).json({ error: "Failed to increment view count" });
  }
});


app.get("/api/blogs", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs");
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});


// GET: Fetch blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});
app.put("/api/blogs/:id", async (req, res) => {
  const {
    title,
    author,
    author_avatar,
    date,
    read_time,
    category,
    tags,
    excerpt,
    content,
    featured,
    views
  } = req.body;

  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE blogs SET 
        title = ?, author = ?, author_avatar = ?, date = ?, read_time = ?,
        category = ?, tags = ?, excerpt = ?, content = ?, featured = ?, views = ?
      WHERE id = ?`,
      [
        title,
        author,
        author_avatar,
        date,
        read_time,
        category,
        tags,
        excerpt,
        content,
        featured,
        views,
        id
      ]
    );

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});


// DELETE blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM blogs WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Database delete failed" });
  }
});


app.post('/api/categories', async (req, res) => {
  const { key_name, label, description, color_gradient } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO practice_categories (key_name, label, description, color_gradient) VALUES (?, ?, ?, ?)`,
      [key_name, label, description, color_gradient]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a scenario
app.post('/api/scenarios', async (req, res) => {
  const {
    title,
    category,
    difficulty,
    time_estimate,
    questions_count,
    points,
    completion_rate,
    likes,
    views,
    description,
    tags,
    is_featured,
    is_active,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO practice_scenarios 
        (title, category, difficulty, time_estimate, questions_count, points, completion_rate, likes, views, description, tags, is_featured, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        difficulty,
        time_estimate,
        questions_count,
        points,
        completion_rate,
        likes,
        views,
        description,
        JSON.stringify(tags),
        is_featured,
        is_active,
      ]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions for a scenario
app.get('/api/questions/scenario/:scenarioId', async (req, res) => {
  const { scenarioId } = req.params;
  try {
    const [questions] = await pool.query(
      'SELECT * FROM practice_questions WHERE scenario_id = ? ORDER BY question_order',
      [scenarioId]
    );
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a question
app.post('/api/questions', authenticateAdmin, async (req, res) => {
  const {
    scenario_id,
    question_text,
    correct_answer,
    points,
    explanation,
    question_order,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO practice_questions (
        scenario_id, question_text, correct_answer, points, explanation, question_order
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        scenario_id,
        question_text,
        correct_answer,
        points,
        explanation,
        question_order,
      ]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a question
app.delete('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM practice_questions WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Question deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single question by ID
app.get('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM practice_questions WHERE id = ?',
      [id]
    );
    
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a question
app.put('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    scenario_id,
    question_text,
    correct_answer,
    points,
    explanation,
    question_order,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE practice_questions SET 
        scenario_id = ?, question_text = ?, correct_answer = ?, 
        points = ?, explanation = ?, question_order = ?
       WHERE id = ?`,
      [scenario_id, question_text, correct_answer, points, explanation, question_order, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Question updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// DELETE a scenario by ID
app.delete('/api/practice/scenarios/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await executeQuery('DELETE FROM practice_scenarios WHERE id = ?', [id]);
    res.json({ success: true, message: 'Scenario deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: 'Failed to delete scenario' });
  }
});

// CREATE a new practice scenario
app.post('/api/practice/scenarios', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      difficulty,
      time_estimate,
      questions_count,
      points,
      description,
      short_description,
      is_featured = false,
      is_active = true,
      file_url,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !category || !difficulty || !points) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, category, difficulty, and points are required' 
      });
    }

    const result = await executeQuery(
      `INSERT INTO practice_scenarios (
        title, category, difficulty, time_estimate, questions_count, 
        points, description, short_description, is_featured, is_active, 
        file_url, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title, category, difficulty, time_estimate || null, questions_count || 0,
        points, description || null, short_description || null, is_featured, is_active,
        file_url || null, tags ? JSON.stringify(tags) : null
      ]
    );

    // Notify all users about new scenario
    try {
      await notifyNewScenariosAdded(category, 1);
    } catch (notifyError) {
      console.error('Failed to notify users about new scenario:', notifyError);
      // Don't fail the request if notification fails
    }

    res.json({ 
      success: true, 
      message: 'Scenario created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Create scenario error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create scenario',
      error: error.message 
    });
  }
});

// UPDATE an existing practice scenario
app.put('/api/practice/scenarios/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      difficulty,
      time_estimate,
      questions_count,
      points,
      description,
      short_description,
      is_featured,
      is_active,
      file_url,
      tags
    } = req.body;

    // Check if scenario exists
    const [existing] = await pool.execute(
      'SELECT id FROM practice_scenarios WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scenario not found' 
      });
    }

    // Update the scenario
    await executeQuery(
      `UPDATE practice_scenarios SET 
        title = ?, category = ?, difficulty = ?, time_estimate = ?, 
        questions_count = ?, points = ?, description = ?, short_description = ?,
        is_featured = ?, is_active = ?, file_url = ?, tags = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title, category, difficulty, time_estimate || null, questions_count || 0,
        points, description || null, short_description || null, is_featured, is_active,
        file_url || null, tags ? JSON.stringify(tags) : null, id
      ]
    );

    res.json({ 
      success: true, 
      message: 'Scenario updated successfully' 
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update scenario',
      error: error.message 
    });
  }
});

// ==================== CHAT API ENDPOINT ====================

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ reply: "Please provide a valid message." });
    }

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create the prompt with context
    const prompt = `You are CyberCrux chatbot – a friendly and helpful AI cybersecurity mentor for beginners and intermediate learners.
- Give clear, short answers unless the user asks for detail.
- Avoid jargon unless explaining it simply.
- Use a motivating and supportive tone.

User question: ${message}`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ reply: "Sorry, I ran into an error." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// ==================== PUBLIC PROFILE API ENDPOINTS ====================

// Get public profile by username or user ID
app.get('/api/profile/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is a number (user ID) or string (username)
    const isUserId = !isNaN(identifier);
    const query = isUserId ? 
      'SELECT id, username, email, profile_pic, created_at, country, description, linkedin_url, github_url FROM users WHERE id = ?' :
      'SELECT id, username, email, profile_pic, created_at, country, description, linkedin_url, github_url FROM users WHERE username = ?';
    
    const [users] = await pool.execute(query, [identifier]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const user = users[0];
    
    // Get user's practice statistics
    const [practiceStats] = await pool.execute(`
      SELECT 
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed_scenarios,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as average_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.time_taken END) as total_time,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as total_points_earned,
        MAX(upp.completed_at) as last_completed
      FROM practice_scenarios ps
      LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ?
      WHERE ps.is_active = TRUE
    `, [user.id]);
    
    // Get user's streak data
    const [streakData] = await pool.execute(
      'SELECT * FROM user_streak_summary WHERE user_id = ?',
      [user.id]
    );
    
    // Calculate user's rank using same logic as leaderboard (sequential ranking with tie-breaking)
    // Only rank users who have completed at least one scenario
    const [rankData] = await pool.execute(`
      SELECT user_rank
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
      WHERE id = ?
    `, [user.id]);
    
    // Get user's earned badges from database
    const [userBadges] = await pool.execute(`
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
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `, [user.id]);
    
    const badges = userBadges;
    
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
        badges: badges
      }
    });
    
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Get all users for profile discovery
app.get('/api/profiles', async (req, res) => {
  try {
    const { search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        u.id, u.username, u.profile_pic, u.created_at,
        COALESCE(SUM(upp.score), 0) as total_points,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed_scenarios,
        COALESCE(us.current_streak, 0) as current_streak
      FROM users u
      LEFT JOIN user_practice_progress upp ON u.id = upp.user_id AND upp.is_completed = TRUE
      LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
      LEFT JOIN user_streaks us ON u.id = us.user_id
    `;
    
    const params = [];
    
    if (search) {
      query += ' WHERE u.username LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += `
      GROUP BY u.id, u.username, u.profile_pic, u.created_at, us.current_streak
      ORDER BY total_points DESC, completed_scenarios DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), parseInt(offset));
    
    const [users] = await pool.execute(query, params);
    
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

// Badge checking and awarding function
async function checkAndAwardBadges(userId, eventType, eventData) {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get all active badges
      const [badges] = await connection.execute(
        'SELECT id, name, badge_type, criteria FROM badges WHERE is_active = TRUE'
      );
      
      for (const badge of badges) {
        console.log(`🔍 Checking badge: ${badge.name} (ID: ${badge.id}) for user ${userId}`);
        
        // Check if user already has this badge
        const [existingBadge] = await connection.execute(
          'SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?',
          [userId, badge.id]
        );
        
        if (existingBadge.length === 0) {
          // Check if badge criteria is met
          const criteria = typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria;
          const shouldAward = await checkBadgeCriteria(userId, badge.badge_type, criteria, eventType, eventData);
          
          if (shouldAward) {
            // Award the badge (use INSERT IGNORE to prevent duplicates)
            try {
              await connection.execute(
                'INSERT INTO user_badges (user_id, badge_id, progress_data) VALUES (?, ?, ?)',
                [userId, badge.id, JSON.stringify(eventData)]
              );
              
              // Get user email and full name for sending email
              const [userInfo] = await connection.execute(
                'SELECT email, FullName FROM users WHERE id = ?',
                [userId]
              );
              
              console.log(`🔍 User info for badge email:`, { userId, userInfo: userInfo[0] });
              
              // Create notification for the new badge
              await connection.execute(`
                INSERT INTO user_notifications (user_id, type, title, message, created_at, is_read)
                VALUES (?, 'badge', ?, ?, NOW(), FALSE)
              `, [userId, `🏆 New Badge: ${badge.name}`, `Congratulations! You've earned the "${badge.name}" badge. Keep up the great work!`]);
              
              // Send badge earned email
              if (userInfo.length > 0 && userInfo[0].email) {
                try {
                  console.log(`📧 Attempting to send badge earned email to: ${userInfo[0].email}`);
                  console.log(`🏆 Badge data for email:`, {
                    name: badge.name,
                    description: badge.description,
                    icon: badge.icon,
                    rarity: badge.rarity,
                    points_reward: badge.points_reward
                  });
                  
                  // Test if email service is working
                  console.log(`🧪 Testing email service import...`);
                  const emailService = require('./services/emailService');
                  console.log(`🧪 Email service imported:`, Object.keys(emailService));
                  
                  const { sendBadgeEarnedEmail } = emailService;
                  console.log(`🧪 sendBadgeEarnedEmail function:`, typeof sendBadgeEarnedEmail);
                  
                  await sendBadgeEarnedEmail(
                    userInfo[0].email,
                    userInfo[0].FullName,
                    badge.name,
                    badge.description || 'Achievement unlocked!',
                    badge.icon || 'https://img.icons8.com/color/96/000000/trophy.png',
                    badge.rarity || 'common',
                    badge.points_reward || 0
                  );
                  console.log(`✅ Badge earned email sent successfully to: ${userInfo[0].email}`);
                } catch (emailError) {
                  console.error(`❌ Failed to send badge earned email:`, emailError);
                  console.error(`❌ Email error details:`, {
                    message: emailError.message,
                    stack: emailError.stack,
                    userEmail: userInfo[0].email,
                    badgeName: badge.name
                  });
                  // Don't fail badge awarding if email fails
                }
              } else {
                console.log(`⚠️ No user info or email found for user ${userId}, skipping email`);
              }
              
              console.log(`🏆 Awarded badge: ${badge.name} to user ${userId}`);
            } catch (error) {
              if (error.code === 'ER_DUP_ENTRY') {
                console.log(`⚠️ User ${userId} already has badge: ${badge.name}`);
              } else {
                throw error;
              }
            }
          }
        }
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

// ===== NOTIFICATION GENERATION FUNCTIONS =====
// Generate notification when new scenarios are added
async function notifyNewScenariosAdded(category, count) {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get all users
      const [users] = await connection.execute(
        'SELECT id FROM users'
      );
      
      // Send notification to all users
      for (const user of users) {
        await connection.execute(`
          INSERT INTO user_notifications (user_id, type, title, message, created_at, is_read)
          VALUES (?, 'system', ?, ?, NOW(), FALSE)
        `, [user.id, '🆕 New Content Available', `${count} new ${category} scenarios have been added! Check them out and expand your skills!`]);
      }
      
      console.log(`📢 Notified ${users.length} users about new ${category} scenarios`);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error notifying users about new scenarios:', error);
  }
}

// Admin endpoint to send notifications to all users
app.post('/api/admin/notifications/broadcast', authenticateAdmin, async (req, res) => {
  try {
    const { type, title, message } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and message are required'
      });
    }
    
    const connection = await pool.getConnection();
    
    try {
      // Get all users
      const [users] = await connection.execute(
        'SELECT id FROM users'
      );
      
      // Send notification to all users
      for (const user of users) {
        await connection.execute(`
          INSERT INTO user_notifications (user_id, type, title, message, created_at, is_read)
          VALUES (?, ?, ?, ?, NOW(), FALSE)
        `, [user.id, type, title, message]);
      }
      
      res.json({
        success: true,
        message: `Notification sent to ${users.length} users`,
        usersNotified: users.length
      });
      
      console.log(`📢 Admin broadcast: "${title}" sent to ${users.length} users`);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
});

// ===== EXISTING BADGE NOTIFICATION CODE =====

// Badge criteria checking function
async function checkBadgeCriteria(userId, badgeType, criteria, eventType, eventData) {
  try {
    const connection = await pool.getConnection();
    
    try {
      switch (criteria.type) {
        case 'first_login':
          return eventType === 'login';
          
        case 'streak_days':
          if (eventType === 'streak' && eventData.current_streak >= criteria.days) {
            return true;
          }
          // Also check current streak from database
          const [streakData] = await connection.execute(
            'SELECT current_streak FROM user_streaks WHERE user_id = ?',
            [userId]
          );
          return streakData[0]?.current_streak >= criteria.days;
          
        case 'scenarios_completed':
          const [completionData] = await connection.execute(`
            SELECT COUNT(*) as count
            FROM user_practice_progress upp
            INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
            WHERE upp.user_id = ? AND upp.is_completed = TRUE AND ps.is_active = TRUE
          `, [userId]);
          return completionData[0]?.count >= criteria.count;
          
        case 'scenario_category':
          let categoryQuery = `
            SELECT COUNT(*) as count
            FROM user_practice_progress upp
            INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
            WHERE upp.user_id = ? AND upp.is_completed = TRUE AND ps.is_active = TRUE AND ps.category = ?
          `;
          const params = [userId, criteria.category];
          
          if (criteria.scenario_tags) {
            // Check for specific tags like SQL injection
            categoryQuery += ` AND JSON_OVERLAPS(ps.tags, CAST(? AS JSON))`;
            params.push(JSON.stringify(criteria.scenario_tags));
          }
          
          const [categoryData] = await connection.execute(categoryQuery, params);
          return categoryData[0]?.count >= criteria.count;
          
        case 'perfect_score':
          if (eventType === 'scenario_completion' && eventData.score === 100) {
            return true;
          }
          const [perfectData] = await connection.execute(`
            SELECT COUNT(*) as count
            FROM user_practice_progress upp
            INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
            WHERE upp.user_id = ? AND upp.is_completed = TRUE AND upp.score = 100 AND ps.is_active = TRUE
          `, [userId]);
          return perfectData[0]?.count >= 1;
          
        case 'completion_time':
          return eventType === 'scenario_completion' && eventData.time_taken <= criteria.max_time;
          
        case 'average_score':
          const [scoreData] = await connection.execute(`
            SELECT AVG(upp.score) as avg_score, COUNT(*) as count
            FROM user_practice_progress upp
            INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
            WHERE upp.user_id = ? AND upp.is_completed = TRUE AND ps.is_active = TRUE
          `, [userId]);
          return scoreData[0]?.count >= criteria.min_scenarios && scoreData[0]?.avg_score >= criteria.score;
          
        case 'mock_tests':
          // Placeholder - implement when mock test system is ready
          return false;
          
        default:
          return false;
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error checking badge criteria:', error);
    return false;
  }
}

// Badge utility functions
async function createBadge(badgeData) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO badges (name, description, icon, badge_type, criteria, points_reward, rarity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [badgeData.name, badgeData.description, badgeData.icon, badgeData.badge_type, JSON.stringify(badgeData.criteria), badgeData.points_reward, badgeData.rarity, badgeData.is_active || true]
    );
    return { success: true, badgeId: result.insertId };
  } catch (error) {
    console.error('❌ Error creating badge:', error);
    return { success: false, error: error.message };
  }
}

async function updateBadgeIcon(badgeId, iconUrl) {
  try {
    await pool.execute('UPDATE badges SET icon = ? WHERE id = ?', [iconUrl, badgeId]);
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating badge icon:', error);
    return { success: false, error: error.message };
  }
}

async function getUserBadges(userId) {
  try {
    const [badges] = await pool.execute(`
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
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `, [userId]);
    return badges;
  } catch (error) {
    console.error('❌ Error fetching user badges:', error);
    return [];
  }
}

async function getBadgeLeaderboard(limit = 10) {
  try {
    const [leaderboard] = await pool.execute(`
      SELECT 
        u.id,
        u.username,
        u.profile_pic,
        COUNT(ub.badge_id) as total_badges,
        SUM(b.points_reward) as badge_points
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN badges b ON ub.badge_id = b.id
      GROUP BY u.id, u.username, u.profile_pic
      HAVING total_badges > 0
      ORDER BY badge_points DESC, total_badges DESC
      LIMIT ?
    `, [limit]);
    return leaderboard;
  } catch (error) {
    console.error('❌ Error fetching badge leaderboard:', error);
    return [];
  }
}

// ==================== BADGE API ENDPOINTS ====================

// Test endpoint for badge system
app.get('/api/test/badges/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const badges = await getUserBadges(userId);
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
app.put('/api/admin/badges/:badgeId/icon', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { iconUrl } = req.body;
    
    if (!iconUrl) {
      return res.status(400).json({ success: false, message: 'Icon URL is required' });
    }
    
    const result = await updateBadgeIcon(badgeId, iconUrl);
    res.json(result);
  } catch (error) {
    console.error('Error updating badge icon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to create new badge
app.post('/api/admin/badges', async (req, res) => {
  try {
    const { name, description, icon, badge_type, criteria, points_required, is_active } = req.body;
    
    // Validate required fields
    if (!name || !description || !icon || !badge_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, description, icon, badge_type' 
      });
    }
    
    // Insert badge into database (using points_reward column name)
    const [result] = await pool.execute(
      'INSERT INTO badges (name, description, icon, badge_type, criteria, points_reward, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        name, 
        description, 
        icon, 
        badge_type, 
        JSON.stringify(criteria || {}), 
        points_required || 0, 
        is_active !== undefined ? is_active : true
      ]
    );
    
    res.json({ 
      success: true, 
      message: 'Badge created successfully',
      badgeId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to update badge criteria
app.put('/api/admin/badges/:badgeId/criteria', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { criteria } = req.body;
    
    if (!criteria) {
      return res.status(400).json({ success: false, message: 'Criteria is required' });
    }
    
    await pool.execute(
      'UPDATE badges SET criteria = ? WHERE id = ?',
      [JSON.stringify(criteria), badgeId]
    );
    
    res.json({ success: true, message: 'Badge criteria updated successfully' });
  } catch (error) {
    console.error('Error updating badge criteria:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to update badge (comprehensive)
app.put('/api/admin/badges/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    const { name, description, icon, badge_type, criteria, points_required, is_active } = req.body;
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (badge_type !== undefined) {
      updates.push('badge_type = ?');
      values.push(badge_type);
    }
    if (criteria !== undefined) {
      updates.push('criteria = ?');
      values.push(JSON.stringify(criteria));
    }
    if (points_required !== undefined) {
      updates.push('points_reward = ?');  // Fixed: use points_reward column
      values.push(points_required);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    
    values.push(badgeId);
    
    await pool.execute(
      `UPDATE badges SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    res.json({ success: true, message: 'Badge updated successfully' });
  } catch (error) {
    console.error('Error updating badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to delete badge
app.delete('/api/admin/badges/:badgeId', async (req, res) => {
  try {
    const { badgeId } = req.params;
    
    // First check if badge exists
    const [badgeCheck] = await pool.execute(
      'SELECT id FROM badges WHERE id = ?',
      [badgeId]
    );
    
    if (badgeCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }
    
    // Delete user badge assignments first (to maintain referential integrity)
    await pool.execute(
      'DELETE FROM user_badges WHERE badge_id = ?',
      [badgeId]
    );
    
    // Delete the badge
    await pool.execute(
      'DELETE FROM badges WHERE id = ?',
      [badgeId]
    );
    
    res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (error) {
    console.error('Error deleting badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all available badges
app.get('/api/badges', async (req, res) => {
  try {
    const [badges] = await pool.execute(
      'SELECT id, name, description, icon, badge_type, criteria, points_reward, rarity, is_active, created_at, updated_at FROM badges ORDER BY created_at DESC'
    );
    
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
app.get('/api/badges/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [userBadges] = await pool.execute(`
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
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC
    `, [userId]);
    
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
app.post('/api/badges/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventType = 'manual', eventData = {} } = req.body;
    
    await checkAndAwardBadges(parseInt(userId), eventType, eventData);
    
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
app.get('/api/badges/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.execute(`
      SELECT 
        u.username,
        COUNT(ub.badge_id) as total_badges,
        COUNT(CASE WHEN b.rarity = 'legendary' THEN 1 END) as legendary_badges,
        COUNT(CASE WHEN b.rarity = 'epic' THEN 1 END) as epic_badges,
        COUNT(CASE WHEN b.rarity = 'rare' THEN 1 END) as rare_badges,
        COUNT(CASE WHEN b.rarity = 'common' THEN 1 END) as common_badges,
        SUM(b.points_reward) as total_badge_points
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN badges b ON ub.badge_id = b.id
      GROUP BY u.id, u.username
      HAVING total_badges > 0
      ORDER BY total_badges DESC, total_badge_points DESC
      LIMIT 50
    `);
    
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

// ==================== NOTIFICATION SYSTEM ====================

// Get user notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [notifications] = await pool.execute(`
      SELECT id, type, title, message, created_at, is_read
      FROM user_notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [userId]);
    
    res.json({ 
      success: true, 
      notifications: notifications.map(n => ({
        ...n,
        created_at: n.created_at.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await pool.execute(`
      UPDATE user_notifications 
      SET is_read = TRUE 
      WHERE id = ? AND user_id = ?
    `, [id, userId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});

// Clear all notifications
app.delete('/api/notifications/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.execute(`
      DELETE FROM user_notifications 
      WHERE user_id = ?
    `, [userId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
});

// ==================== STREAK API ENDPOINTS ====================

// Helper function to safely handle user streak operations
async function safeRecordUserLogin(connection, user_id) {
  try {
    // First check if user_streaks record exists
    const [existingStreak] = await connection.execute(
      'SELECT * FROM user_streaks WHERE user_id = ?',
      [user_id]
    );

    if (existingStreak.length === 0) {
      // No existing record, create new one with ON DUPLICATE KEY UPDATE for safety
      await connection.execute(`
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_login_date, streak_start_date)
        VALUES (?, 1, 1, NOW(), NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          current_streak = EXCLUDED.current_streak,
          longest_streak = EXCLUDED.longest_streak,
          last_login_date = EXCLUDED.last_login_date,
          updated_at = CURRENT_TIMESTAMP
      `, [user_id]);
    } else {
      // Record exists, update it
      const now = new Date();
      const lastLogin = existingStreak[0].last_login_date;
      const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (lastLoginDate) {
        lastLoginDate.setHours(0, 0, 0, 0);
      }
      
      let newStreak = existingStreak[0].current_streak;
      let newLongestStreak = existingStreak[0].longest_streak;
      
      if (!lastLoginDate || lastLoginDate < today) {
        // Check if it's consecutive day
        if (lastLoginDate && (today - lastLoginDate) / (1000 * 60 * 60 * 24) === 1) {
          // Consecutive day, increment streak
          newStreak += 1;
          if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
          }
        } else {
          // Gap of more than 1 day, reset streak
          newStreak = 1;
        }
      }
      
      await connection.execute(`
        UPDATE user_streaks 
        SET current_streak = ?, longest_streak = ?, last_login_date = NOW(), updated_at = NOW()
        WHERE user_id = ?
      `, [newStreak, newLongestStreak, user_id]);
    }
  } catch (error) {
    console.error('Error in safeRecordUserLogin:', error);
    throw error;
  }
}

// Record user login
app.post('/api/streak/record-login', async (req, res) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const connection = await pool.getConnection();
    
    try {
      // Use the safer login recording function
      console.log(`📊 Recording login for user ${user_id}`);
      await safeRecordUserLogin(connection, user_id);
      console.log(`✅ Login recorded successfully for user ${user_id}`);
      
      // Check for first login badge
      await checkAndAwardBadges(user_id, 'login', { timestamp: new Date() });
      
      // Get updated streak information
      const [streakRows] = await connection.execute(
        'SELECT * FROM user_streak_summary WHERE user_id = ?',
        [user_id]
      );

      // Check for streak badges
      if (streakRows[0]?.current_streak) {
        await checkAndAwardBadges(user_id, 'streak', { 
          current_streak: streakRows[0].current_streak,
          timestamp: new Date()
        });
      }

      res.json({
        success: true,
        message: 'Login recorded successfully',
        streak: {
          current_streak: streakRows[0]?.current_streak || 0,
          longest_streak: streakRows[0]?.longest_streak || 0,
          last_login_date: streakRows[0]?.last_login_date || null,
          streak_start_date: streakRows[0]?.streak_start_date || null
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error recording login:', error);
    res.status(500).json({ error: 'Failed to record login' });
  }
});

    

    

// Get user streak data
app.get('/api/streak/user-streak/:userId', async (req, res) => {
    try {
    const { userId } = req.params;
      
    const connection = await pool.getConnection();
    
    try {
      const [streakRows] = await connection.execute(
        'SELECT * FROM user_streak_summary WHERE user_id = ?',
        [userId]
      );

      res.json({
        streak: streakRows[0] || {
          current_streak: 0,
          longest_streak: 0,
          last_login_date: null,
          streak_start_date: null
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error getting user streak:', error);
    res.status(500).json({ error: 'Failed to get user streak' });
  }
});

// Get practice categories
app.get('/api/practice/categories', authenticateAdmin, async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT key_name, label, description, color_gradient, count
      FROM practice_categories 
      ORDER BY label ASC
    `);
    
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
app.post('/api/admin/login', adminRateLimit, async (req, res) => {
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

app.post('/api/admin/logout', (req, res) => {
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

app.get('/api/admin/verify', authenticateAdmin, (req, res) => {
  console.log('✅ Admin verify endpoint called successfully for:', req.admin.username);
  res.json({ 
    success: true, 
    message: 'Admin token valid',
    admin: req.admin
  });
});

// Get user's category-specific progress for badges
app.get('/api/badges/category-progress', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const connection = await pool.getConnection();
    
    // Get progress for each category
    const [categoryProgress] = await connection.query(`
      SELECT 
        ps.category,
        COUNT(upp.id) as completed_count
      FROM practice_scenarios ps
      LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ? AND upp.is_completed = 1
      WHERE ps.is_active = 1
      GROUP BY ps.category
    `, [userId]);

      connection.release();

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

// ==================== ADMIN DASHBOARD ENDPOINTS ====================

// Get comprehensive dashboard statistics
app.get('/api/admin/dashboard-stats', authenticateAdmin, async (req, res) => {
  try {
    console.log('🔍 Fetching dashboard statistics...');
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');
    
    // Get total users
    const [totalUsersResult] = await connection.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersResult[0].count;
    console.log('👥 Total users:', totalUsers);
    
    // Get new users this month
    const [newUsersThisMonthResult] = await connection.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);
    const newUsersThisMonth = newUsersThisMonthResult[0].count;
    console.log('📅 New users this month:', newUsersThisMonth);
    
    // Get new users this week
    const [newUsersThisWeekResult] = await connection.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE YEARWEEK(created_at) = YEARWEEK(CURRENT_DATE())
    `);
    const newUsersThisWeek = newUsersThisWeekResult[0].count;
    console.log('📅 New users this week:', newUsersThisWeek);
    
    // Get new users today
    const [newUsersTodayResult] = await connection.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE DATE(created_at) = CURRENT_DATE()
    `);
    const newUsersToday = newUsersTodayResult[0].count;
    console.log('📅 New users today:', newUsersToday);
    
    // Get active users (users who logged in within last 30 days)
    const [activeUsersResult] = await connection.query(`
      SELECT COUNT(DISTINCT user_id) as count FROM user_streaks 
      WHERE last_login_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    `);
    const activeUsers = activeUsersResult[0].count;
    console.log('🟢 Active users:', activeUsers);
    
    // Get total practice sessions
    const [totalSessionsResult] = await connection.query(`
      SELECT COUNT(*) as count FROM user_practice_progress 
      WHERE is_completed = 1
    `);
    const totalPracticeSessions = totalSessionsResult[0].count;
    console.log('🧠 Total practice sessions:', totalPracticeSessions);
    
    // Get total scenarios and questions
    const [scenariosResult] = await connection.query('SELECT COUNT(*) as count FROM practice_scenarios WHERE is_active = 1');
    const [questionsResult] = await connection.query('SELECT COUNT(*) as count FROM practice_questions');
    const totalScenarios = scenariosResult[0].count;
    const totalQuestions = questionsResult[0].count;
    console.log('📚 Total scenarios:', totalScenarios, 'Total questions:', totalQuestions);
    
    // Get average score
    const [avgScoreResult] = await connection.query(`
      SELECT AVG(score) as avg_score FROM user_practice_progress 
      WHERE is_completed = 1 AND score IS NOT NULL
    `);
    const averageScore = Math.round(avgScoreResult[0].avg_score || 0);
    console.log('📊 Average score:', averageScore);
    
    // Get completion rate
    const [completionResult] = await connection.query(`
      SELECT 
        COUNT(CASE WHEN is_completed = 1 THEN 1 END) as completed,
        COUNT(*) as total
      FROM user_practice_progress
    `);
    const completionRate = completionResult[0].total > 0 
      ? Math.round((completionResult[0].completed / completionResult[0].total) * 100)
      : 0;
    console.log('✅ Completion rate:', completionRate + '%');
    
    // Get content statistics
    const [booksResult] = await connection.query('SELECT COUNT(*) as count FROM books');
    const [blogsResult] = await connection.query('SELECT COUNT(*) as count FROM blogs');
    const [roadmapsResult] = await connection.query(`
      SELECT COUNT(*) as count FROM blogs 
      WHERE LOWER(title) LIKE '%roadmap%' OR LOWER(title) LIKE '%learning path%'
    `);
    const [toolsResult] = await connection.query('SELECT COUNT(*) as count FROM tools');
    const [learningResourcesResult] = await connection.query('SELECT COUNT(*) as count FROM learning_resources');
    
    console.log('📖 Books:', booksResult[0].count);
    console.log('📝 Blogs:', blogsResult[0].count);
    console.log('🗺️ Roadmaps:', roadmapsResult[0].count);
    console.log('🔧 Tools:', toolsResult[0].count);
    console.log('📚 Learning resources:', learningResourcesResult[0].count);
    
    // Calculate growth percentages (simplified - you can make this more sophisticated)
    const userGrowth = newUsersThisMonth > 0 ? 15.5 : 0; // Mock data
    const activeUserGrowth = 8.2; // Mock data
    const practiceGrowth = 12.7; // Mock data
    const completionRateGrowth = 5.3; // Mock data
    
    // Calculate active user percentages
    const activeUserPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    
    // Mock data for additional metrics
    const dailyActiveUsers = Math.round(activeUsers * 0.3);
    const weeklyActiveUsers = Math.round(activeUsers * 0.7);
    const monthlyActiveUsers = activeUsers;
    const avgSessionDuration = 25; // minutes
    const avgSessionTime = 25; // minutes
    const bounceRate = 23; // percentage
    const totalPageViews = 15420;
    const lastBackup = '2 hours ago';
    
    connection.release();
    console.log('✅ Dashboard statistics fetched successfully');
    
    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        newUsersToday,
        activeUsers,
        activeUserPercentage,
        totalPracticeSessions,
        totalScenarios,
        totalQuestions,
        averageScore,
        completionRate,
        completedScenarios: completionResult[0].completed,
        totalBooks: booksResult[0].count,
        totalRoadmaps: roadmapsResult[0].count,
        totalBlogs: blogsResult[0].count,
        totalTools: toolsResult[0].count,
        totalLearningResources: learningResourcesResult[0].count,
        userGrowth,
        activeUserGrowth,
        practiceGrowth,
        completionRateGrowth,
        dailyActiveUsers,
        weeklyActiveUsers,
        monthlyActiveUsers,
        avgSessionDuration,
        avgSessionTime,
        bounceRate,
        totalPageViews,
        lastBackup
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics', error: error.message });
  }
});

// Get recent activity
app.get('/api/admin/recent-activity', authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get recent user registrations
    const [recentUsers] = await connection.query(`
      SELECT username, created_at FROM users 
      ORDER BY created_at DESC LIMIT 5
    `);
    
    // Get recent practice completions
    const [recentPractice] = await connection.query(`
      SELECT u.username, ps.title, upp.completed_at 
      FROM user_practice_progress upp
      JOIN users u ON upp.user_id = u.id
      JOIN practice_scenarios ps ON upp.scenario_id = ps.id
      WHERE upp.is_completed = 1
      ORDER BY upp.completed_at DESC LIMIT 5
    `);
    
    // Get recent content additions
    const [recentContent] = await connection.query(`
      SELECT 'book' as type, title, created_at FROM books
      UNION ALL
      SELECT 'blog' as type, title, date as created_at FROM blogs
      UNION ALL
      SELECT 'tool' as type, name as title, created_at FROM tools
      ORDER BY created_at DESC LIMIT 5
    `);
    
    // Combine and format activities
    const activities = [];
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        message: `New user "${user.username}" registered`,
        timestamp: new Date(user.created_at).toLocaleDateString()
      });
    });
    
    recentPractice.forEach(practice => {
      activities.push({
        type: 'practice',
        message: `"${practice.username}" completed "${practice.title}"`,
        timestamp: new Date(practice.completed_at).toLocaleDateString()
      });
    });
    
    recentContent.forEach(content => {
      activities.push({
        type: 'content',
        message: `New ${content.type} "${content.title}" added`,
        timestamp: new Date(content.created_at).toLocaleDateString()
      });
    });
    
    // Sort by timestamp and take top 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    connection.release();
    
    res.json({
      success: true,
      data: activities.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
  }
});

// Get top users
app.get('/api/admin/top-users', authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const [topUsers] = await connection.query(`
      SELECT 
        u.id,
        u.username,
        COUNT(upp.id) as completedScenarios,
        SUM(upp.score) as totalPoints
      FROM users u
      LEFT JOIN user_practice_progress upp ON u.id = upp.user_id AND upp.is_completed = 1
      GROUP BY u.id, u.username
      ORDER BY totalPoints DESC, completedScenarios DESC
      LIMIT 10
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: topUsers
    });
    
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch top users' });
  }
});

// Get user growth data
app.get('/api/admin/user-growth', authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Get user growth for last 7 days
    const [growthData] = await connection.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    
    connection.release();
    
    res.json({
      success: true,
      data: growthData
    });
    
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user growth data' });
  }
});

// Test endpoint to check admin auth without protection
app.get('/api/admin/test', (req, res) => {
  const token = req.cookies.admin_token;
  console.log('🔍 Admin test endpoint:');
  console.log('  - Cookie exists:', !!token);
  console.log('  - Token length:', token ? token.length : 0);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'admin_super_secret_key');
      console.log('  - Token valid:', true);
      console.log('  - Token payload:', decoded);
      res.json({ 
        success: true, 
        message: 'Token analysis',
        tokenExists: true,
        tokenValid: true,
        payload: decoded
      });
  } catch (error) {
      console.log('  - Token valid:', false);
      console.log('  - Token error:', error.message);
      res.json({ 
        success: false, 
        message: 'Token analysis',
        tokenExists: true,
        tokenValid: false,
        error: error.message
      });
    }
  } else {
    res.json({ 
      success: false, 
      message: 'Token analysis',
      tokenExists: false,
      tokenValid: false
    });
  }
});