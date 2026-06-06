const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');
const { authenticateAdmin, adminRateLimit } = require('../middleware/adminAuthMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_google_api_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const { checkAndAwardBadges } = require('../services/badgeService');
const { notifyNewScenariosAdded } = require('../services/notificationService');
const { safeRecordUserLogin } = require('../services/streakService');

// ==================== PRACTICE API ENDPOINTS ====================

// ==================== SIMPLE TRYHACKME STYLE API ====================
// Only fill-in-blank questions, no complex types

// Get all practice scenarios
router.get('/api/practice/scenarios', async (req, res) => {
  try {
    const scenarios = await prisma.practiceScenario.findMany({
      where: { is_active: true },
      orderBy: [{ difficulty: 'desc' }, { points: 'desc' }]
    });

    // Get learning resources for each scenario
    const scenariosWithResources = await Promise.all(scenarios.map(async (scenario) => {
      const resources = await prisma.learningResource.findMany({
        where: { scenario_id: scenario.id },
        select: { id: true, title: true, url: true, type: true, description: true }
      });

      return {
        ...scenario,
        learning_resources: resources
      };
    }));
    
    res.json({
      success: true,
      data: scenariosWithResources
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ message: 'Failed to fetch scenarios' });
  }
});

// Get specific scenario with questions
router.get('/api/practice/scenarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const scenario = await prisma.practiceScenario.findUnique({
      where: { id: parseInt(id, 10), is_active: true }
    });
    
    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }
    
    // Get questions for this scenario
    const questions = await prisma.practiceQuestion.findMany({
      where: { scenario_id: parseInt(id, 10) },
      orderBy: { question_order: 'asc' }
    });
    
    // Get learning resources for this scenario
    const resources = await prisma.learningResource.findMany({
      where: { scenario_id: parseInt(id, 10) },
      select: { id: true, title: true, url: true, type: true, description: true }
    });
    
    const formattedScenario = {
      ...scenario,
      learning_resources: resources,
      questions: questions
    };
    
    res.json({
      success: true,
      data: formattedScenario
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ message: 'Failed to fetch scenario' });
  }
});

