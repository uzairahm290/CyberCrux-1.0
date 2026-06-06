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

router.get("/api/tools", async (req, res) => {
  try {
    const rows = await prisma.tool.findMany();
    // Prisma already parses Json fields if defined as Json in schema
    const parsedRows = rows.map(tool => ({
      ...tool,
      commands: tool.commands || [],
      platforms: tool.platforms || [],
    }));
    res.json(parsedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving tools" });
  }
});

// Add tool
router.post("/api/tools", async (req, res) => {
  try {
    const toolData = {
      ...req.body,
      commands: req.body.commands || [],
      platforms: req.body.platforms || [],
    };

    const result = await prisma.tool.create({
      data: toolData
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding tool" });
  }
});

// Update tool
router.put("/api/tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove fields that shouldn't be updated manually
    const { created_at, updated_at, id: toolId, ...updateData } = req.body;
    
    // Prisma handles Json fields natively, so we just pass the object/array
    if (updateData.commands === undefined) delete updateData.commands;
    if (updateData.platforms === undefined) delete updateData.platforms;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const result = await prisma.tool.update({
      where: { id: parseInt(id, 10) },
      data: updateData
    });
    res.json({ success: true, updatedRows: 1, tool: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating tool" });
  }
});

// Delete tool
router.delete("/api/tools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tool.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting tool" });
  }
});

// Search tools
router.get("/api/tools/search", async (req, res) => {
  const { category, search } = req.query;
  const whereClause = {};

  if (category && category !== "all") {
    whereClause.category = category;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { type: { contains: search, mode: 'insensitive' } }
    ];
  }

  try {
    const result = await prisma.tool.findMany({ where: whereClause });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching tools" });
  }
});

router.get("/api/tools/categories", async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      select: { category: true },
      distinct: ['category'],
      where: {
        category: {
          not: null,
          not: ''
        }
      }
    });
    const categories = tools.map(t => t.category).filter(Boolean);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving categories" });
  }
});

// Tool Practice API Endpoints

// Get all tool practice scenarios (simplified - no user tracking)
router.get("/api/tool-practice/scenarios", async (req, res) => {
  try {
    const { tool_name, admin } = req.query;
    
    const whereClause = {};
    if (!admin) {
      whereClause.is_active = true;
    }
    
    if (tool_name) {
      whereClause.tool_name = tool_name;
    }
    
    const queryOpts = {
      where: whereClause,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        tool_name: true,
        scenario_title: true,
        scenario_description: true,
        difficulty: true,
        correct_command: true,
        command_pieces: true,
        explanation: true,
        is_active: true
      }
    };
    
    if (!admin) {
      queryOpts.take = 10;
    }
    
    const scenarios = await prisma.toolPracticeScenario.findMany(queryOpts);
    
    const parsedScenarios = scenarios.map(scenario => ({
      ...scenario,
      command_pieces: scenario.command_pieces || []
    }));
    
    res.json({
      success: true,
      data: parsedScenarios
    });
  } catch (error) {
    console.error('Error fetching tool practice scenarios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scenarios'
    });
  }
});

// Simple answer checker (no user tracking)
router.post("/api/tool-practice/check", async (req, res) => {
  try {
    const { scenarioId, submittedCommand } = req.body;
    
    const scenario = await prisma.toolPracticeScenario.findUnique({
      where: { id: parseInt(scenarioId, 10) }
    });
    
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    
    const isCorrect = submittedCommand.trim().toLowerCase() === scenario.correct_command.trim().toLowerCase();
    
    res.json({
      success: true,
      isCorrect,
      correctCommand: scenario.correct_command,
      explanation: scenario.explanation
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check answer'
    });
  }
});

// Admin CRUD endpoints for tool practice scenarios

// Create new scenario
router.post("/api/tool-practice/scenarios", async (req, res) => {
  try {
    const {
      tool_name,
      scenario_title,
      scenario_description,
      difficulty,
      correct_command,
      command_pieces,
      explanation,
      is_active = true
    } = req.body;

    if (!tool_name || !scenario_title || !scenario_description || !correct_command || !command_pieces) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!Array.isArray(command_pieces)) {
      return res.status(400).json({
        success: false,
        message: 'command_pieces must be an array'
      });
    }

    const result = await prisma.toolPracticeScenario.create({
      data: {
        tool_name,
        scenario_title,
        scenario_description,
        difficulty,
        correct_command,
        command_pieces,
        explanation,
        is_active
      }
    });

    res.json({
      success: true,
      message: 'Scenario created successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario'
    });
  }
});

// Update scenario
router.put("/api/tool-practice/scenarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tool_name,
      scenario_title,
      scenario_description,
      difficulty,
      correct_command,
      command_pieces,
      explanation,
      is_active
    } = req.body;

    if (!tool_name || !scenario_title || !scenario_description || !correct_command || !command_pieces) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!Array.isArray(command_pieces)) {
      return res.status(400).json({
        success: false,
        message: 'command_pieces must be an array'
      });
    }

    await prisma.toolPracticeScenario.update({
      where: { id: parseInt(id, 10) },
      data: {
        tool_name,
        scenario_title,
        scenario_description,
        difficulty,
        correct_command,
        command_pieces,
        explanation,
        is_active
      }
    });

    res.json({
      success: true,
      message: 'Scenario updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') { // Prisma Record to update not found
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    console.error('Error updating scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update scenario'
    });
  }
});

// Delete scenario
router.delete("/api/tool-practice/scenarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.toolPracticeScenario.delete({
      where: { id: parseInt(id, 10) }
    });

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scenario'
    });
  }
});

module.exports = router;