// Add this to your server.js file
const cron = require('node-cron');

// Schedule streak reset to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily streak reset...');
    await executeQuery('CALL ResetInactiveStreaks()');
    console.log('Daily streak reset completed successfully');
  } catch (error) {
    console.error('Error in daily streak reset:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});

console.log('Daily streak reset cron job scheduled for midnight UTC');

