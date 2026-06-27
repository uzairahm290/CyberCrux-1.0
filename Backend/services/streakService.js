const { prisma } = require('../config/db');
const { checkAndAwardBadges } = require('./badgeService');

async function safeRecordUserLogin(connection, user_id) {
  try {
    const existingStreak = await prisma.userStreak.findUnique({
      where: { user_id: parseInt(user_id, 10) }
    });

    if (!existingStreak) {
      try {
        await prisma.userStreak.create({
          data: {
            user_id: parseInt(user_id, 10),
            current_streak: 1,
            longest_streak: 1,
            last_login_date: new Date(),
            streak_start_date: new Date()
          }
        });
      } catch (err) {
        // If unique constraint fails, it means another concurrent request already created the streak. We can safely ignore it.
        if (err.code !== 'P2002') {
          throw err;
        }
      }
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastLoginDate = existingStreak.last_login_date ? new Date(existingStreak.last_login_date) : null;
      if (lastLoginDate) {
        lastLoginDate.setHours(0, 0, 0, 0);
      }
      
      let newStreak = existingStreak.current_streak;
      let newLongestStreak = existingStreak.longest_streak;
      
      if (!lastLoginDate || lastLoginDate < today) {
        if (lastLoginDate && Math.round((today - lastLoginDate) / (1000 * 60 * 60 * 24)) === 1) {
          newStreak += 1;
          if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
          }
        } else {
          newStreak = 1;
        }
      }
      
      await prisma.userStreak.update({
        where: { user_id: parseInt(user_id, 10) },
        data: {
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_login_date: new Date(),
          updated_at: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Error in safeRecordUserLogin:', error);
  }
}

module.exports = {
  safeRecordUserLogin
};
