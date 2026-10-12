const prisma = require('../lib/db');

/**
 * Auto-generate daily study tasks based on user's progress and curriculum position
 */
const generateDailyTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if tasks already exist for today
    const existingTasks = await prisma.dailyTask.findMany({
      where: { userId, date: today }
    });

    if (existingTasks.length > 0) {
      return res.json(existingTasks);
    }

    // Gather user stats to determine what tasks to generate
    const [
      vocabProgress,
      kanjiProgress,
      dueFlashcards,
      completedLessons,
      totalLessons
    ] = await Promise.all([
      prisma.vocabProgress.count({ where: { userId } }),
      prisma.kanjiProgress.count({ where: { userId } }),
      prisma.flashcard.count({ where: { userId, nextReview: { lte: new Date() } } }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
      prisma.lesson.count()
    ]);

    const tasks = [];

    // Task 1: Learn new vocabulary (always)
    const unlearnedVocabCount = await prisma.vocabulary.count({
      where: {
        NOT: {
          progress: { some: { userId, mastery: { gte: 3 } } }
        }
      }
    });
    if (unlearnedVocabCount > 0) {
      tasks.push({
        userId, date: today,
        taskType: 'vocab',
        description: 'Learn new vocabulary words',
        target: Math.min(15, unlearnedVocabCount),
        completed: 0, isComplete: false
      });
    }

    // Task 2: Learn new kanji
    const unlearnedKanjiCount = await prisma.kanji.count({
      where: {
        NOT: {
          progress: { some: { userId, mastery: { gte: 3 } } }
        }
      }
    });
    if (unlearnedKanjiCount > 0) {
      tasks.push({
        userId, date: today,
        taskType: 'kanji',
        description: 'Learn new kanji characters',
        target: Math.min(3, unlearnedKanjiCount),
        completed: 0, isComplete: false
      });
    }

    // Task 3: Review flashcards (if any are due)
    if (dueFlashcards > 0) {
      tasks.push({
        userId, date: today,
        taskType: 'flashcard',
        description: 'Review due flashcards',
        target: Math.min(40, dueFlashcards),
        completed: 0, isComplete: false
      });
    }

    // Task 4: Complete a grammar lesson
    const uncompletedGrammar = await prisma.grammarPoint.count({
      where: {
        NOT: {
          progress: { some: { userId, completed: true } }
        }
      }
    });
    if (uncompletedGrammar > 0) {
      tasks.push({
        userId, date: today,
        taskType: 'grammar',
        description: 'Complete a grammar lesson',
        target: 1,
        completed: 0, isComplete: false
      });
    }

    // Task 5: Complete a lesson (if there are uncompleted ones)
    const uncompletedLessons = totalLessons - completedLessons;
    if (uncompletedLessons > 0) {
      tasks.push({
        userId, date: today,
        taskType: 'lesson',
        description: 'Complete a learning lesson',
        target: 1,
        completed: 0, isComplete: false
      });
    }

    // Create all tasks
    const createdTasks = [];
    for (const task of tasks) {
      try {
        const created = await prisma.dailyTask.create({ data: task });
        createdTasks.push(created);
      } catch (e) {
        // Ignore duplicate key errors (race condition)
        if (!e.message.includes('Unique constraint')) throw e;
      }
    }

    res.json(createdTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error generating daily tasks', error: error.message });
  }
};

// Get today's tasks
const getTodayTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let tasks = await prisma.dailyTask.findMany({
      where: { userId, date: today },
      orderBy: { createdAt: 'asc' }
    });

    // Auto-generate if none exist
    if (tasks.length === 0) {
      // Call generateDailyTasks logic inline
      req.res = res;
      return generateDailyTasks(req, res);
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily tasks', error: error.message });
  }
};

// Update a daily task's progress
const updateDailyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, isComplete } = req.body;
    const userId = req.userId;

    const task = await prisma.dailyTask.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const newCompleted = completed !== undefined ? completed : task.completed;
    const newIsComplete = isComplete !== undefined ? isComplete : (newCompleted >= task.target);

    const updated = await prisma.dailyTask.update({
      where: { id },
      data: { completed: newCompleted, isComplete: newIsComplete }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating daily task', error: error.message });
  }
};

// Increment a daily task's completed count
const incrementDailyTask = async (req, res) => {
  try {
    const { taskType } = req.body;
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const task = await prisma.dailyTask.findUnique({
      where: { userId_date_taskType: { userId, date: today, taskType } }
    });

    if (!task) {
      return res.status(404).json({ message: 'No task of this type found for today' });
    }

    const newCompleted = task.completed + 1;
    const updated = await prisma.dailyTask.update({
      where: { id: task.id },
      data: {
        completed: newCompleted,
        isComplete: newCompleted >= task.target
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing task', error: error.message });
  }
};

module.exports = {
  generateDailyTasks, getTodayTasks,
  updateDailyTask, incrementDailyTask
};
