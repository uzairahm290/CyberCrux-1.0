const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('./db');

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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { google_id: profile.id },
          { email: profile.emails[0].value }
        ]
      }
    });
    
    console.log('🔍 Database query result:', existingUser ? 1 : 0, 'users found');
    
    if (existingUser) {
      // User exists, but let's ensure they're marked as verified (for existing Google users)
      const user = existingUser;
      if (!user.is_verified) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { is_verified: true }
          });
          console.log('✅ Marked existing Google user as verified:', user.username);
        } catch (error) {
          console.log('⚠️ Failed to update verification status for existing Google user:', error.message);
        }
      }
      
      console.log('✅ Existing user found:', user.username);
      return done(null, {
        id: user.id,
        username: user.username,
        FullName: user.FullName,
        email: user.email,
        google_id: user.google_id
      });
    } else {
      // Create new user
      const fullName = profile.displayName || profile.emails[0].value.split('@')[0];
      
      // Auto-generate unique username following the same pattern
      const maxUser = await prisma.user.aggregate({
        _max: { id: true }
      });
      const nextId = (maxUser._max.id || 0) + 1;
      
      // Generate username pattern: shadowhacker{id}
      let username = `shadowhacker${nextId}`;
      
      // Check if this username already exists (in case of gaps in IDs)
      let counter = 1;
      while (true) {
        const checkUsername = `shadowhacker${nextId + counter - 1}`;
        const existingUsername = await prisma.user.findUnique({
          where: { username: checkUsername }
        });
        if (!existingUsername) {
          username = checkUsername;
          break;
        }
        counter++;
      }
      
      const email = profile.emails[0].value;
    
      console.log('🆕 Creating new user:', { username, fullName, email, google_id: profile.id });
    
      // Generate a random password for Google users (they'll never use it)
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      // Generate verification token (even though Google users are verified, we need it for consistency)
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const result = await prisma.user.create({
        data: {
          username,
          FullName: fullName,
          email,
          google_id: profile.id,
          password_hash: hashedPassword,
          verification_token: verificationToken,
          verification_expires: verificationExpires,
          is_verified: true
        }
      });
      
      console.log('✅ New Google user created with ID:', result.id);
      
      // Send welcome email to Google users (they're already verified)
      try {
        const { sendWelcomeEmail } = require('../services/emailService');
        await sendWelcomeEmail(email, fullName, username);
        console.log('✅ Welcome email sent to Google user:', email);
      } catch (error) {
        console.log('⚠️ Failed to send welcome email to Google user:', error.message);
        // Don't fail the OAuth flow if email fails
      }
      
      return done(null, {
        id: result.id,
        username: username,
        FullName: fullName,
        email: email,
        google_id: profile.id
      });
    }
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport;
