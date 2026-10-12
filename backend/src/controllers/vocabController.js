const prisma = require('../lib/db');

// Get all vocabulary, optionally filtered by jlptLevel, lessonNum, category
const getVocabulary = async (req, res) => {
  try {
    const { jlptLevel, lessonNum, category, search, page = 1, limit = 50 } = req.query;
    const userId = req.userId;
    
    const where = {};
    if (jlptLevel) where.jlptLevel = jlptLevel;
    if (lessonNum) where.lessonNum = parseInt(lessonNum);
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { reading: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [vocabulary, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.vocabulary.count({ where })
    ]);

    // Get user progress for these vocab items
    const vocabIds = vocabulary.map(v => v.id);
    const progress = await prisma.vocabProgress.findMany({
      where: { userId, vocabId: { in: vocabIds } }
    });

    const vocabWithProgress = vocabulary.map(v => {
      const userProgress = progress.find(p => p.vocabId === v.id);
      return {
        ...v,
        mastery: userProgress?.mastery || 0,
        reviewCount: userProgress?.reviewCount || 0,
        lastReviewed: userProgress?.lastReviewed || null
      };
    });

    res.json({
      data: vocabWithProgress,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vocabulary', error: error.message });
  }
};

// Get single vocabulary item
const getVocabById = async (req, res) => {
  try {
    const vocab = await prisma.vocabulary.findUnique({ where: { id: req.params.id } });
    if (!vocab) return res.status(404).json({ message: 'Vocabulary not found' });

    const progress = await prisma.vocabProgress.findUnique({
      where: { userId_vocabId: { userId: req.userId, vocabId: vocab.id } }
    });

    res.json({ ...vocab, mastery: progress?.mastery || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vocabulary', error: error.message });
  }
};

// Get vocabulary for a specific lesson number
const getVocabByLesson = async (req, res) => {
  try {
    const lessonNum = parseInt(req.params.lessonNum);
    const userId = req.userId;

    const vocabulary = await prisma.vocabulary.findMany({
      where: { lessonNum },
      orderBy: { order: 'asc' }
    });

    const vocabIds = vocabulary.map(v => v.id);
    const progress = await prisma.vocabProgress.findMany({
      where: { userId, vocabId: { in: vocabIds } }
    });

    const vocabWithProgress = vocabulary.map(v => {
      const p = progress.find(pr => pr.vocabId === v.id);
      return { ...v, mastery: p?.mastery || 0, reviewCount: p?.reviewCount || 0 };
    });

    res.json(vocabWithProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson vocabulary', error: error.message });
  }
};

// Update vocabulary mastery after quiz/review
const updateVocabProgress = async (req, res) => {
  try {
    const { vocabId, correct } = req.body;
    const userId = req.userId;

    const existing = await prisma.vocabProgress.findUnique({
      where: { userId_vocabId: { userId, vocabId } }
    });

    let mastery = existing?.mastery || 0;
    let reviewCount = (existing?.reviewCount || 0) + 1;
    let correctCount = (existing?.correctCount || 0) + (correct ? 1 : 0);

    // Simple mastery calculation: increase on correct, decrease on wrong
    if (correct) {
      mastery = Math.min(5, mastery + 1);
    } else {
      mastery = Math.max(0, mastery - 1);
    }

    const progress = await prisma.vocabProgress.upsert({
      where: { userId_vocabId: { userId, vocabId } },
      update: { mastery, reviewCount, correctCount, lastReviewed: new Date() },
      create: { userId, vocabId, mastery, reviewCount, correctCount, lastReviewed: new Date() }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vocab progress', error: error.message });
  }
};

// Batch update vocab progress (after quiz)
const batchUpdateVocabProgress = async (req, res) => {
  try {
    const { results } = req.body; // [{vocabId, correct}]
    const userId = req.userId;

    const updates = [];
    for (const { vocabId, correct } of results) {
      const existing = await prisma.vocabProgress.findUnique({
        where: { userId_vocabId: { userId, vocabId } }
      });

      let mastery = existing?.mastery || 0;
      if (correct) mastery = Math.min(5, mastery + 1);
      else mastery = Math.max(0, mastery - 1);

      const progress = await prisma.vocabProgress.upsert({
        where: { userId_vocabId: { userId, vocabId } },
        update: {
          mastery,
          reviewCount: (existing?.reviewCount || 0) + 1,
          correctCount: (existing?.correctCount || 0) + (correct ? 1 : 0),
          lastReviewed: new Date()
        },
        create: {
          userId, vocabId, mastery,
          reviewCount: 1,
          correctCount: correct ? 1 : 0,
          lastReviewed: new Date()
        }
      });
      updates.push(progress);
    }

    res.json({ updated: updates.length, results: updates });
  } catch (error) {
    res.status(500).json({ message: 'Error batch updating vocab', error: error.message });
  }
};

// Get vocab stats for dashboard
const getVocabStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalN5, totalN4, masteredN5, masteredN4, inProgress] = await Promise.all([
      prisma.vocabulary.count({ where: { jlptLevel: 'N5' } }),
      prisma.vocabulary.count({ where: { jlptLevel: 'N4' } }),
      prisma.vocabProgress.count({
        where: { userId, mastery: { gte: 4 }, vocab: { jlptLevel: 'N5' } }
      }),
      prisma.vocabProgress.count({
        where: { userId, mastery: { gte: 4 }, vocab: { jlptLevel: 'N4' } }
      }),
      prisma.vocabProgress.count({
        where: { userId, mastery: { gte: 1, lt: 4 } }
      })
    ]);

    res.json({
      n5: { total: totalN5, mastered: masteredN5 },
      n4: { total: totalN4, mastered: masteredN4 },
      inProgress,
      totalMastered: masteredN5 + masteredN4
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vocab stats', error: error.message });
  }
};

module.exports = {
  getVocabulary, getVocabById, getVocabByLesson,
  updateVocabProgress, batchUpdateVocabProgress, getVocabStats
};
