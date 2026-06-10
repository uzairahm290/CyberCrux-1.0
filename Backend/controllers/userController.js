const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const { prisma } = require('../config/db');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, fullName, country, description, linkedin_url, github_url, profilePicture } = req.body;
    
    const sanitizedUsername = sanitizeHtml(username || '', { allowedTags: [], allowedAttributes: {} }).trim();
    const sanitizedFullName = sanitizeHtml(fullName || '', { allowedTags: [], allowedAttributes: {} }).trim();
    
    if (!sanitizedUsername) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
    
    if (!sanitizedFullName) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
      return res.status(400).json({ success: false, message: 'Username can only contain letters, numbers, and underscores. No spaces allowed.' });
    }
    
    if (!validator.isLength(sanitizedUsername, { min: 3, max: 30 })) {
      return res.status(400).json({ success: false, message: 'Username must be between 3 and 30 characters' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: sanitizedUsername,
        id: { not: parseInt(userId, 10) }
      }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }
    
    if (linkedin_url && !linkedin_url.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ success: false, message: 'LinkedIn URL must be a valid URL' });
    }
    
    if (github_url && !github_url.match(/^https?:\/\/.+/)) {
      return res.status(400).json({ success: false, message: 'GitHub URL must be a valid URL' });
    }
    
    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: {
        username: sanitizedUsername,
        FullName: sanitizedFullName,
        country: country || null,
        description: description || null,
        linkedin_url: linkedin_url || null,
        github_url: github_url || null,
        profile_pic: profilePicture || null
      }
    });
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.getProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: { profile_pic: true }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      profilePicture: user.profile_pic
    });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile picture',
      error: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: {
        id: true,
        username: true,
        email: true,
        FullName: true,
        country: true,
        description: true,
        linkedin_url: true,
        github_url: true,
        profile_pic: true,
        created_at: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.FullName,
        country: user.country,
        description: user.description,
        linkedinUrl: user.linkedin_url,
        githubUrl: user.github_url,
        profilePicture: user.profile_pic,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profilePicture } = req.body;
    
    if (!profilePicture) {
      return res.status(400).json({ success: false, message: 'Profile picture is required' });
    }
    
    if (!profilePicture.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'Invalid image format. Please upload a valid image.' });
    }
    
    const base64Size = profilePicture.length * 0.75; 
    if (base64Size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image size too large. Please upload an image smaller than 5MB.' });
    }
    
    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { profile_pic: profilePicture }
    });
    
    res.json({
      success: true,
      message: 'Profile picture updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: error.message
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userCheck = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: { username: true, email: true, FullName: true }
    });
    
    if (!userCheck) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prisma handles cascading deletes if configured in schema.
    // Assuming schema is configured correctly, we just delete the user.
    await prisma.user.delete({
      where: { id: parseInt(userId, 10) }
    });
    
    res.clearCookie('token');
    
    try {
      const { sendAccountDeletionEmail } = require('../services/emailService');
      await sendAccountDeletionEmail(
        userCheck.email,
        userCheck.FullName,
        userCheck.username
      );
    } catch (emailError) {
      console.log(`⚠️ Failed to send account deletion email:`, emailError.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Account deleted successfully',
      details: {
        userId: userId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};
