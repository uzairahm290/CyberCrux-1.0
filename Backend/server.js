require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
app.use(express.json());
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

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Google OAuth - Profile received:', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName
    });

    // Check if user exists in database
    const existingUser = await executeQuery(
      'SELECT * FROM users WHERE google_id = ? OR email = ?', 
      [profile.id, profile.emails[0].value]
    );
    
    console.log('🔍 Database query result:', existingUser.length, 'users found');
    
    if (existingUser.length > 0) {
      // User exists, return user data
      const user = existingUser[0];
      console.log('✅ Existing user found:', user.username);
      return done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
        google_id: user.google_id
      });
    } else {
      // Create new user
      const username = profile.displayName || profile.emails[0].value.split('@')[0];
      const email = profile.emails[0].value;
      
      console.log('🆕 Creating new user:', { username, email, google_id: profile.id });
      
      // Generate a random password for Google users (they'll never use it)
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      const result = await executeQuery(
        'INSERT INTO users (username, email, google_id, password_hash) VALUES (?, ?, ?, ?)',
        [username, email, profile.id, hashedPassword]
      );
      
      console.log('✅ New user created with ID:', result.insertId);
      
      return done(null, {
        id: result.insertId,
        username: username,
        email: email,
        google_id: profile.id
      });
    }
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
}));

// Google OAuth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('🎉 Google OAuth callback successful');
    console.log('👤 User data:', req.user);
    
    // Create JWT token
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username, email: req.user.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    console.log('🔐 JWT token created for user:', req.user.username);

    // Set JWT as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('🍪 Cookie set, redirecting to:', `${FRONTEND_URL}/dashboard?auth=success`);

    // Redirect to frontend with success
    res.redirect(`${FRONTEND_URL}/dashboard?auth=success`);
  }
);

// Database connection
const pool = mysql.createPool(DB_CONFIG);
const executeQuery = async (query, params = []) => {
  const conn = await pool.getConnection();
  try {
    const [results] = await conn.execute(query, params);
    return results;
  } finally {
    conn.release();
  }
};

pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token is not valid' });
  }
}

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await executeQuery('SELECT id, username, email FROM users WHERE id = ?', [req.user.id]);
    
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: user[0] 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Example protected route
app.get('/api/auth/protected', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', user: req.user });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  let { username, email, password, confirmPassword } = req.body;

  // Sanitize inputs
  username = sanitizeHtml(username || '', { allowedTags: [], allowedAttributes: {} }).trim();
  email = sanitizeHtml(email || '', { allowedTags: [], allowedAttributes: {} }).trim();
  password = sanitizeHtml(password || '', { allowedTags: [], allowedAttributes: {} }).trim();
  confirmPassword = sanitizeHtml(confirmPassword || '', { allowedTags: [], allowedAttributes: {} }).trim();

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (!validator.isLength(username, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Username must be between 1 and 100 characters' });
  }
  if (!validator.isLength(email, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Email must be between 1 and 100 characters' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }
  if (!validator.isLength(password, { min: 6, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Password must be between 6 and 100 characters' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    const existing = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await executeQuery('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    return res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  let { emailOrUsername, password } = req.body;

  // Sanitize inputs
  emailOrUsername = sanitizeHtml(emailOrUsername || '', { allowedTags: [], allowedAttributes: {} }).trim();
  password = sanitizeHtml(password || '', { allowedTags: [], allowedAttributes: {} }).trim();

  // Validation
  if (!emailOrUsername || !password) {
    return res.status(400).json({ success: false, message: 'Both fields are required' });
  }
  if (!validator.isLength(emailOrUsername, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Email/Username must be between 1 and 100 characters' });
  }
  if (!validator.isLength(password, { min: 6, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Password must be between 6 and 100 characters' });
  }

  try {
    const rows = await executeQuery('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1', [emailOrUsername, emailOrUsername]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // JWT Token logic
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const rows = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await executeQuery('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, expires, email]);

    const link = `${FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'contact.cybercrux@gmail.com',
        pass: 'mfca gvba beyd tsru'
      }
    });

    await transporter.sendMail({
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: 'Password Reset - CyberCrux',
      html: `
      <div style="background: #f4f8fb; padding: 40px 0; min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
        <div style="max-width: 480px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12); padding: 32px 28px 28px 28px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src='https://i.imgur.com/2yaf2wb.png' alt='CyberCrux Logo' style="height: 48px; margin-bottom: 8px;" />
            <h2 style="color: #14305c; font-size: 2rem; margin: 0 0 8px 0; font-weight: 700;">Reset Your Password</h2>
            <p style="color: #4176e4; font-size: 1.1rem; margin: 0;">CyberCrux Security Platform</p>
          </div>
          <p style="color: #222; font-size: 1.05rem; margin-bottom: 28px; text-align: center;">We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour for your security.</p>
          <div style="text-align: center; margin-bottom: 36px;">
            <a href="${link}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #3fa9f5 0%, #4176e4 100%); color: #fff; font-weight: 700; border-radius: 32px; text-decoration: none; font-size: 1.25rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(65, 118, 228, 0.13); transition: background 0.2s, box-shadow 0.2s; border: none; cursor: pointer;">
              Reset Password
            </a>
          </div>
          <p style="color: #888; font-size: 0.98rem; text-align: center; margin-bottom: 0;">If you did not request this, you can safely ignore this email.<br/>For help, contact <a href="mailto:contact.cybercrux@gmail.com" style="color: #4176e4; text-decoration: underline;">support</a>.</p>
          <div style="margin-top: 32px; text-align: center;">
            <span style="color: #b8bcd5; font-size: 0.95rem;">&copy; ${new Date().getFullYear()} CyberCrux. All rights reserved.</span>
          </div>
        </div>
      </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Reset link sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const rows = await executeQuery('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
    if (rows.length === 0) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const user = rows[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    await executeQuery('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashedPassword, user.id]);

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Book CRUD
app.post('/api/books', async (req, res) => {
  const { title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO books (title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [title, author, category, cover, pdf, description, rating || 0, downloads || 0, read_time, pages, published, featured || false]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured } = req.body;
  try {
    await executeQuery(
      'UPDATE books SET title = ?, author = ?, category = ?, cover = ?, pdf = ?, description = ?, rating = ?, downloads = ?, read_time = ?, pages = ?, published = ?, featured = ? WHERE id = ?', 
      [title, author, category, cover, pdf, description, rating, downloads, read_time, pages, published, featured, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM books WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

app.get('/api/books', async (req, res) => {
  const { search, category, featured, sort } = req.query;
  try {
    let query = 'SELECT * FROM books';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(title LIKE ? OR author LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (featured === 'true') {
      conditions.push('featured = TRUE');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    if (sort) {
      switch (sort) {
        case 'featured':
          query += ' ORDER BY featured DESC, rating DESC';
          break;
        case 'rating':
          query += ' ORDER BY rating DESC';
          break;
        case 'downloads':
          query += ' ORDER BY downloads DESC';
          break;
        case 'newest':
          query += ' ORDER BY created_at DESC';
          break;
        case 'title':
          query += ' ORDER BY title ASC';
          break;
        default:
          query += ' ORDER BY featured DESC, rating DESC';
      }
    } else {
      query += ' ORDER BY featured DESC, rating DESC';
    }

    const books = await executeQuery(query, params);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book categories for filtering
app.get('/api/books/categories', async (req, res) => {
  try {
    const categories = await executeQuery(`
      SELECT 
        category as id, 
        category as name, 
        COUNT(*) as count 
      FROM books 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    // Add "All Books" option
    const allBooksCount = await executeQuery('SELECT COUNT(*) as count FROM books');
    const result = [
      { id: 'all', name: 'All Books', count: allBooksCount[0].count },
      ...categories
    ];
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const books = await executeQuery('SELECT * FROM books WHERE id = ?', [id]);
    if (books.length > 0) res.json(books[0]);
    else res.status(404).json({ error: 'Book not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Get book categories for filtering
app.get('/api/books/categories', async (req, res) => {
  try {
    const categories = await executeQuery(`
      SELECT 
        category as id, 
        category as name, 
        COUNT(*) as count 
      FROM books 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    // Add "All Books" option
    const allBooksCount = await executeQuery('SELECT COUNT(*) as count FROM books');
    const result = [
      { id: 'all', name: 'All Books', count: allBooksCount[0].count },
      ...categories
    ];
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create Tool
app.post('/api/tools', async (req, res) => {
  const { name, type, description, usage, image_url, download_url } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO tools (name, type, description, `usage`, image_url, download_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type, description, usage, image_url, download_url]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add tool' });
  }
});

// Get All Tools (with optional search)
app.get('/api/tools', async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT * FROM tools';
    const params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR type LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const tools = await executeQuery(query, params);
    res.json(tools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch tools' });
  }
});

app.put('/api/tools/:id', async (req, res) => {
  const { id } = req.params;
  let {
    name,
    type,
    description,
    usage,
    imageUrl,
    downloadUrl
  } = req.body;

  // Fallback to null if any are undefined
  name = name ?? null;
  type = type ?? null;
  description = description ?? null;
  usage = usage ?? null;
  imageUrl = imageUrl ?? null;
  downloadUrl = downloadUrl ?? null;

  try {
    await executeQuery(
      'UPDATE tools SET name = ?, type = ?, description = ?, `usage` = ?, image_url = ?, download_url = ? WHERE id = ?',
      [name, type, description, usage, imageUrl, downloadUrl, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update tool' });
  }
});



// Delete Tool
app.delete('/api/tools/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await executeQuery('DELETE FROM tools WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete tool' });
  }
});

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

// ==================== PRACTICE API ENDPOINTS ====================

// Test endpoint to check database tables
app.get('/api/practice/test', async (req, res) => {
  try {
    // Check if practice_scenarios table exists
    const tables = await executeQuery('SHOW TABLES LIKE "practice_scenarios"');
    console.log('Tables found:', tables);
    
    if (tables.length === 0) {
      return res.json({
        success: false,
        message: 'Practice tables do not exist. Please run the setup script.',
        tables: []
      });
    }
    
    // Count scenarios
    const count = await executeQuery('SELECT COUNT(*) as count FROM practice_scenarios');
    console.log('Scenarios count:', count);
    
    // Get a sample scenario
    const sample = await executeQuery('SELECT * FROM practice_scenarios LIMIT 1');
    console.log('Sample scenario:', sample);
    
    res.json({
      success: true,
      message: 'Database is properly set up',
      tables: tables.length,
      scenariosCount: count[0].count,
      sampleScenario: sample[0] || null
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Get all practice scenarios with filters
app.get('/api/practice/scenarios', async (req, res) => {
  try {
    const { category, difficulty, search, sortBy = 'popular', limit = 50, offset = 0 } = req.query;
    
    // First, let's try a simple query to see if the table exists
    const tableCheck = await executeQuery('SELECT COUNT(*) as count FROM practice_scenarios');
    console.log('Table check result:', tableCheck);
    
    if (tableCheck.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Practice scenarios table does not exist'
      });
    }
    
    // Start with a simpler query without complex joins and without LIMIT
    let query = 'SELECT * FROM practice_scenarios WHERE is_active = TRUE';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Add sorting
    switch (sortBy) {
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      case 'difficulty':
        query += ' ORDER BY FIELD(difficulty, "Easy", "Medium", "Hard")';
        break;
      case 'points':
        query += ' ORDER BY points DESC';
        break;
      case 'popular':
      default:
        query += ' ORDER BY views DESC, likes DESC';
        break;
    }
    
    console.log('Executing query without LIMIT:', query);
    console.log('With parameters:', params);
    
    // Get all scenarios without LIMIT
    const allScenarios = await executeQuery(query, params);
    
    // Handle pagination in JavaScript
    const limitNum = Math.max(1, parseInt(limit) || 50);
    const offsetNum = Math.max(0, parseInt(offset) || 0);
    const scenarios = allScenarios.slice(offsetNum, offsetNum + limitNum);
    
    // Parse JSON fields and add computed fields
    const formattedScenarios = scenarios.map(scenario => {
      let tags = [];
      try {
        // Try to parse as JSON first
        if (scenario.tags && typeof scenario.tags === 'string') {
          tags = JSON.parse(scenario.tags);
        } else if (Array.isArray(scenario.tags)) {
          tags = scenario.tags;
        } else if (scenario.tags && typeof scenario.tags === 'string' && scenario.tags.includes(',')) {
          // If it's a comma-separated string, split it
          tags = scenario.tags.split(',').map(tag => tag.trim());
        }
      } catch (error) {
        console.log('Error parsing tags for scenario:', scenario.id, 'Tags:', scenario.tags);
        // If JSON parsing fails, try to split by comma
        if (scenario.tags && typeof scenario.tags === 'string') {
          tags = scenario.tags.split(',').map(tag => tag.trim());
        }
      }

      return {
        ...scenario,
        tags: tags,
        completion_rate: parseFloat(scenario.completion_rate || 0),
        actual_questions_count: scenario.questions_count || 0,
        avg_score: parseFloat(scenario.completion_rate || 0),
        completion_count: 0 // We'll add this later if needed
      };
    });
    
    res.json({
      success: true,
      data: formattedScenarios,
      total: formattedScenarios.length
    });
  } catch (error) {
    console.error('Error fetching practice scenarios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice scenarios',
      error: error.message
    });
  }
});

// Get practice scenario by ID with questions
app.get('/api/practice/scenarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get scenario details
    const scenarios = await executeQuery(
      'SELECT * FROM practice_scenarios WHERE id = ? AND is_active = TRUE',
      [id]
    );
    
    if (scenarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Practice scenario not found'
      });
    }
    
    const scenario = scenarios[0];
    
    // Parse tags safely
    let tags = [];
    try {
      if (scenario.tags && typeof scenario.tags === 'string') {
        tags = JSON.parse(scenario.tags);
      } else if (Array.isArray(scenario.tags)) {
        tags = scenario.tags;
      } else if (scenario.tags && typeof scenario.tags === 'string' && scenario.tags.includes(',')) {
        tags = scenario.tags.split(',').map(tag => tag.trim());
      }
    } catch (error) {
      console.log('Error parsing tags for scenario:', scenario.id, 'Tags:', scenario.tags);
      if (scenario.tags && typeof scenario.tags === 'string') {
        tags = scenario.tags.split(',').map(tag => tag.trim());
      }
    }
    scenario.tags = tags;
    
    // Get questions for this scenario
    const questions = await executeQuery(
      'SELECT * FROM practice_questions WHERE scenario_id = ? AND is_active = TRUE ORDER BY order_index ASC',
      [id]
    );
    
    // Parse JSON fields in questions safely
    const formattedQuestions = questions.map(question => {
      let options = null;
      try {
        if (question.options && typeof question.options === 'string') {
          options = JSON.parse(question.options);
        } else if (Array.isArray(question.options)) {
          options = question.options;
        }
      } catch (error) {
        console.log('Error parsing options for question:', question.id, 'Options:', question.options);
      }
      
      return {
        ...question,
        options: options
      };
    });
    
    res.json({
      success: true,
      data: {
        ...scenario,
        questions: formattedQuestions
      }
    });
  } catch (error) {
    console.error('Error fetching practice scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice scenario',
      error: error.message
    });
  }
});

// Get user's practice progress
app.get('/api/practice/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const progress = await executeQuery(
      `SELECT 
        ps.id, ps.title, ps.category, ps.difficulty,
        upp.score, upp.time_taken, upp.completed_at, upp.is_completed,
        upp.answers
      FROM practice_scenarios ps
      LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ?
      WHERE ps.is_active = TRUE
      ORDER BY upp.completed_at DESC`,
      [userId]
    );
    
    const formattedProgress = progress.map(item => ({
      ...item,
      answers: item.answers ? JSON.parse(item.answers) : null
    }));
    
    res.json({
      success: true,
      data: formattedProgress
    });
  } catch (error) {
    console.error('Error fetching practice progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice progress',
      error: error.message
    });
  }
});

// Save practice progress
app.post('/api/practice/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { scenarioId, score, timeTaken, answers, isCompleted } = req.body;
    
    if (!scenarioId) {
      return res.status(400).json({
        success: false,
        message: 'Scenario ID is required'
      });
    }
    
    // Check if progress already exists
    const existingProgress = await executeQuery(
      'SELECT * FROM user_practice_progress WHERE user_id = ? AND scenario_id = ?',
      [userId, scenarioId]
    );
    
    if (existingProgress.length > 0) {
      // Update existing progress
      await executeQuery(
        `UPDATE user_practice_progress 
         SET score = ?, time_taken = ?, answers = ?, is_completed = ?, completed_at = ?
         WHERE user_id = ? AND scenario_id = ?`,
        [
          score || 0,
          timeTaken || 0,
          JSON.stringify(answers || {}),
          isCompleted || false,
          isCompleted ? new Date() : null,
          userId,
          scenarioId
        ]
      );
    } else {
      // Create new progress
      await executeQuery(
        `INSERT INTO user_practice_progress 
         (user_id, scenario_id, score, time_taken, answers, is_completed, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          scenarioId,
          score || 0,
          timeTaken || 0,
          JSON.stringify(answers || {}),
          isCompleted || false,
          isCompleted ? new Date() : null
        ]
      );
    }
    
    // Update scenario stats
    if (isCompleted) {
      await executeQuery(
        'UPDATE practice_scenarios SET views = views + 1 WHERE id = ?',
        [scenarioId]
      );
    }
    
    res.json({
      success: true,
      message: 'Practice progress saved successfully'
    });
  } catch (error) {
    console.error('Error saving practice progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save practice progress',
      error: error.message
    });
  }
});

// Toggle bookmark for a scenario
app.post('/api/practice/bookmark/:scenarioId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { scenarioId } = req.params;
    
    // Check if bookmark exists
    const existingBookmark = await executeQuery(
      'SELECT * FROM user_practice_bookmarks WHERE user_id = ? AND scenario_id = ?',
      [userId, scenarioId]
    );
    
    if (existingBookmark.length > 0) {
      // Remove bookmark
      await executeQuery(
        'DELETE FROM user_practice_bookmarks WHERE user_id = ? AND scenario_id = ?',
        [userId, scenarioId]
      );
      
      res.json({
        success: true,
        message: 'Bookmark removed',
        isBookmarked: false
      });
    } else {
      // Add bookmark
      await executeQuery(
        'INSERT INTO user_practice_bookmarks (user_id, scenario_id) VALUES (?, ?)',
        [userId, scenarioId]
      );
      
      res.json({
        success: true,
        message: 'Bookmark added',
        isBookmarked: true
      });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle bookmark',
      error: error.message
    });
  }
});

// Get user's bookmarked scenarios
app.get('/api/practice/bookmarks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookmarks = await executeQuery(
      `SELECT ps.*, upb.created_at as bookmarked_at
       FROM practice_scenarios ps
       INNER JOIN user_practice_bookmarks upb ON ps.id = upb.scenario_id
       WHERE upb.user_id = ? AND ps.is_active = TRUE
       ORDER BY upb.created_at DESC`,
      [userId]
    );
    
    const formattedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: JSON.parse(bookmark.tags || '[]')
    }));
    
    res.json({
      success: true,
      data: formattedBookmarks
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookmarks',
      error: error.message
    });
  }
});

// Get practice statistics
app.get('/api/practice/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's practice statistics
    const stats = await executeQuery(
      `SELECT 
        COUNT(*) as total_scenarios,
        COUNT(CASE WHEN is_completed = TRUE THEN 1 END) as completed_scenarios,
        AVG(CASE WHEN is_completed = TRUE THEN score END) as average_score,
        SUM(CASE WHEN is_completed = TRUE THEN time_taken END) as total_time,
        MAX(completed_at) as last_completed
       FROM user_practice_progress upp
       INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
       WHERE upp.user_id = ? AND ps.is_active = TRUE`,
      [userId]
    );
    
    // Get category breakdown
    const categoryStats = await executeQuery(
      `SELECT 
        ps.category,
        COUNT(*) as total,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END) as completed,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END) as avg_score
       FROM practice_scenarios ps
       LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ?
       WHERE ps.is_active = TRUE
       GROUP BY ps.category`,
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        overview: stats[0],
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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
