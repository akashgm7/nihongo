const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Get lessons.json from the specific commit
  const content = execSync('git show d39823cd75202e66528da:backend/data/lessons.json', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const lessons = JSON.parse(content);
  const m4Lessons = lessons.filter(l => l.subModule === 'word-building');
  
  m4Lessons.forEach(l => {
    let qCount = 0;
    if (l.phases) {
        if (l.phases.practice) qCount += l.phases.practice.length;
        if (l.phases.play) qCount += l.phases.play.length;
    }
    console.log(`${l.id}: ${qCount} questions`);
  });
} catch (error) {
  console.error('Error:', error);
}
