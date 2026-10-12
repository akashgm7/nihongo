const prisma = require('../lib/db');

/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm
 * 
 * Rating scale: 0=Again, 1=Hard, 2=Good, 3=Easy
 * 
 * @param {number} quality - Rating 0-3
 * @param {number} repetitions - Current repetition count
 * @param {number} easeFactor - Current ease factor (≥ 1.3)
 * @param {number} interval - Current interval in days
 * @returns {{ interval, repetitions, easeFactor }}
 */
function sm2Algorithm(quality, repetitions, easeFactor, interval) {
  // Map our 0-3 scale to SM-2's 0-5 scale
  const q = quality <= 0 ? 0 : quality === 1 ? 2 : quality === 2 ? 4 : 5;

  let newInterval, newRepetitions, newEaseFactor;

  if (q < 3) {
    // Failed review — reset
    newRepetitions = 0;
    newInterval = 1;
    newEaseFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    // Successful review
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
    newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor
  };
}

// Get daily review queue (cards due for review)
const getReviewQueue = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    const dueCards = await prisma.flashcard.findMany({
      where: {
        userId,
        nextReview: { lte: now }
      },
      include: {
        vocab: true,
        kanji: true
      },
      orderBy: { nextReview: 'asc' },
      take: 50 // Cap at 50 cards per session
    });

    // Also get upcoming count
    const upcomingCount = await prisma.flashcard.count({
      where: { userId, nextReview: { gt: now } }
    });

    res.json({
      dueCards: dueCards.map(card => ({
        ...card,
        vocab: card.vocab || undefined,
        kanji: card.kanji ? {
          ...card.kanji,
          exampleWords: card.kanji.exampleWords ? JSON.parse(card.kanji.exampleWords) : []
        } : undefined
      })),
      dueCount: dueCards.length,
      upcomingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review queue', error: error.message });
  }
};

// Review a flashcard (apply SM-2)
const reviewFlashcard = async (req, res) => {
  try {
    const { flashcardId, rating } = req.body; // rating: 0-3
    const userId = req.userId;

    const card = await prisma.flashcard.findUnique({ where: { id: flashcardId } });
    if (!card || card.userId !== userId) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Apply SM-2
    const result = sm2Algorithm(rating, card.repetitions, card.easeFactor, card.interval);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + result.interval);

    // Update card
    const updatedCard = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        nextReview,
        lastReview: new Date()
      }
    });

    // Record review
    await prisma.flashcardReview.create({
      data: { flashcardId, rating }
    });

    res.json({
      card: updatedCard,
      nextReviewDate: nextReview,
      intervalDays: result.interval
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing flashcard', error: error.message });
  }
};

// Create flashcard(s) — manually or auto-generated
const createFlashcard = async (req, res) => {
  try {
    const { cardType, vocabId, kanjiId, front, back } = req.body;
    const userId = req.userId;

    const card = await prisma.flashcard.create({
      data: {
        userId, cardType,
        vocabId: vocabId || null,
        kanjiId: kanjiId || null,
        front, back,
        nextReview: new Date()
      }
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error creating flashcard', error: error.message });
  }
};

// Auto-generate flashcards from vocabulary or kanji the user has studied
const autoGenerateFlashcards = async (req, res) => {
  try {
    const userId = req.userId;
    const { type = 'vocabulary', jlptLevel } = req.body;

    let created = 0;

    if (type === 'vocabulary') {
      // Get vocab items user has studied but doesn't have flashcards for
      const studiedVocab = await prisma.vocabProgress.findMany({
        where: { userId },
        include: { vocab: true }
      });

      const existingCards = await prisma.flashcard.findMany({
        where: { userId, cardType: 'vocabulary' },
        select: { vocabId: true }
      });
      const existingVocabIds = new Set(existingCards.map(c => c.vocabId));

      for (const vp of studiedVocab) {
        if (!existingVocabIds.has(vp.vocabId) && vp.vocab) {
          await prisma.flashcard.create({
            data: {
              userId,
              cardType: 'vocabulary',
              vocabId: vp.vocabId,
              front: `${vp.vocab.word}\n${vp.vocab.reading}`,
              back: vp.vocab.meaning,
              nextReview: new Date()
            }
          });
          created++;
        }
      }
    } else if (type === 'kanji') {
      const studiedKanji = await prisma.kanjiProgress.findMany({
        where: { userId },
        include: { kanji: true }
      });

      const existingCards = await prisma.flashcard.findMany({
        where: { userId, cardType: 'kanji' },
        select: { kanjiId: true }
      });
      const existingKanjiIds = new Set(existingCards.map(c => c.kanjiId));

      for (const kp of studiedKanji) {
        if (!existingKanjiIds.has(kp.kanjiId) && kp.kanji) {
          await prisma.flashcard.create({
            data: {
              userId,
              cardType: 'kanji',
              kanjiId: kp.kanjiId,
              front: kp.kanji.character,
              back: `${kp.kanji.meaning}\nOn: ${kp.kanji.onyomi || '—'}\nKun: ${kp.kanji.kunyomi || '—'}`,
              nextReview: new Date()
            }
          });
          created++;
        }
      }
    }

    res.json({ message: `Generated ${created} new flashcards`, created });
  } catch (error) {
    res.status(500).json({ message: 'Error generating flashcards', error: error.message });
  }
};

// Delete a flashcard
const deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const card = await prisma.flashcard.findUnique({ where: { id } });
    if (!card || card.userId !== userId) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Delete reviews first
    await prisma.flashcardReview.deleteMany({ where: { flashcardId: id } });
    await prisma.flashcard.delete({ where: { id } });

    res.json({ message: 'Flashcard deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flashcard', error: error.message });
  }
};

// Get flashcard stats
const getFlashcardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    const [total, dueToday, mastered, totalReviews] = await Promise.all([
      prisma.flashcard.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId, nextReview: { lte: now } } }),
      prisma.flashcard.count({ where: { userId, interval: { gte: 21 } } }),
      prisma.flashcardReview.count({
        where: { flashcard: { userId } }
      })
    ]);

    res.json({ total, dueToday, mastered, totalReviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcard stats', error: error.message });
  }
};

module.exports = {
  getReviewQueue, reviewFlashcard, createFlashcard,
  autoGenerateFlashcards, deleteFlashcard, getFlashcardStats
};
