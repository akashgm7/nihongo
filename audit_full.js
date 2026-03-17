const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const targetSubModules = ['word-building', 'grammar-basics', 'sentence-formation'];
  
  const summary = {};
  const incomplete = [];

  lessons.forEach(l => {
    if (targetSubModules.includes(l.subModule)) {
      if (!summary[l.subModule]) summary[l.subModule] = { total: 0, 10q: 0 };
      summary[l.subModule].total++;
      
      let qCount = 0;
      if (l.phases) {
        if (l.phases.practice) qCount += l.phases.practice.length;
        if (l.phases.play) qCount += l.phases.play.length;
      }
      
      if (qCount === 10) {
        summary[l.subModule]['10q']++;
      } else {
        incomplete.push(`${l.id} (${l.subModule}): ${qCount} questions`);
      }
    }
  });

  console.log('--- AUDIT SUMMARY ---');
  Object.keys(summary).forEach(sm => {
    console.log(`${sm}: ${summary[sm]['10q']}/${summary[sm].total} lessons have 10 questions`);
  });
  
  if (incomplete.length > 0) {
    console.log('\n--- INCOMPLETE LESSONS ---');
    incomplete.forEach(item => console.log(item));
  } else {
    console.log('\nAll lessons have exactly 10 questions!');
  }

} catch (error) {
  console.error('Error:', error);
}
