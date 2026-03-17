const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const check = (sm) => {
    const list = json.filter(l => l.subModule === sm);
    const count = list.length;
    const all10 = list.every(l => {
      let q = 0;
      if (l.phases) {
        if (l.phases.practice) q += l.phases.practice.length;
        if (l.phases.play) q += l.phases.play.length;
      }
      return q === 10;
    });
    return { count, all10 };
  };

  console.log('--- FINAL AUDIT ---');
  ['word-building', 'grammar-basics', 'sentence-formation'].forEach(sm => {
    const res = check(sm);
    console.log(`${sm}: ${res.count} lessons, All 10q: ${res.all10}`);
  });

} catch (err) {
  console.error(err);
}
