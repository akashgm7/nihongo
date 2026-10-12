const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const vocabRoutes = require('./routes/vocabRoutes');
const kanjiRoutes = require('./routes/kanjiRoutes');
const grammarRoutes = require('./routes/grammarRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const dailyTaskRoutes = require('./routes/dailyTaskRoutes');
const studyRoutes = require('./routes/studyRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for Render external URL without /api

app.use('/api/lessons', lessonRoutes);
app.use('/lessons', lessonRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

app.use('/api/vocabulary', vocabRoutes);
app.use('/vocabulary', vocabRoutes);

app.use('/api/kanji', kanjiRoutes);
app.use('/kanji', kanjiRoutes);

app.use('/api/grammar', grammarRoutes);
app.use('/grammar', grammarRoutes);

app.use('/api/flashcards', flashcardRoutes);
app.use('/flashcards', flashcardRoutes);

app.use('/api/daily-tasks', dailyTaskRoutes);
app.use('/daily-tasks', dailyTaskRoutes);

app.use('/api/study', studyRoutes);
app.use('/study', studyRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Japanese Learning App API is running' });
});

app.get('/api/debug-db', async (req, res) => {
  const prisma = require('./lib/db');
  try {
    const usersCount = await prisma.user.count();
    const lessonsCount = await prisma.lesson.count();
    const progressCount = await prisma.userProgress.count();
    res.json({
      status: 'ok',
      usersCount,
      lessonsCount,
      progressCount
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/force-seed', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const prisma = require('./lib/db');
  
  let results = [];
  try {
    const defaultLessonsPath = path.join(__dirname, '../../default_data/lessons.json');
    if (fs.existsSync(defaultLessonsPath)) {
      const lessons = JSON.parse(fs.readFileSync(defaultLessonsPath, 'utf-8'));
      
      for (const lesson of lessons) {
        const dbLesson = {
          id: lesson.id,
          title: lesson.title,
          category: lesson.category,
          difficulty: lesson.difficulty || 1,
          xpReward: lesson.xpReward || 10,
          order: lesson.order || 0,
          content: lesson.content ? JSON.stringify(lesson.content) : null,
          phases: lesson.phases ? JSON.stringify(lesson.phases) : null,
          subModule: lesson.subModule || null
        };
        await prisma.lesson.upsert({
          where: { id: lesson.id },
          update: dbLesson,
          create: dbLesson
        });
      }
      results.push(`Upserted ${lessons.length} lessons`);
    }
    res.json({ message: 'Database force-seed successful', results });
  } catch (err) {
    res.status(500).json({ message: 'Force-seed failed', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };
