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

router.post("/api/blogs", async (req, res) => {
  const {
    title,
    author,
    author_avatar,
    date,
    read_time,
    category,
    tags,
    excerpt,
    content,
    featured,
    views = 0
  } = req.body;

  try {
    const result = await prisma.blog.create({
      data: {
        title,
        author,
        author_avatar,
        date: new Date(date),
        read_time,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags, // Convert array to CSV if needed
        excerpt,
        content,
        featured,
        views
      }
    });
    res.status(201).json({ id: result.id, message: "Blog saved successfully" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Only return blogs with 'roadmap' in the title (case-insensitive)
router.get("/api/blogs1", async (req, res) => {
  try {
    const rows = await prisma.blog.findMany({
      where: {
        title: {
          contains: 'roadmap',
          mode: 'insensitive'
        }
      }
    });
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// GET: Fetch roadmap blog by ID
router.get("/api/blogs1/:id", async (req, res) => {
  try {
    const rows = await prisma.blog.findMany({
      where: {
        id: parseInt(req.params.id, 10),
        title: {
          contains: 'roadmap',
          mode: 'insensitive'
        }
      }
    });
    if (rows.length === 0) {
      return res.status(404).json({ error: "Roadmap not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch roadmap by ID Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// POST: Increment roadmap view count
router.post("/api/blogs1/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    
    const rows = await prisma.blog.findMany({
      where: {
        id: parseInt(id, 10),
        title: {
          contains: 'roadmap',
          mode: 'insensitive'
        }
      }
    });
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: parseInt(id, 10) },
      data: {
        views: { increment: 1 }
      }
    });
    
    res.json({ 
      success: true, 
      message: "View count incremented",
      views: updatedBlog.views || 0
    });
  } catch (err) {
    console.error("Increment view count Error:", err);
    res.status(500).json({ error: "Failed to increment view count" });
  }
});

router.get("/api/blogs", async (req, res) => {
  try {
    const rows = await prisma.blog.findMany();
    res.json(rows);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// GET: Fetch blog by ID
router.get("/api/blogs/:id", async (req, res) => {
  try {
    const row = await prisma.blog.findUnique({
      where: { id: parseInt(req.params.id, 10) }
    });
    if (!row) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(row);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

router.put("/api/blogs/:id", async (req, res) => {
  const {
    title,
    author,
    author_avatar,
    date,
    read_time,
    category,
    tags,
    excerpt,
    content,
    featured,
    views
  } = req.body;

  const { id } = req.params;

  try {
    await prisma.blog.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        author,
        author_avatar,
        date: date ? new Date(date) : undefined,
        read_time,
        category,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        excerpt,
        content,
        featured,
        views
      }
    });

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE blog
router.delete("/api/blogs/:id", async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: parseInt(req.params.id, 10) }
    });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Blog not found" });
    }
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Database delete failed" });
  }
});

module.exports = router;