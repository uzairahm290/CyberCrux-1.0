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

module.exports = { adminRateLimit };