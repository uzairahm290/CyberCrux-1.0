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
// const { pool, executeQuery } = require('./config/db'); // Removed to use Prisma
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

// Extracted Middleware
const { authenticateAdmin, adminRateLimit } = require('./middleware/adminAuthMiddleware');

// Extracted Services
const { checkAndAwardBadges } = require('./services/badgeService');
const { notifyNewScenariosAdded } = require('./services/notificationService');
const { safeRecordUserLogin } = require('./services/streakService');


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
    const { prisma } = require('./config/db');
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection test successful');
    
    // Check table structure (PostgreSQL way to get columns)
    const columns = await prisma.$queryRaw`
      SELECT column_name as "Field", data_type as "Type"
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    console.log('📋 Users table structure:', columns);
    
    // Check if google_id column exists
    const hasGoogleId = columns.some(col => col.Field === 'google_id');
    console.log('🔍 google_id column exists:', hasGoogleId);
    
    // Count users
    const usersCount = await prisma.user.count();
    console.log('👥 Total users:', usersCount);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      tableStructure: columns,
      hasGoogleId: hasGoogleId,
      userCount: usersCount
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


// ==================== EXTRACTED MODULAR ROUTES ====================
app.use('/', require('./routes/practiceRoutes'));
app.use('/', require('./routes/toolRoutes'));
app.use('/', require('./routes/blogRoutes'));
app.use('/', require('./routes/adminRoutes'));
app.use('/', require('./routes/chatRoutes'));
app.use('/', require('./routes/profileRoutes'));
app.use('/', require('./routes/notificationRoutes'));
app.use('/', require('./routes/badgeRoutes'));
app.use('/', require('./routes/streakRoutes'));
app.use('/', require('./routes/adminDashboardRoutes'));

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

