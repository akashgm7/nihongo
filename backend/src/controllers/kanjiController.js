const prisma = require('../lib/db');

// Get all kanji, optionally filtered
const getKanji = async (req, res) => {
  try {
    const { jlptLevel, lessonNum, search, page = 1, limit = 50 } = req.query;
    const userId = req.userId;

    const where = {};
    if (jlptLevel) where.jlptLevel = jlptLevel;
    if (lessonNum) where.lessonNum = parseInt(lessonNum);
    if (search) {
      where.OR = [
        { character: { contains: search } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { onyomi: { contains: search, mode: 'insensitive' } },
        { kunyomi: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [kanji, total] = await Promise.all([
      prisma.kanji.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.kanji.count({ where })
    ]);

    // Get user progress
    const kanjiIds = kanji.map(k => k.id);
    const progress = await prisma.kanjiProgress.findMany({
      where: { userId, kanjiId: { in: kanjiIds } }
    });

    const kanjiWithProgress = kanji.map(k => {
      const p = progress.find(pr => pr.kanjiId === k.id);
      return {
        ...k,
        exampleWords: k.exampleWords ? JSON.parse(k.exampleWords) : [],
        exampleSentences: k.exampleSentences ? JSON.parse(k.exampleSentences) : [],
        mastery: p?.mastery || 0,
        reviewCount: p?.reviewCount || 0,
        lastReviewed: p?.lastReviewed || null
      };
    });

    res.json({
      data: kanjiWithProgress,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanji', error: error.message });
  }
};

// Get single kanji
const getKanjiById = async (req, res) => {
  try {
    const kanji = await prisma.kanji.findUnique({ where: { id: req.params.id } });
    if (!kanji) return res.status(404).json({ message: 'Kanji not found' });

    const progress = await prisma.kanjiProgress.findUnique({
      where: { userId_kanjiId: { userId: req.userId, kanjiId: kanji.id } }
    });

    res.json({
      ...kanji,
      exampleWords: kanji.exampleWords ? JSON.parse(kanji.exampleWords) : [],
      exampleSentences: kanji.exampleSentences ? JSON.parse(kanji.exampleSentences) : [],
      mastery: progress?.mastery || 0,
      reviewCount: progress?.reviewCount || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanji', error: error.message });
  }
};

// Get kanji by character (for lookup)
const getKanjiByCharacter = async (req, res) => {
  try {
    const kanji = await prisma.kanji.findUnique({
      where: { character: req.params.character }
    });
    if (!kanji) return res.status(404).json({ message: 'Kanji not found' });

    const progress = await prisma.kanjiProgress.findUnique({
      where: { userId_kanjiId: { userId: req.userId, kanjiId: kanji.id } }
    });

    res.json({
      ...kanji,
      exampleWords: kanji.exampleWords ? JSON.parse(kanji.exampleWords) : [],
      exampleSentences: kanji.exampleSentences ? JSON.parse(kanji.exampleSentences) : [],
      mastery: progress?.mastery || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanji', error: error.message });
  }
};

// Update kanji progress
const updateKanjiProgress = async (req, res) => {
  try {
    const { kanjiId, correct } = req.body;
    const userId = req.userId;

    const existing = await prisma.kanjiProgress.findUnique({
      where: { userId_kanjiId: { userId, kanjiId } }
    });

    let mastery = existing?.mastery || 0;
    if (correct) mastery = Math.min(5, mastery + 1);
    else mastery = Math.max(0, mastery - 1);

    const progress = await prisma.kanjiProgress.upsert({
      where: { userId_kanjiId: { userId, kanjiId } },
      update: {
        mastery,
        reviewCount: (existing?.reviewCount || 0) + 1,
        correctCount: (existing?.correctCount || 0) + (correct ? 1 : 0),
        lastReviewed: new Date()
      },
      create: {
        userId, kanjiId, mastery,
        reviewCount: 1,
        correctCount: correct ? 1 : 0,
        lastReviewed: new Date()
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating kanji progress', error: error.message });
  }
};

// Get kanji stats for dashboard
const getKanjiStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalN5, totalN4, masteredN5, masteredN4] = await Promise.all([
      prisma.kanji.count({ where: { jlptLevel: 'N5' } }),
      prisma.kanji.count({ where: { jlptLevel: 'N4' } }),
      prisma.kanjiProgress.count({
        where: { userId, mastery: { gte: 4 }, kanji: { jlptLevel: 'N5' } }
      }),
      prisma.kanjiProgress.count({
        where: { userId, mastery: { gte: 4 }, kanji: { jlptLevel: 'N4' } }
      })
    ]);

    res.json({
      n5: { total: totalN5, mastered: masteredN5 },
      n4: { total: totalN4, mastered: masteredN4 },
      totalMastered: masteredN5 + masteredN4
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanji stats', error: error.message });
  }
};

module.exports = {
  getKanji, getKanjiById, getKanjiByCharacter,
  updateKanjiProgress, getKanjiStats
};
