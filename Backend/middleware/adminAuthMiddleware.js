const jwt = require('jsonwebtoken');

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

module.exports = { authenticateAdmin, adminRateLimit };
