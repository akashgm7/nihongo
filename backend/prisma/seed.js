const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  const seedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf-8')
  );

  console.log('Seeding lessons...');
  for (const lesson of seedData) {
    await prisma.lesson.create({
      data: {
        ...lesson,
        content: JSON.stringify(lesson.content)
      },
    });
  }
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
