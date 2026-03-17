const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'lessons.json');
const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const m5Intros = {
  "m5-lesson-1": [
    { "type": "intro", "character": "わたし は がくせい です", "romaji": "I am a student.", "hint": "Japanese sentence structure is Subject-Object-Verb (SOV)." }
  ],
  "m5-lesson-2": [
    { "type": "intro", "character": "は", "romaji": "(Topic Particle)", "hint": "The particle は marks the topic of the sentence." }
  ],
  "m5-lesson-3": [
    { "type": "intro", "character": "の", "romaji": "(Possessive Particle)", "hint": "The particle の indicates possession or relationship (like 's)." }
  ],
  "m5-lesson-4": [
    { "type": "intro", "character": "を", "romaji": "(Object Particle)", "hint": "The particle を marks the object that receives the action." }
  ],
  "m5-lesson-5": [
    { "type": "intro", "character": "が", "romaji": "(Subject Particle)", "hint": "The particle が marks the specific subject or what you like (すき)." }
  ],
  "m5-lesson-6": [
    { "type": "intro", "character": "に", "romaji": "(Destination Particle)", "hint": "The particle に indicates the destination (to somewhere)." }
  ],
  "m5-lesson-7": [
    { "type": "intro", "character": "で", "romaji": "(Location Particle)", "hint": "The particle で marks where an action takes place (at somewhere)." }
  ],
  "m5-lesson-8": [
    { "type": "intro", "character": "か", "romaji": "(Question Particle)", "hint": "The particle か at the end of a sentence turns it into a question." }
  ],
  "m5-lesson-9": [
    { "type": "intro", "character": "も", "romaji": "(Inclusive Particle)", "hint": "The particle も means 'also' or 'too'." }
  ],
  "m5-lesson-10": [
    { "type": "intro", "character": "わたし も がくせい です", "romaji": "I am also a student.", "hint": "Mixed practice with topic particles." }
  ],
  "m5-lesson-11": [
    { "type": "intro", "character": "わたし は たなか です", "romaji": "I am Tanaka.", "hint": "Practice building basic sentences." }
  ],
  "m5-lesson-12": [
    { "type": "intro", "character": "は / の / を", "romaji": "Particles review", "hint": "Review of the common particles encountered so far." }
  ],
  "m5-lesson-13": [
    { "type": "intro", "character": "あなた は せんせい です か", "romaji": "Are you a teacher?", "hint": "Building basic conversation blocks." }
  ],
  "m5-lesson-14": [
    { "type": "intro", "character": "Grammar Boss", "romaji": "Module 5 Boss Challenge", "hint": "Mixed grammar questions in a speed run!" }
  ]
};

const processed = lessons.map(l => {
  if (l.subModule === 'grammar-basics' && l.content) {
    const questions = l.content;
    const practice = questions.slice(0, 5);
    const play = questions.slice(5, 10);
    
    delete l.content;
    l.phases = {
      learn: m5Intros[l.id] || [{ "type": "intro", "character": "Grammar basics", "romaji": "Learning particles and structure", "hint": "Module 5" }],
      practice: practice.map(q => { delete q.id; return q; }),
      play: play.map(q => { delete q.id; return q; })
    };
  }
  return l;
});

fs.writeFileSync(filePath, JSON.stringify(processed, null, 2));
console.log('Successfully updated Module 5 lessons to phases structure.');
