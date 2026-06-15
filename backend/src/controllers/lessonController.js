const prisma = require('../lib/db');

const parseLesson = (lesson) => {
  if (!lesson) return null;
  const parsed = { ...lesson };
  if (parsed.phases && typeof parsed.phases === 'string') {
    try {
      parsed.phases = JSON.parse(parsed.phases);
    } catch (e) {
      console.error('Failed to parse lesson phases:', e);
    }
  }
  if (parsed.content && typeof parsed.content === 'string') {
    try {
      parsed.content = JSON.parse(parsed.content);
    } catch (e) {
      console.error('Failed to parse lesson content:', e);
    }
  }
  return parsed;
};

const getLessons = async (req, res) => {
  const userId = req.userId;
  try {
    const dbLessons = await prisma.lesson.findMany();
    const progress = await prisma.userProgress.findMany({ where: { userId } });
    
    const lessons = dbLessons.map(parseLesson);

    // Join lessons with progress
    const lessonsWithProgress = lessons.map(lesson => {
      const userProgress = progress.find(p => p.lessonId === lesson.id);
      return {
        ...lesson,
        completed: userProgress ? userProgress.completed : false,
        score: userProgress ? userProgress.score : null,
        correctCount: userProgress ? userProgress.correctCount : null,
        totalCount: userProgress ? userProgress.totalCount : null,
        stars: userProgress ? (userProgress.stars || 0) : 0
      };
    });

    res.json(lessonsWithProgress.sort((a, b) => a.order - b.order));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
};

const getLessonById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const dbLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!dbLesson) return res.status(404).json({ message: 'Lesson not found' });
    
    const lesson = parseLesson(dbLesson);
    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: id }
      }
    });
    
    res.json({
      ...lesson,
      completed: userProgress ? userProgress.completed : false,
      score: userProgress ? userProgress.score : null,
      correctCount: userProgress ? userProgress.correctCount : null,
      totalCount: userProgress ? userProgress.totalCount : null,
      stars: userProgress ? (userProgress.stars || 0) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lesson', error: error.message });
  }
};

const completeLesson = async (req, res) => {
  const { id } = req.params; // Lesson ID
  const userId = req.userId;
  const { score, correctCount, totalCount } = req.body;

  try {
    const dbLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!dbLesson) return res.status(404).json({ message: 'Lesson not found' });
    const lesson = parseLesson(dbLesson);

    console.log(`--- LESSON COMPLETION REQUEST ---`);
    console.log(`Lesson ID: ${id}`);
    console.log(`User ID: ${userId}`);
    console.log(`Body:`, JSON.stringify(req.body));

    // Calculate stars (0-5) based on score percentage
    let stars = 0;
    if (score === 100) stars = 5;
    else if (score >= 80) stars = 4;
    else if (score >= 60) stars = 3;
    else if (score >= 40) stars = 2;
    else if (score >= 20) stars = 1;

    console.log(`Calculated Stars: ${stars}`);

    // Find existing progress to compare
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: id }
      }
    });
    const previousBestCorrect = (existingProgress && existingProgress.correctCount) || 0;
    const previousBestScore = (existingProgress && existingProgress.score) || 0;
    const previousWasCompleted = (existingProgress && existingProgress.completed) || false;

    // Calculate XP: Award XP only for 'play' mode or 'boss' lessons
    const mode = req.body.mode;
    
    // Check if the lesson has a play phase
    const hasPlayPhase = lesson.phases && Array.isArray(lesson.phases.play) && lesson.phases.play.length > 0;
    const isBoss = lesson.isBoss === true || lesson.id.startsWith('boss');
    
    // Completion and rewards are tied to the 'final phase' of a lesson
    const isFinalPhase = mode === 'play' || isBoss || !hasPlayPhase;
    const awardXPMode = isFinalPhase;
    
    // XP is awarded only for NEW correct answers (improvement in best score)
    let xpEarned = 0;
    if (awardXPMode) {
      if (correctCount > previousBestCorrect) {
        xpEarned = correctCount - previousBestCorrect;
      }
    }

    // Update progress only if it's better or wasn't completed before
    const isCompleted = previousWasCompleted || (isFinalPhase && (score >= 100 || (isBoss && score >= 80)));
    
    // Only save stars if it's the final phase
    const finalStars = isFinalPhase ? stars : (existingProgress?.stars || 0);

    const shouldUpdateProgress = !existingProgress || score > previousBestScore || (score === previousBestScore && correctCount > previousBestCorrect) || (isCompleted && !previousWasCompleted);

    let updatedProgress;
    if (shouldUpdateProgress) {
      const data = {
        completed: isCompleted,
        score: score || 0,
        correctCount: correctCount || 0,
        totalCount: totalCount || 0,
        stars: finalStars
      };

      updatedProgress = await prisma.userProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId: id }
        },
        update: data,
        create: {
          userId,
          lessonId: id,
          ...data
        }
      });
      console.log(`Improved progress for lesson ${id} saved:`, updatedProgress);
    } else {
      updatedProgress = existingProgress;
      console.log(`Performance not better than previous best for lesson ${id}. No progress update.`);
    }

    const { updateUserStreak } = require('./userController');
    const user = await updateUserStreak(userId);
    
    let newXp = (user.xp || 0) + xpEarned;
    let newLevel = user.level || 1;

    // Level-up logic: 100 XP per level
    while (newXp >= newLevel * 100) {
      newLevel++;
    }
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          xp: newXp,
          level: newLevel
        }
      });
    }

    res.json({ 
      message: awardXPMode 
        ? (xpEarned > 0 ? `Improvement! Earned ${xpEarned} XP.` : 'No new XP earned (best score not exceeded).') 
        : 'Practice completed! (No XP earned in this mode)', 
      stars,
      xpEarned,
      progress: updatedProgress,
      user: {
        id: user.id,
        xp: newXp,
        hearts: user.hearts,
        streak: user.streak,
        level: newLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] Request for lesson ID: ${id}`);
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      console.log(`[DELETE] Lesson not found: ${id}`);
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    console.log(`[DELETE] Found lesson: ${lesson.title}, Category: ${lesson.category}`);
    
    // Only allow deleting AI Generated lessons to prevent breaking regular flow
    if (lesson.category !== 'AI Generated') {
      console.log(`[DELETE] Forbidden: Not an AI lesson`);
      return res.status(403).json({ message: 'Only AI generated lessons can be deleted' });
    }

    await prisma.lesson.delete({ where: { id } });
    // Also remove associated progress
    await prisma.userProgress.deleteMany({ where: { lessonId: id } });

    console.log(`[DELETE] Success: ${id} deleted`);
    res.json({ message: 'AI Lesson deleted successfully' });
  } catch (error) {
    console.error(`[DELETE] Error:`, error);
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};

module.exports = { getLessons, getLessonById, completeLesson, deleteLesson };
