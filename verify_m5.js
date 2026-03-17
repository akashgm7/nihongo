const fs = require('fs');
const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lessons = JSON.parse(content);
  const m5Lessons = lessons.filter(l => l.subModule === 'grammar-basics');
  
  m5Lessons.forEach(l => {
    console.log(`${l.id}: ${l.content.length} questions`);
  });
} catch (error) {
  console.error('Error:', error);
}
