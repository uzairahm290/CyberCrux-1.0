const { prisma } = require('../config/db');

async function notifyNewScenariosAdded(category, count) {
  try {
    const users = await prisma.user.findMany({ select: { id: true } });
    
    if (users.length > 0) {
      const data = users.map(user => ({
        user_id: user.id,
        type: 'system',
        title: '🆕 New Content Available',
        message: `${count} new ${category} scenarios have been added! Check them out and expand your skills!`,
        is_read: false
      }));

      await prisma.userNotification.createMany({
        data,
        skipDuplicates: true
      });
      
      console.log(`📢 Notified ${users.length} users about new ${category} scenarios`);
    }
  } catch (error) {
    console.error('Error notifying users about new scenarios:', error);
  }
}

module.exports = {
  notifyNewScenariosAdded
};
