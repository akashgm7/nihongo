const prisma = require('../lib/db');

// Start a study session
const startSession = async (req, res) => {
  try {
    const { type } = req.body; // "lesson", "flashcard", "quiz", "vocab", "kanji", "grammar"
    const userId = req.userId;

    const session = await prisma.studySession.create({
      data: { userId, type, startedAt: new Date() }
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error: error.message });
  }
};

// End a study session
const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemCount } = req.body;
    const userId = req.userId;

    const session = await prisma.studySession.findUnique({ where: { id } });
    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const endedAt = new Date();
    const duration = Math.round((endedAt - session.startedAt) / 1000);

    const updated = await prisma.studySession.update({
      where: { id },
      data: { endedAt, duration, itemCount: itemCount || 0 }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error ending session', error: error.message });
  }
};

// Get study stats for dashboard
const getStudyStats = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    
    // Today's stats
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // This week's stats (last 7 days)
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [todaySessions, weekSessions, allTimeSessions] = await Promise.all([
      prisma.studySession.findMany({
        where: { userId, startedAt: { gte: todayStart, lt: todayEnd } }
      }),
      prisma.studySession.findMany({
        where: { userId, startedAt: { gte: weekStart } }
      }),
      prisma.studySession.aggregate({
        where: { userId },
        _sum: { duration: true, itemCount: true },
        _count: { id: true }
      })
    ]);

    // Daily breakdown for the week
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const daySessions = weekSessions.filter(s => 
        s.startedAt >= dayStart && s.startedAt < dayEnd
      );

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        duration: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        items: daySessions.reduce((sum, s) => sum + (s.itemCount || 0), 0),
        sessions: daySessions.length
      });
    }

    res.json({
      today: {
        duration: todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        items: todaySessions.reduce((sum, s) => sum + (s.itemCount || 0), 0),
        sessions: todaySessions.length
      },
      week: {
        duration: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        items: weekSessions.reduce((sum, s) => sum + (s.itemCount || 0), 0),
        sessions: weekSessions.length
      },
      allTime: {
        duration: allTimeSessions._sum.duration || 0,
        items: allTimeSessions._sum.itemCount || 0,
        sessions: allTimeSessions._count.id || 0
      },
      dailyBreakdown: dailyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study stats', error: error.message });
  }
};

// Get comprehensive dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [
      vocabTotal, vocabMastered,
      kanjiTotal, kanjiMastered,
      grammarTotal, grammarCompleted,
      lessonsCompleted, lessonsTotal,
      flashcardsDue, flashcardsTotal,
      user
    ] = await Promise.all([
      prisma.vocabulary.count(),
      prisma.vocabProgress.count({ where: { userId, mastery: { gte: 4 } } }),
      prisma.kanji.count(),
      prisma.kanjiProgress.count({ where: { userId, mastery: { gte: 4 } } }),
      prisma.grammarPoint.count(),
      prisma.grammarProgress.count({ where: { userId, completed: true } }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
      prisma.lesson.count(),
      prisma.flashcard.count({ where: { userId, nextReview: { lte: new Date() } } }),
      prisma.flashcard.count({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streak: true } })
    ]);

    // Calculate JLPT estimates
    const n5VocabTotal = await prisma.vocabulary.count({ where: { jlptLevel: 'N5' } });
    const n5VocabMastered = await prisma.vocabProgress.count({
      where: { userId, mastery: { gte: 4 }, vocab: { jlptLevel: 'N5' } }
    });
    const n4VocabTotal = await prisma.vocabulary.count({ where: { jlptLevel: 'N4' } });
    const n4VocabMastered = await prisma.vocabProgress.count({
      where: { userId, mastery: { gte: 4 }, vocab: { jlptLevel: 'N4' } }
    });
    const n5KanjiTotal = await prisma.kanji.count({ where: { jlptLevel: 'N5' } });
    const n5KanjiMastered = await prisma.kanjiProgress.count({
      where: { userId, mastery: { gte: 4 }, kanji: { jlptLevel: 'N5' } }
    });
    const n4KanjiTotal = await prisma.kanji.count({ where: { jlptLevel: 'N4' } });
    const n4KanjiMastered = await prisma.kanjiProgress.count({
      where: { userId, mastery: { gte: 4 }, kanji: { jlptLevel: 'N4' } }
    });

    // Kana progress from lessons
    const kanaLessonsTotal = await prisma.lesson.count({
      where: { category: { in: ['Hiragana', 'Katakana'] } }
    });
    const kanaLessonsCompleted = await prisma.userProgress.count({
      where: { userId, completed: true, lesson: { category: { in: ['Hiragana', 'Katakana'] } } }
    });

    res.json({
      overview: {
        xp: user?.xp || 0,
        level: user?.level || 1,
        streak: user?.streak || 0,
        lessonsCompleted,
        lessonsTotal
      },
      vocabulary: { total: vocabTotal, mastered: vocabMastered },
      kanji: { total: kanjiTotal, mastered: kanjiMastered },
      grammar: { total: grammarTotal, completed: grammarCompleted },
      flashcards: { total: flashcardsTotal, due: flashcardsDue },
      jlpt: {
        kana: { total: kanaLessonsTotal || 1, completed: kanaLessonsCompleted, percentage: kanaLessonsTotal ? Math.round((kanaLessonsCompleted / kanaLessonsTotal) * 100) : 0 },
        n5: {
          vocabTotal: n5VocabTotal, vocabMastered: n5VocabMastered,
          kanjiTotal: n5KanjiTotal, kanjiMastered: n5KanjiMastered,
          percentage: (n5VocabTotal + n5KanjiTotal) > 0 
            ? Math.round(((n5VocabMastered + n5KanjiMastered) / (n5VocabTotal + n5KanjiTotal)) * 100)
            : 0
        },
        n4: {
          vocabTotal: n4VocabTotal, vocabMastered: n4VocabMastered,
          kanjiTotal: n4KanjiTotal, kanjiMastered: n4KanjiMastered,
          percentage: (n4VocabTotal + n4KanjiTotal) > 0
            ? Math.round(((n4VocabMastered + n4KanjiMastered) / (n4VocabTotal + n4KanjiTotal)) * 100)
            : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = { startSession, endSession, getStudyStats, getDashboardStats };
