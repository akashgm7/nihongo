const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lessons = JSON.parse(content);
  const m6Lessons = lessons.filter(l => l.subModule === 'sentence-formation');
  
  m6Lessons.forEach(l => {
    let count = 0;
    if (l.phases) {
      if (l.phases.practice) count += l.phases.practice.length;
      if (l.phases.play) count += l.phases.play.length;
    }
    console.log(`${l.id} (${l.title}): ${count} questions`);
  });
} catch (error) {
  console.error('Error:', error);
}
