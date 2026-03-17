const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('File length:', content.length);
  const json = JSON.parse(content);
  console.log('Number of lessons:', json.length);
  
  const m4 = json.filter(l => l.subModule === 'word-building');
  const m5 = json.filter(l => l.subModule === 'grammar-basics');
  const m6 = json.filter(l => l.subModule === 'sentence-formation');
  
  console.log('M4 lessons:', m4.length);
  console.log('M5 lessons:', m5.length);
  console.log('M6 lessons:', m6.length);

  const check10 = (lessons) => lessons.every(l => {
    let count = 0;
    if (l.phases) {
      if (l.phases.practice) count += l.phases.practice.length;
      if (l.phases.play) count += l.phases.play.length;
    }
    return count === 10;
  });

  console.log('M4 all 10q:', check10(m4));
  console.log('M5 all 10q:', check10(m5));
  console.log('M6 all 10q:', check10(m6));

} catch (err) {
  console.error('ERROR:', err);
}