// Get user progress
router.get('/api/practice/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const progress = await prisma.$queryRaw`
      SELECT 
        upp.id,
        upp.scenario_id,
        upp.score,
        upp.max_score,
        upp.is_completed,
        upp.completed_at,
        upp.time_taken,
        ps.title,
        ps.category,
        ps.difficulty,
        ps.points as scenario_points
      FROM user_practice_progress upp
      JOIN practice_scenarios ps ON upp.scenario_id = ps.id
      WHERE upp.user_id = ${userId}
      ORDER BY upp.completed_at DESC
    `;
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// Submit answers and get score (simple fill-in-blank scoring)
router.post('/api/practice/submit-answers', authenticateToken, async (req, res) => {
  try {
    const { scenarioId, answers } = req.body;
    const userId = req.user.id;

    if (!scenarioId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Get questions and correct answers
    const questions = await prisma.practiceQuestion.findMany({
      where: { scenario_id: parseInt(scenarioId, 10) },
      select: { id: true, correct_answer: true, points: true },
      orderBy: { question_order: 'asc' }
    });
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this scenario' });
    }

    // Simple scoring - exact match (case-insensitive)
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index] || '';
      const correctAnswer = question.correct_answer;
      const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      
      if (isCorrect) {
        totalScore += question.points || 0;
      }
      
      maxScore += question.points || 0;
      
      results.push({
        questionId: question.id,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        points: question.points || 0,
        earnedPoints: isCorrect ? (question.points || 0) : 0
      });
    });

    const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Check if user has already completed this scenario
    const existingProgress = await prisma.userPracticeProgress.findMany({
      where: { user_id: userId, scenario_id: parseInt(scenarioId, 10) },
      select: { is_completed: true, score: true }
    });

    let pointsToAward = 0;
    let isNewCompletion = false;

    if (existingProgress.length === 0) {
      // First time completing this scenario
      isNewCompletion = true;
      pointsToAward = totalScore;
      
      // Insert new progress
      await prisma.userPracticeProgress.create({
        data: {
          user_id: userId,
          scenario_id: parseInt(scenarioId, 10),
          score: totalScore,
          max_score: maxScore,
          is_completed: true,
          completed_at: new Date()
        }
      });
    } else if (!existingProgress[0].is_completed) {
      // User was working on it but hadn't completed it before
      isNewCompletion = true;
      pointsToAward = totalScore;
      
      // Update progress to completed
      await prisma.userPracticeProgress.updateMany({
        where: { user_id: userId, scenario_id: parseInt(scenarioId, 10) },
        data: {
          score: totalScore,
          max_score: maxScore,
          is_completed: true,
          completed_at: new Date()
        }
      });
    } else {
      // User has already completed this scenario - no new points awarded
      pointsToAward = 0;
      
      // Update progress but don't award new points
      await prisma.userPracticeProgress.updateMany({
        where: { user_id: userId, scenario_id: parseInt(scenarioId, 10) },
        data: {
          score: totalScore,
          max_score: maxScore,
          completed_at: new Date()
        }
      });
    }

    // Only check and award badges for new completions
    if (isNewCompletion) {
      await checkAndAwardBadges(userId, 'scenario_completion', {
        scenarioId: scenarioId,
        score: finalScore,
        time_taken: 0, // You can add time tracking later
        category: 'practice'
      });
    }
      
    // Determine response message based on completion status
    let message;
    if (isNewCompletion) {
      message = `Scenario completed! Score: ${totalScore}/${maxScore} (${finalScore}%) - ${pointsToAward} points earned!`;
    } else {
      message = `Scenario replayed! Score: ${totalScore}/${maxScore} (${finalScore}%) - No new points (already completed)`;
    }
      
    res.json({
      success: true,
      score: totalScore,
      maxScore: maxScore,
      percentage: finalScore,
      results: results,
      message: message,
      pointsAwarded: pointsToAward,
      isNewCompletion: isNewCompletion
    });

  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Failed to submit answers' });
  }
});

// Get practice leaderboard
router.get('/api/practice/leaderboard', async (req, res) => {
  try {
    // Parse and sanitize limit/offset
    const limit = 50;
    const offset = 0;
    
    const leaderboard = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.profile_pic,
        u.country,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END)::int as completed_scenarios,
        COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END), 0)::int as total_points,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::float as average_score,
        MAX(upp.completed_at) as last_completed,
        COALESCE(us.current_streak, 0)::int as current_streak,
        COALESCE(us.longest_streak, 0)::int as longest_streak
       FROM users u
       LEFT JOIN user_practice_progress upp ON u.id = upp.user_id
       LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
       LEFT JOIN user_streaks us ON u.id = us.user_id
       GROUP BY u.id, u.username, u.profile_pic, u.country, us.current_streak, us.longest_streak
       HAVING COALESCE(SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END), 0) > 0
       ORDER BY total_points DESC, completed_scenarios DESC, average_score DESC
       LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Add rank and badge count to each user
    const rankedLeaderboard = await Promise.all(leaderboard.map(async (user, index) => {
      // Get badge count for each user
      const badgeCount = await prisma.userBadge.count({
        where: { user_id: user.id }
      });
      
      return {
        ...user,
        user_rank: offset + index + 1,
        badges: badgeCount
      };
    }));
    
    res.json({
      success: true,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

// Get practice statistics
router.get('/api/practice/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's practice statistics with correct point calculation
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*)::int as total_scenarios,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END)::int as completed_scenarios,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::float as average_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.time_taken END)::int as total_time,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::int as total_points_earned,
        MAX(upp.completed_at) as last_completed
       FROM practice_scenarios ps
       LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ${userId}
       WHERE ps.is_active = TRUE
    `;
    
    // Calculate day streak
    const streakData = await prisma.$queryRaw`
      SELECT 
        DATE(completed_at) as completion_date,
        COUNT(*)::int as completions_per_day
       FROM user_practice_progress upp
       INNER JOIN practice_scenarios ps ON upp.scenario_id = ps.id
       WHERE upp.user_id = ${userId} AND upp.is_completed = TRUE AND ps.is_active = TRUE
       GROUP BY DATE(completed_at)
       ORDER BY completion_date DESC
    `;
    
    let currentStreak = 0;
    if (streakData.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      for (let i = 0; i < streakData.length; i++) {
        const date = streakData[i].completion_date.toISOString ? streakData[i].completion_date.toISOString().split('T')[0] : new Date(streakData[i].completion_date).toISOString().split('T')[0];
        if (i === 0 && (date === today || date === yesterday)) {
          currentStreak = 1;
          // Check consecutive days
          for (let j = 1; j < streakData.length; j++) {
            const expectedDate = new Date(date);
            expectedDate.setDate(expectedDate.getDate() - j);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            const nextDateStr = streakData[j] && (streakData[j].completion_date.toISOString ? streakData[j].completion_date.toISOString().split('T')[0] : new Date(streakData[j].completion_date).toISOString().split('T')[0]);
            if (nextDateStr === expectedDateStr) {
              currentStreak++;
            } else {
              break;
            }
          }
          break;
        }
      }
    }
    
    // Get user's rank based on total points earned - simplified approach
    const allUserPoints = await prisma.$queryRaw`
      SELECT 
         u.id,
         COALESCE(SUM(upp.score), 0)::int as total_points
       FROM users u
       LEFT JOIN user_practice_progress upp ON u.id = upp.user_id AND upp.is_completed = TRUE
       LEFT JOIN practice_scenarios ps ON upp.scenario_id = ps.id AND ps.is_active = TRUE
       GROUP BY u.id
       ORDER BY total_points DESC
    `;
    
    // Calculate user's rank in JavaScript
    const currentUserPoints = stats[0].total_points_earned || 0;
    const userRank = allUserPoints.findIndex(user => user.id === userId) + 1;
    const finalRank = userRank > 0 ? userRank : allUserPoints.length + 1;
    
    // Get total users count for ranking context
    const totalUsers = await prisma.user.count();
    
    // Get category breakdown
    const categoryStats = await prisma.$queryRaw`
      SELECT 
        ps.category,
        COUNT(*)::int as total,
        COUNT(CASE WHEN upp.is_completed = TRUE THEN 1 END)::int as completed,
        AVG(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::float as avg_score,
        SUM(CASE WHEN upp.is_completed = TRUE THEN upp.score END)::int as points_earned
       FROM practice_scenarios ps
       LEFT JOIN user_practice_progress upp ON ps.id = upp.scenario_id AND upp.user_id = ${userId}
       WHERE ps.is_active = TRUE
       GROUP BY ps.category
    `;
    
    res.json({
      success: true,
      data: {
        overview: {
          ...stats[0],
          total_points_earned: stats[0].total_points_earned || 0,
          current_streak: currentStreak,
          rank: finalRank,
          total_users: totalUsers || 1
        },
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching practice stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice statistics',
      error: error.message
    });
  }
});

module.exports = router;