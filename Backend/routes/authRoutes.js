const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Google OAuth
router.get('/google', (req, res, next) => {
  const prompt = req.query.prompt || 'select_account';
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: prompt 
  })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, username: req.user.username, email: req.user.email, fullName: req.user.FullName, isVerified: true },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect(`${FRONTEND_URL}/dashboard?auth=success`);
  }
);

// Standard Auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/google/logout', authController.googleLogout);
router.post('/google/enhanced-logout', authController.enhancedLogout);
router.get('/google/select-account', authController.switchAccount); // Using switchAccount logic
router.post('/google/switch-account', authController.switchAccount);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);
router.get('/protected', authenticateToken, authController.getProtected);
router.put('/update', authenticateToken, authController.legacyUpdate);
router.put('/change-password', authenticateToken, authController.changePassword);

// Password recovery and verification
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

module.exports = router;
