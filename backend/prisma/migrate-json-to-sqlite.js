const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function migrate() {
  console.log('Starting migration from JSON files to SQLite...');

  // 1. Migrate Users
  const usersPath = path.join(__dirname, '../data/users.json');
  if (fs.existsSync(usersPath)) {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    console.log(`Found ${users.length} users in JSON.`);
    for (const user of users) {
      const dbUser = {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        xp: user.xp || 0,
        streak: user.streak || 0,
        hearts: user.hearts !== undefined ? user.hearts : 5,
        level: user.level || 1,
        lastActive: user.lastActive ? new Date(user.lastActive) : new Date(),
        lastHeartRefillTime: user.lastHeartRefillTime ? new Date(user.lastHeartRefillTime) : null,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
      };
      
      await prisma.user.upsert({
        where: { id: user.id },
        update: dbUser,
        create: dbUser
      });
    }
    console.log('Users migrated successfully.');
  }

  // 2. Migrate Lessons
  const lessonsPath = path.join(__dirname, '../data/lessons.json');
  if (fs.existsSync(lessonsPath)) {
    const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'));
    console.log(`Found ${lessons.length} lessons in JSON.`);
    for (const lesson of lessons) {
      const dbLesson = {
        id: lesson.id,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty || 1,
        xpReward: lesson.xpReward || 10,
        order: lesson.order || 0,
        content: lesson.content ? (typeof lesson.content === 'string' ? lesson.content : JSON.stringify(lesson.content)) : null,
        phases: lesson.phases ? (typeof lesson.phases === 'string' ? lesson.phases : JSON.stringify(lesson.phases)) : null,
        subModule: lesson.subModule || null,
        createdAt: lesson.createdAt ? new Date(lesson.createdAt) : new Date(),
      };

      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: dbLesson,
        create: dbLesson
      });
    }
    console.log('Lessons migrated successfully.');
  }

  // 3. Migrate User Progress
  const progressPath = path.join(__dirname, '../data/progress.json');
  if (fs.existsSync(progressPath)) {
    const progresses = JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    console.log(`Found ${progresses.length} progress entries in JSON.`);
    for (const prog of progresses) {
      // First make sure the lesson exists in SQLite (safety check)
      const lessonExists = await prisma.lesson.findUnique({ where: { id: prog.lessonId } });
      const userExists = await prisma.user.findUnique({ where: { id: prog.userId } });

      if (!lessonExists || !userExists) {
        console.warn(`Skipping progress for user ${prog.userId} / lesson ${prog.lessonId} (record not found in DB).`);
        continue;
      }

      const dbProgress = {
        id: prog.id,
        userId: prog.userId,
        lessonId: prog.lessonId,
        completed: prog.completed || false,
        score: prog.score || 0,
        correctCount: prog.correctCount || 0,
        totalCount: prog.totalCount || 0,
        stars: prog.stars || 0,
        createdAt: prog.createdAt ? new Date(prog.createdAt) : new Date(),
        updatedAt: prog.updatedAt ? new Date(prog.updatedAt) : new Date(),
      };

      await prisma.userProgress.upsert({
        where: { id: prog.id },
        update: dbProgress,
        create: dbProgress
      });
    }
    console.log('User progress migrated successfully.');
  }

  // 4. Migrate Achievements
  const achievementsPath = path.join(__dirname, '../data/achievements.json');
  if (fs.existsSync(achievementsPath)) {
    const achievements = JSON.parse(fs.readFileSync(achievementsPath, 'utf-8'));
    console.log(`Found ${achievements.length} achievements in JSON.`);
    for (const ach of achievements) {
      const userExists = await prisma.user.findUnique({ where: { id: ach.userId } });
      if (!userExists) continue;

      const dbAchievement = {
        id: ach.id,
        userId: ach.userId,
        type: ach.type,
        unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : new Date(),
      };

      await prisma.achievement.upsert({
        where: { id: ach.id },
        update: dbAchievement,
        create: dbAchievement
      });
    }
    console.log('Achievements migrated successfully.');
  }

  console.log('Migration completed successfully!');
}

migrate()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
