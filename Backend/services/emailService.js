const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.cybercrux@gmail.com',
    pass: 'mfca gvba beyd tsru'
  }
});

// Welcome email template
const getWelcomeEmailTemplate = (fullName, username) => `
<div style="background: #f4f8fb; padding: 40px 0; min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12); padding: 32px 28px 28px 28px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src='https://i.imgur.com/2yaf2wb.png' alt='CyberCrux Logo' style="height: 48px; margin-bottom: 8px;" />
      <h2 style="color: #14305c; font-size: 2rem; margin: 0 0 8px 0; font-weight: 700;">Welcome to CyberCrux!</h2>
      <p style="color: #4176e4; font-size: 1.1rem; margin: 0;">Your Cybersecurity Journey Begins Here</p>
    </div>
    
    <div style="margin-bottom: 24px;">
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Hello <strong>${fullName}</strong>,</p>
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Welcome to CyberCrux! We're excited to have you join our cybersecurity community.</p>
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Your account has been successfully created with username: <strong>${username}</strong></p>
    </div>

    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="color: #14305c; font-size: 1.2rem; margin: 0 0 16px 0;">What's Next?</h3>
      <ul style="color: #555; font-size: 1rem; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Complete your profile and explore the platform</li>
        <li style="margin-bottom: 8px;">Start with our beginner-friendly practice scenarios</li>
        <li style="margin-bottom: 8px;">Join our community discussions and challenges</li>
        <li style="margin-bottom: 8px;">Track your progress and earn badges</li>
      </ul>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="http://localhost:5173/dashboard" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #3fa9f5 0%, #4176e4 100%); color: #fff; font-weight: 700; border-radius: 32px; text-decoration: none; font-size: 1.25rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(65, 118, 228, 0.13); transition: background 0.2s, box-shadow 0.2s; border: none; cursor: pointer;">
        Get Started
      </a>
    </div>

    <div style="margin-top: 32px; text-align: center;">
      <span style="color: #b8bcd5; font-size: 0.95rem;">&copy; ${new Date().getFullYear()} CyberCrux. All rights reserved.</span>
    </div>
  </div>
</div>
`;

// Verification email template
const getVerificationEmailTemplate = (fullName, verificationLink) => `
<div style="background: #f4f8fb; padding: 40px 0; min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12); padding: 32px 28px 28px 28px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src='https://i.imgur.com/2yaf2wb.png' alt='CyberCrux Logo' style="height: 48px; margin-bottom: 8px;" />
      <h2 style="color: #14305c; font-size: 2rem; margin: 0 0 8px 0; font-weight: 700;">Verify Your Email</h2>
      <p style="color: #4176e4; font-size: 1.1rem; margin: 0;">Complete Your Account Setup</p>
    </div>
    
    <div style="margin-bottom: 24px;">
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Hello <strong>${fullName}</strong>,</p>
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Thank you for joining CyberCrux! To complete your account setup and unlock all features, please verify your email address.</p>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #856404; font-size: 1rem; margin: 0; text-align: center;">
        <strong>⚠️ Important:</strong> Your account will have limited access until you verify your email.
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${verificationLink}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #28a745 0%, #20c997 100%); color: #fff; font-weight: 700; border-radius: 32px; text-decoration: none; font-size: 1.25rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(40, 167, 69, 0.13); transition: background 0.2s, box-shadow 0.2s; border: none; cursor: pointer;">
        Verify Email Address
      </a>
    </div>

    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="color: #14305c; font-size: 1.1rem; margin: 0 0 12px 0;">Why Verify?</h3>
      <ul style="color: #555; font-size: 0.95rem; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Unlock full platform access</li>
        <li style="margin-bottom: 6px;">Participate in competitions</li>
        <li style="margin-bottom: 6px;">Earn badges and certificates</li>
        <li style="margin-bottom: 6px;">Recover account if needed</li>
      </ul>
    </div>

    <p style="color: #666; font-size: 0.9rem; text-align: center; margin-bottom: 0;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="color: #4176e4; font-size: 0.9rem; text-align: center; margin-top: 8px; word-break: break-all;">${verificationLink}</p>

    <div style="margin-top: 32px; text-align: center;">
      <span style="color: #b8bcd5; font-size: 0.95rem;">&copy; ${new Date().getFullYear()} CyberCrux. All rights reserved.</span>
    </div>
  </div>
</div>
`;

