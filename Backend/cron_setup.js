// Add this to your server.js file
const cron = require('node-cron');
const { prisma } = require('./config/db');

// Schedule streak reset to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily streak reset...');
    
    // Reset streak logic in Node.js instead of stored procedure
    // Reset current_streak to 0 for users whose last_login_date is more than 24 hours ago (yesterday)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000); // More than 2 days ago = lost streak
    
    await prisma.userStreak.updateMany({
      where: {
        last_login_date: {
          lt: twoDaysAgo
        },
        current_streak: {
          gt: 0
        }
      },
      data: {
        current_streak: 0
      }
    });

    console.log('Daily streak reset completed successfully');
  } catch (error) {
    console.error('Error in daily streak reset:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

console.log('Daily streak reset cron job scheduled for midnight UTC');
