const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedLessons() {
  console.log('📚 Seeding lessons...');
  const lessonsPath = path.join(__dirname, '../default_data/lessons.json');
  if (!fs.existsSync(lessonsPath)) {
    console.log('  ⚠ lessons.json not found, skipping');
    return 0;
  }
  
  const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'));
  let count = 0;
  
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
    count++;
  }
  
  console.log(`  ✅ ${count} lessons seeded`);
  return count;
}

async function seedVocabulary() {
  console.log('📖 Seeding vocabulary...');
  let totalCount = 0;
  
  const files = [
    { path: '../default_data/vocabulary_n5.json', level: 'N5' },
    { path: '../default_data/vocabulary_n4.json', level: 'N4' }
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ ${file.path} not found, skipping`);
      continue;
    }
    
    const vocabulary = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    for (const vocab of vocabulary) {
      // Check if vocab with same word+reading already exists
      const existing = await prisma.vocabulary.findFirst({
        where: { word: vocab.word, reading: vocab.reading }
      });
      
      if (existing) {
        await prisma.vocabulary.update({
          where: { id: existing.id },
          data: {
            meaning: vocab.meaning,
            partOfSpeech: vocab.partOfSpeech || null,
            exampleSentence: vocab.exampleSentence || null,
            exampleMeaning: vocab.exampleMeaning || null,
            lessonNum: vocab.lessonNum || null,
            jlptLevel: vocab.jlptLevel || file.level,
            category: vocab.category || null,
            order: vocab.order || 0
          }
        });
      } else {
        await prisma.vocabulary.create({
          data: {
            word: vocab.word,
            reading: vocab.reading,
            meaning: vocab.meaning,
            partOfSpeech: vocab.partOfSpeech || null,
            exampleSentence: vocab.exampleSentence || null,
            exampleMeaning: vocab.exampleMeaning || null,
            lessonNum: vocab.lessonNum || null,
            jlptLevel: vocab.jlptLevel || file.level,
            category: vocab.category || null,
            order: vocab.order || 0
          }
        });
      }
      totalCount++;
    }
    
    console.log(`  ✅ ${vocabulary.length} ${file.level} vocabulary seeded`);
  }
  
  return totalCount;
}

async function seedKanji() {
  console.log('🈳 Seeding kanji...');
  let totalCount = 0;
  
  const files = [
    { path: '../default_data/kanji_n5.json', level: 'N5' },
    { path: '../default_data/kanji_n4.json', level: 'N4' }
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ ${file.path} not found, skipping`);
      continue;
    }
    
    const kanjiList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    for (const kanji of kanjiList) {
      const data = {
        meaning: kanji.meaning,
        onyomi: kanji.onyomi || null,
        kunyomi: kanji.kunyomi || null,
        strokeCount: kanji.strokeCount || 0,
        strokeOrderUrl: kanji.strokeOrderUrl || null,
        jlptLevel: kanji.jlptLevel || file.level,
        grade: kanji.grade || null,
        lessonNum: kanji.lessonNum || null,
        exampleWords: kanji.exampleWords || null,
        exampleSentences: kanji.exampleSentences || null,
        radicals: kanji.radicals || null,
        order: kanji.order || 0
      };
      
      await prisma.kanji.upsert({
        where: { character: kanji.character },
        update: data,
        create: { character: kanji.character, ...data }
      });
      totalCount++;
    }
    
    console.log(`  ✅ ${kanjiList.length} ${file.level} kanji seeded`);
  }
  
  return totalCount;
}

async function seedGrammar() {
  console.log('📝 Seeding grammar points...');
  let totalCount = 0;
  
  const files = [
    { path: '../default_data/grammar_n5.json', level: 'N5' },
    { path: '../default_data/grammar_n4.json', level: 'N4' }
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ ${file.path} not found, skipping`);
      continue;
    }
    
    const grammarPoints = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    for (const gp of grammarPoints) {
      // Check if grammar with same title exists
      const existing = await prisma.grammarPoint.findFirst({
        where: { title: gp.title }
      });
      
      const data = {
        title: gp.title,
        explanation: gp.explanation,
        structure: gp.structure || null,
        examples: gp.examples || null,
        lessonNum: gp.lessonNum || null,
        jlptLevel: gp.jlptLevel || file.level,
        category: gp.category || null,
        order: gp.order || 0,
        exercises: gp.exercises || null
      };
      
      if (existing) {
        await prisma.grammarPoint.update({
          where: { id: existing.id },
          data
        });
      } else {
        await prisma.grammarPoint.create({ data });
      }
      totalCount++;
    }
    
    console.log(`  ✅ ${grammarPoints.length} ${file.level} grammar points seeded`);
  }
  
  return totalCount;
}

async function main() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    const lessons = await seedLessons();
    const vocab = await seedVocabulary();
    const kanji = await seedKanji();
    const grammar = await seedGrammar();
    
    console.log('\n🎉 Seed complete!');
    console.log(`   Lessons: ${lessons}`);
    console.log(`   Vocabulary: ${vocab}`);
    console.log(`   Kanji: ${kanji}`);
    console.log(`   Grammar: ${grammar}`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