// Send welcome email
const sendWelcomeEmail = async (email, fullName, username) => {
  try {
    const mailOptions = {
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: 'Welcome to CyberCrux! 🚀',
      html: getWelcomeEmailTemplate(fullName, username)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send verification email
const sendVerificationEmail = async (email, fullName, verificationToken) => {
  try {
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: 'Verify Your Email - CyberCrux 🔐',
      html: getVerificationEmailTemplate(fullName, verificationLink)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};



// Helper function to get reliable badge icon
const getReliableBadgeIcon = (iconUrl) => {
  // List of reliable icon URLs that work well in emails
  const reliableIcons = [
    'https://img.icons8.com/color/96/000000/trophy.png',
    'https://img.icons8.com/color/96/000000/medal.png',
    'https://img.icons8.com/color/96/000000/star.png',
    'https://img.icons8.com/color/96/000000/crown.png',
    'https://img.icons8.com/color/96/000000/diamond.png'
  ];
  
  // If iconUrl is provided and looks reliable, use it
  if (iconUrl && (iconUrl.includes('icons8.com') || iconUrl.includes('imgur.com') || iconUrl.includes('postimg.cc'))) {
    return iconUrl;
  }
  
  // Return a random reliable icon as fallback
  return reliableIcons[Math.floor(Math.random() * reliableIcons.length)];
};

// Badge earned email template
const getBadgeEarnedTemplate = (fullName, badgeName, badgeDescription, badgeIcon, badgeRarity, pointsEarned) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🏆 New Badge Earned - CyberCrux</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
    
    <!-- Main Container -->
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header Section with Animated Background -->
        <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px 24px 0 0; padding: 40px 30px 30px 30px; text-align: center; position: relative; overflow: hidden;">
            
            <!-- Animated Background Elements -->
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: linear-gradient(45deg, #ff6b6b, #feca57); border-radius: 50%; opacity: 0.1;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: linear-gradient(45deg, #48dbfb, #0abde3); border-radius: 50%; opacity: 0.1;"></div>
            
            <!-- Logo and Main Title -->
            <div style="position: relative; z-index: 2;">
                <img src='https://i.imgur.com/2yaf2wb.png' alt='CyberCrux Logo' style="height: 60px; margin-bottom: 20px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));" />
                
                <!-- Celebration Emojis -->
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 2.5rem; margin: 0 8px; display: inline-block;">🎉</span>
                    <span style="font-size: 2.5rem; margin: 0 8px; display: inline-block;">🏆</span>
                    <span style="font-size: 2.5rem; margin: 0 8px; display: inline-block;">🎊</span>
                </div>
                
                <h1 style="color: #14305c; font-size: 2.5rem; margin: 0 0 12px 0; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Badge Earned!</h1>
                <p style="color: #4176e4; font-size: 1.3rem; margin: 0; font-weight: 600; letter-spacing: 0.5px;">Congratulations on Your Achievement</p>
            </div>
        </div>
        
        <!-- Personal Greeting -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; text-align: center; border-left: 4px solid #667eea; border-right: 4px solid #667eea;">
            <p style="color: #222; font-size: 1.2rem; margin: 0 0 16px 0; font-weight: 500;">Hello <strong style="color: #667eea; font-weight: 700;">${fullName}</strong>,</p>
            <p style="color: #555; font-size: 1.1rem; margin: 0; line-height: 1.6;">
                🚀 You've just unlocked a new achievement! Your dedication, hard work, and passion for cybersecurity are truly inspiring.
            </p>
        </div>
        
        <!-- Badge Showcase Section -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 40px 30px; text-align: center; position: relative;">
            
            <!-- Badge Icon Container -->
            <div style="margin-bottom: 30px; position: relative;">
                <!-- Glowing Effect Behind Badge -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%); border-radius: 50%;"></div>
                
                <!-- Badge Icon -->
                <div style="position: relative; z-index: 2; display: inline-block;">
                    <img src="${badgeIcon}" alt="${badgeName}" style="width: 100px; height: 100px; border-radius: 50%; border: 6px solid #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.8);" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                    
                    <!-- Fallback Badge Icon -->
                    <div id="fallback-icon" style="display: none; width: 100px; height: 100px; border-radius: 50%; border: 6px solid #fff; background: linear-gradient(135deg, #667eea, #764ba2); margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                        <span style="color: #fff; font-size: 3rem; font-weight: bold;">🏆</span>
                    </div>
                </div>
            </div>
            
            <!-- Badge Details -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #14305c; font-size: 2rem; margin: 0 0 16px 0; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${badgeName}</h2>
                <p style="color: #666; font-size: 1.1rem; margin: 0 0 24px 0; line-height: 1.5; font-style: italic;">"${badgeDescription}"</p>
                
                <!-- Badge Stats -->
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <!-- Rarity Badge -->
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 12px 24px; border-radius: 25px; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);">
                        <span style="color: #fff; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${badgeRarity}</span>
                    </div>
                    
                    <!-- Points Badge -->
                    <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 12px 24px; border-radius: 25px; box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);">
                        <span style="color: #fff; font-size: 1rem; font-weight: 700;">+${pointsEarned} Points</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Achievement Explanation -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 16px; padding: 25px; border-left: 4px solid #667eea;">
                <h3 style="color: #14305c; font-size: 1.3rem; margin: 0 0 16px 0; font-weight: 700; display: flex; align-items: center;">
                    <span style="margin-right: 12px;">🎯</span>
                    What This Achievement Means
                </h3>
                <p style="color: #555; font-size: 1rem; margin: 0; line-height: 1.6;">
                    You've demonstrated exceptional skills and dedication in your cybersecurity journey. 
                    This badge represents your commitment to learning, growth, and excellence in the field. 
                    Every achievement brings you closer to becoming a cybersecurity expert!
                </p>
            </div>
        </div>
        
        <!-- Call to Action -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:5173/badges" style="display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #28a745, #20c997); color: #fff; font-weight: 700; border-radius: 50px; text-decoration: none; font-size: 1.2rem; letter-spacing: 0.5px; box-shadow: 0 8px 24px rgba(40, 167, 69, 0.3); border: none; cursor: pointer; position: relative; overflow: hidden;">
                <span style="position: relative; z-index: 2;">🎖️ View All Badges</span>
            </a>
        </div>
        
        <!-- Progress Encouragement -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 25px; margin-bottom: 20px; border-radius: 0 0 24px 24px;">
            <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 16px; padding: 20px; text-align: center; border: 2px solid #bbdefb;">
                <h4 style="color: #1565c0; font-size: 1.1rem; margin: 0 0 12px 0; font-weight: 700;">💡 Pro Tips for Success</h4>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px;">
                    <div style="text-align: center; flex: 1; min-width: 120px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">🎯</div>
                        <p style="color: #1565c0; font-size: 0.9rem; margin: 0; font-weight: 600;">Set Goals</p>
                    </div>
                    <div style="text-align: center; flex: 1; min-width: 120px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">📚</div>
                        <p style="color: #1565c0; font-size: 0.9rem; margin: 0; font-weight: 600;">Practice Daily</p>
                    </div>
                    <div style="text-align: center; flex: 1; min-width: 120px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">🏆</div>
                        <p style="color: #1565c0; font-size: 0.9rem; margin: 0; font-weight: 600;">Earn More</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: rgba(255, 255, 255, 0.95); padding: 20px; text-align: center; border-radius: 0 0 24px 24px;">
            <p style="color: #666; font-size: 0.9rem; margin: 0 0 10px 0;">
                <strong>Keep pushing your limits!</strong> Your cybersecurity journey is just beginning.
            </p>
            <p style="color: #999; font-size: 0.8rem; margin: 0;">
                &copy; ${new Date().getFullYear()} CyberCrux. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;

// Send badge earned email
const sendBadgeEarnedEmail = async (email, fullName, badgeName, badgeDescription, badgeIcon, badgeRarity, pointsEarned) => {
  try {
    // Get a reliable badge icon
    const reliableIcon = getReliableBadgeIcon(badgeIcon);
    
    const mailOptions = {
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: `🏆 New Badge Earned: ${badgeName} - CyberCrux`,
      html: getBadgeEarnedTemplate(fullName, badgeName, badgeDescription, reliableIcon, badgeRarity, pointsEarned)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Badge earned email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending badge earned email:', error);
    return { success: false, error: error.message };
  }
};

// Account deletion email template
const getAccountDeletionTemplate = (fullName, username) => `
<div style="background: #f4f8fb; padding: 40px 0; min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
  <div style="max-width: 480px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12); padding: 32px 28px 28px 28px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src='https://i.imgur.com/2yaf2wb.png' alt='CyberCrux Logo' style="height: 48px; margin-bottom: 8px;" />
      <h2 style="color: #14305c; font-size: 2rem; margin: 0 0 8px 0; font-weight: 700;">👋 Account Deleted</h2>
      <p style="color: #4176e4; font-size: 1.1rem; margin: 0;">We're Sorry to See You Go</p>
    </div>
    
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 16px;">Hello <strong>${fullName}</strong>,</p>
      <p style="color: #222; font-size: 1.05rem; margin-bottom: 24px;">We're sad to see you leave CyberCrux. Your account with username <strong>${username}</strong> has been successfully deleted.</p>
    </div>

    <!-- Account Deletion Details -->
    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #14305c; font-size: 1.1rem; margin: 0 0 12px 0;">📋 What Was Deleted:</h4>
      <ul style="color: #555; font-size: 0.95rem; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Your user profile and account settings</li>
        <li style="margin-bottom: 6px;">All practice progress and scores</li>
        <li style="margin-bottom: 6px;">Earned badges and achievements</li>
        <li style="margin-bottom: 6px;">Session data and activity logs</li>
        <li style="margin-bottom: 6px;">Personal notifications and preferences</li>
      </ul>
    </div>

    <!-- Important Notice -->
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #856404; font-size: 0.95rem; margin: 0; text-align: center;">
        <strong>⚠️ Important:</strong> This action cannot be undone. All your data has been permanently removed.
      </p>
    </div>

    <!-- Come Back Message -->
    <div style="background: #e3f2fd; border: 1px solid #bbdefb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h4 style="color: #1565c0; font-size: 1.1rem; margin: 0 0 12px 0;">🔄 Want to Come Back?</h4>
      <p style="color: #1565c0; font-size: 0.95rem; margin: 0; line-height: 1.5;">
        We'd love to have you back! You can always create a new account and start fresh. 
        Your cybersecurity journey doesn't have to end here.
      </p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="http://localhost:5173/signup" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #28a745 0%, #20c997 100%); color: #fff; font-weight: 700; border-radius: 32px; text-decoration: none; font-size: 1.25rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(40, 167, 69, 0.13); transition: background 0.2s, box-shadow 0.2s; border: none; cursor: pointer;">
        Create New Account
      </a>
    </div>

    <!-- Feedback -->
    <div style="background: #f8f9fa; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #555; font-size: 0.9rem; margin: 0; text-align: center;">
        <strong>💬 Feedback:</strong> If you have any suggestions for improvement, we'd love to hear from you at 
        <a href="mailto:contact.cybercrux@gmail.com" style="color: #4176e4; text-decoration: underline;">contact.cybercrux@gmail.com</a>
      </p>
    </div>

    <div style="margin-top: 32px; text-align: center;">
      <span style="color: #b8bcd5; font-size: 0.95rem;">&copy; ${new Date().getFullYear()} CyberCrux. All rights reserved.</span>
    </div>
  </div>
</div>
`;

// Send account deletion email
const sendAccountDeletionEmail = async (email, fullName, username) => {
  try {
    const mailOptions = {
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: '👋 Account Deleted - CyberCrux',
      html: getAccountDeletionTemplate(fullName, username)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Account deletion email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending account deletion email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email (reusing existing functionality)
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: 'contact.cybercrux@gmail.com',
      to: email,
      subject: 'Password Reset - CyberCrux 🔑',
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
            <a href="${resetLink}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #3fa9f5 0%, #4176e4 100%); color: #fff; font-weight: 700; border-radius: 32px; text-decoration: none; font-size: 1.25rem; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(65, 118, 228, 0.13); transition: background 0.2s, box-shadow 0.2s; border: none; cursor: pointer;">
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
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully to:', email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBadgeEarnedEmail,
  sendAccountDeletionEmail
};
