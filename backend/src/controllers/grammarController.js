const prisma = require('../lib/db');

// Get all grammar points, optionally filtered
const getGrammarPoints = async (req, res) => {
  try {
    const { jlptLevel, lessonNum, category, search, page = 1, limit = 50 } = req.query;
    const userId = req.userId;

    const where = {};
    if (jlptLevel) where.jlptLevel = jlptLevel;
    if (lessonNum) where.lessonNum = parseInt(lessonNum);
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { explanation: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [grammarPoints, total] = await Promise.all([
      prisma.grammarPoint.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.grammarPoint.count({ where })
    ]);

    // Get user progress
    const grammarIds = grammarPoints.map(g => g.id);
    const progress = await prisma.grammarProgress.findMany({
      where: { userId, grammarId: { in: grammarIds } }
    });

    const grammarWithProgress = grammarPoints.map(g => {
      const p = progress.find(pr => pr.grammarId === g.id);
      return {
        ...g,
        examples: g.examples ? JSON.parse(g.examples) : [],
        exercises: g.exercises ? JSON.parse(g.exercises) : [],
        mastery: p?.mastery || 0,
        completed: p?.completed || false,
        reviewCount: p?.reviewCount || 0
      };
    });

    res.json({
      data: grammarWithProgress,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grammar', error: error.message });
  }
};

// Get single grammar point
const getGrammarById = async (req, res) => {
  try {
    const grammar = await prisma.grammarPoint.findUnique({ where: { id: req.params.id } });
    if (!grammar) return res.status(404).json({ message: 'Grammar point not found' });

    const progress = await prisma.grammarProgress.findUnique({
      where: { userId_grammarId: { userId: req.userId, grammarId: grammar.id } }
    });

    res.json({
      ...grammar,
      examples: grammar.examples ? JSON.parse(grammar.examples) : [],
      exercises: grammar.exercises ? JSON.parse(grammar.exercises) : [],
      mastery: progress?.mastery || 0,
      completed: progress?.completed || false
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grammar', error: error.message });
  }
};

// Update grammar progress
const updateGrammarProgress = async (req, res) => {
  try {
    const { grammarId, correct, completed } = req.body;
    const userId = req.userId;

    const existing = await prisma.grammarProgress.findUnique({
      where: { userId_grammarId: { userId, grammarId } }
    });

    let mastery = existing?.mastery || 0;
    if (correct !== undefined) {
      if (correct) mastery = Math.min(5, mastery + 1);
      else mastery = Math.max(0, mastery - 1);
    }

    const progress = await prisma.grammarProgress.upsert({
      where: { userId_grammarId: { userId, grammarId } },
      update: {
        mastery,
        completed: completed !== undefined ? completed : (existing?.completed || false),
        reviewCount: (existing?.reviewCount || 0) + 1,
        lastReviewed: new Date()
      },
      create: {
        userId, grammarId, mastery,
        completed: completed || false,
        reviewCount: 1,
        lastReviewed: new Date()
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grammar progress', error: error.message });
  }
};

// Get grammar stats
const getGrammarStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalN5, totalN4, completedN5, completedN4] = await Promise.all([
      prisma.grammarPoint.count({ where: { jlptLevel: 'N5' } }),
      prisma.grammarPoint.count({ where: { jlptLevel: 'N4' } }),
      prisma.grammarProgress.count({
        where: { userId, completed: true, grammar: { jlptLevel: 'N5' } }
      }),
      prisma.grammarProgress.count({
        where: { userId, completed: true, grammar: { jlptLevel: 'N4' } }
      })
    ]);

    res.json({
      n5: { total: totalN5, completed: completedN5 },
      n4: { total: totalN4, completed: completedN4 },
      totalCompleted: completedN5 + completedN4
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grammar stats', error: error.message });
  }
};

module.exports = {
  getGrammarPoints, getGrammarById,
  updateGrammarProgress, getGrammarStats
};
