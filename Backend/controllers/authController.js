const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const { prisma } = require('../config/db');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.id, 10) },
      select: { id: true, username: true, FullName: true, email: true, profile_pic: true }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      user: user 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProtected = (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', user: req.user });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.googleLogout = (req, res) => {
  res.clearCookie('token');
  const googleLogoutUrl = 'https://accounts.google.com/logout';
  res.redirect(googleLogoutUrl);
};

exports.enhancedLogout = (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true, 
    message: 'Logged out successfully. To switch Google accounts, please close all browser tabs and login again.',
    googleLogoutUrl: 'https://accounts.google.com/logout'
  });
};

exports.switchAccount = (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true, 
    message: 'Session cleared. Please login with different Google account.',
    redirectUrl: '/api/auth/google?prompt=select_account'
  });
};

exports.signup = async (req, res) => {
  let { username, fullName, email, password, confirmPassword } = req.body;

  username = sanitizeHtml(username || '', { allowedTags: [], allowedAttributes: {} }).trim();
  fullName = sanitizeHtml(fullName || '', { allowedTags: [], allowedAttributes: {} }).trim();
  email = sanitizeHtml(email || '', { allowedTags: [], allowedAttributes: {} }).trim();
  password = sanitizeHtml(password || '', { allowedTags: [], allowedAttributes: {} }).trim();
  confirmPassword = sanitizeHtml(confirmPassword || '', { allowedTags: [], allowedAttributes: {} }).trim();

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Full name, email, and password are required' });
  }
  
  if (username) {
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ success: false, message: 'Username can only contain letters, numbers, and underscores. No spaces allowed.' });
    }
    if (!validator.isLength(username, { min: 3, max: 30 })) {
      return res.status(400).json({ success: false, message: 'Username must be between 3 and 30 characters' });
    }
  }
  
  if (!validator.isLength(fullName, { min: 1, max: 100 })) {
    return res.status(400).json({ success: false, message: 'Full name must be between 1 and 100 characters' });
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
    const existingEmail = await prisma.user.findUnique({
      where: { email: email }
    });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    let finalUsername = username;
    
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: username }
      });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: 'Username already taken. Please choose a different username.' });
      }
    } else {
      const maxUser = await prisma.user.aggregate({
        _max: { id: true }
      });
      const nextId = (maxUser._max.id || 0) + 1;
      
      finalUsername = `shadowhacker${nextId}`;
      
      let counter = 1;
      while (true) {
        const checkUsername = `shadowhacker${nextId + counter - 1}`;
        const existingUser = await prisma.user.findUnique({
          where: { username: checkUsername }
        });
        if (!existingUser) {
          finalUsername = checkUsername;
          break;
        }
        counter++;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const newUser = await prisma.user.create({
      data: {
        username: finalUsername,
        FullName: fullName,
        email: email,
        password_hash: hashedPassword,
        verification_token: verificationToken,
        verification_expires: verificationExpires,
        is_verified: false
      }
    });
    
    await sendWelcomeEmail(email, fullName, finalUsername);
    await sendVerificationEmail(email, fullName, verificationToken);
    
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email, fullName: newUser.FullName, isVerified: false },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Account created successfully! Check your email for verification. You are now logged in.',
      username: finalUsername,
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.FullName,
        email: newUser.email,
        isVerified: false
      },
      note: username ? 'Your chosen username was used.' : `A unique username "${finalUsername}" was automatically generated for you.`
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  let { emailOrUsername, password } = req.body;

  emailOrUsername = sanitizeHtml(emailOrUsername || '', { allowedTags: [], allowedAttributes: {} }).trim();
  password = sanitizeHtml(password || '', { allowedTags: [], allowedAttributes: {} }).trim();

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
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, fullName: user.FullName },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

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
        fullName: user.FullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await prisma.user.findFirst({
      where: {
        verification_token: token,
        verification_expires: { gt: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification token' 
      });
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        verification_token: null,
        verification_expires: null
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Email verified successfully! Your account is now fully activated.',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.FullName,
        email: user.email,
        isVerified: true
      }
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'User is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verification_token: verificationToken,
        verification_expires: verificationExpires
      }
    });

    await sendVerificationEmail(user.email, user.FullName, verificationToken);

    res.json({
      success: true,
      message: 'Verification email resent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend verification email' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email: email },
      data: {
        reset_token: token,
        reset_token_expires: expires
      }
    });

    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ success: true, message: 'Reset link sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: { gt: new Date() }
      }
    });
    
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    
    const isSamePassword = await bcrypt.compare(password, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password cannot be the same as your current password. Please choose a different password.' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      }
    });

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.legacyUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, profile_pic } = req.body;
    
    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: {
        username: username,
        FullName: username,
        profile_pic: profile_pic || null
      }
    });
    
    res.json({ success: true, message: 'Profile updated successfully (using legacy endpoint)' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password cannot be the same as your current password. Please choose a different password.' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { password_hash: hashedPassword }
    });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};
