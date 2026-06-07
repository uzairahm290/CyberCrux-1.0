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

router.post('/api/categories', async (req, res) => {
  const { key_name, label, description, color_gradient } = req.body;
  try {
    const result = await prisma.practiceCategory.create({
      data: { key_name, label, description, color_gradient }
    });
    res.json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a scenario
router.post('/api/scenarios', async (req, res) => {
  const {
    title,
    category,
    difficulty,
    time_estimate,
    questions_count,
    points,
    completion_rate,
    likes,
    views,
    description,
    tags,
    is_featured,
    is_active,
  } = req.body;

  try {
    const result = await prisma.practiceScenario.create({
      data: {
        title,
        category,
        difficulty,
        time_estimate,
        questions_count,
        points,
        completion_rate,
        likes,
        views,
        description,
        tags,
        is_featured,
        is_active
      }
    });
    res.json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions for a scenario
router.get('/api/questions/scenario/:scenarioId', async (req, res) => {
  const { scenarioId } = req.params;
  try {
    const questions = await prisma.practiceQuestion.findMany({
      where: { scenario_id: parseInt(scenarioId, 10) },
      orderBy: { question_order: 'asc' }
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a question
router.post('/api/questions', authenticateAdmin, async (req, res) => {
  const {
    scenario_id,
    question_text,
    correct_answer,
    points,
    explanation,
    question_order,
  } = req.body;

  try {
    const result = await prisma.practiceQuestion.create({
      data: {
        scenario_id,
        question_text,
        correct_answer,
        points,
        explanation,
        question_order
      }
    });
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a question
router.delete('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.practiceQuestion.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    console.error("Error deleting question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single question by ID
router.get('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const question = await prisma.practiceQuestion.findUnique({
      where: { id: parseInt(id, 10) }
    });
    
    if (question) {
      res.json({ success: true, data: question });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a question
router.put('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    scenario_id,
    question_text,
    correct_answer,
    points,
    explanation,
    question_order,
  } = req.body;

  try {
    await prisma.practiceQuestion.update({
      where: { id: parseInt(id, 10) },
      data: {
        scenario_id,
        question_text,
        correct_answer,
        points,
        explanation,
        question_order
      }
    });
    res.json({ success: true, message: 'Question updated successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    console.error("Error updating question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE a scenario by ID
router.delete('/api/practice/scenarios/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.practiceScenario.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ success: true, message: 'Scenario deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: 'Failed to delete scenario' });
  }
});

// CREATE a new practice scenario
router.post('/api/practice/scenarios', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      difficulty,
      time_estimate,
      questions_count,
      points,
      description,
      short_description,
      is_featured = false,
      is_active = true,
      file_url,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !category || !difficulty || !points) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, category, difficulty, and points are required' 
      });
    }

    const result = await prisma.practiceScenario.create({
      data: {
        title,
        category,
        difficulty,
        time_estimate: time_estimate || null,
        questions_count: questions_count || 0,
        points,
        description: description || '',
        short_description: short_description || null,
        is_featured,
        is_active,
        file_url: file_url || null,
        tags: tags || null
      }
    });

    // Notify all users about new scenario
    try {
      await notifyNewScenariosAdded(category, 1);
    } catch (notifyError) {
      console.error('Failed to notify users about new scenario:', notifyError);
    }

    res.json({ 
      success: true, 
      message: 'Scenario created successfully',
      id: result.id 
    });
  } catch (error) {
    console.error('Create scenario error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create scenario',
      error: error.message 
    });
  }
});

// UPDATE an existing practice scenario
router.put('/api/practice/scenarios/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      difficulty,
      time_estimate,
      questions_count,
      points,
      description,
      short_description,
      is_featured,
      is_active,
      file_url,
      tags
    } = req.body;

    await prisma.practiceScenario.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        category,
        difficulty,
        time_estimate: time_estimate || null,
        questions_count: questions_count || 0,
        points,
        description: description || '',
        short_description: short_description || null,
        is_featured,
        is_active,
        file_url: file_url || null,
        tags: tags || null
      }
    });

    res.json({ 
      success: true, 
      message: 'Scenario updated successfully' 
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false, 
        message: 'Scenario not found' 
      });
    }
    console.error('Update scenario error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update scenario',
      error: error.message 
    });
  }
});

module.exports = router;