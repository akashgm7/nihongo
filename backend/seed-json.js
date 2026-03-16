const db = require('./src/lib/jsonDb');
const fs = require('fs');
const path = require('path');

const seedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'prisma/seed_data.json'), 'utf-8')
);

console.log('Seeding JSON lessons...');
const lessons = seedData.map((l, i) => ({
  ...l,
  id: `lesson-${i + 1}`,
  content: l.content // already objects from seed_data.json
}));

db.write('lessons', lessons);
console.log('JSON seeding completed!');
