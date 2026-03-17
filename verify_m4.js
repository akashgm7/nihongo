const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lessons = JSON.parse(content);
  const m4Lessons = lessons.filter(l => l.subModule === 'word-building');
  
  m4Lessons.forEach(l => {
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
