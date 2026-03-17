const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'lessons.json');
const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const m6Lessons = [
  {
    "id": "m6-lesson-1",
    "subModule": "sentence-formation",
    "title": "Introduction to Verbs",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 30,
    "order": 1,
    "phases": {
      "learn": [
        { "type": "intro", "character": "たべます", "romaji": "eat" },
        { "type": "intro", "character": "のみます", "romaji": "drink" },
        { "type": "intro", "character": "みます", "romaji": "see/watch" },
        { "type": "intro", "character": "いきます", "romaji": "go" },
        { "type": "intro", "character": "きます", "romaji": "come" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does たべます mean?", "options": ["eat", "drink", "see", "go"], "answer": "eat" },
        { "type": "quiz", "question": "Translate: みず を のみます", "options": ["drink water", "eat water", "see water", "go to water"], "answer": "drink water" },
        { "type": "quiz", "question": "Which word is the verb in 'わたし は パン を たべます'?", "options": ["たべます", "わたし", "パン", "を"], "answer": "たべます" },
        { "type": "quiz", "question": "Fill the blank: みず を ______", "options": ["のみます", "たべます", "みます", "いきます"], "answer": "のみます" },
        { "type": "quiz", "question": "Translate: テレビ を みます", "options": ["watch TV", "eat TV", "drink TV", "go to TV"], "answer": "watch TV" }
      ],
      "play": [
        { "type": "typing", "question": "Arrange: パン / を / たべます", "character": "パン を たべます", "answer": "パンをたべます" },
        { "type": "quiz", "question": "Which verb means go?", "options": ["いきます", "きます", "たべます", "みます"], "answer": "いきます" },
        { "type": "quiz", "question": "Which verb means come?", "options": ["きます", "いきます", "のみます", "たべます"], "answer": "きます" },
        { "type": "typing", "question": "Translate: さかな を たべます", "character": "さかな を たべます", "answer": "さかなをたべます" },
        { "type": "quiz", "question": "Identify verb in 'えいが を みます'", "options": ["みます", "えいが", "を", "わたし"], "answer": "みます" }
      ]
    }
  },
  {
    "id": "m6-lesson-2",
    "subModule": "sentence-formation",
    "title": "Subject + Verb Sentences",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 30,
    "order": 2,
    "phases": {
      "learn": [
        { "type": "intro", "character": "わたし は いきます", "romaji": "I go.", "hint": "Subject + は + Verb" }
      ],
      "practice": [
        { "type": "quiz", "question": "Translate: わたし は いきます", "options": ["I go.", "I come.", "I eat.", "I drink."], "answer": "I go." },
        { "type": "quiz", "question": "Fill blank: わたし ___ たべます", "options": ["は", "を", "が", "に"], "answer": "は" },
        { "type": "quiz", "question": "Arrange: わたし / は / のみます", "options": ["わたし は のみます", "のみます わたし は", "は わたし のみます"], "answer": "わたし は のみます" },
        { "type": "quiz", "question": "Identify subject: わたし は みます", "options": ["わたし", "は", "みます"], "answer": "わたし" },
        { "type": "quiz", "question": "Translate: ねこ は たべます", "options": ["The cat eats.", "The dog eats.", "I eat.", "The cat drinks."], "answer": "The cat eats." }
      ],
      "play": [
        { "type": "quiz", "question": "Choose correct sentence", "options": ["わたし は のみます", "のみます わたし は", "は わたし のみます"], "answer": "わたし は のみます" },
        { "type": "quiz", "question": "Fill blank: ねこ ___ います", "options": ["は", "を", "に", "が"], "answer": "は" },
        { "type": "typing", "question": "Translate: わたし は きます", "character": "わたし は きます", "answer": "わたしはきます" },
        { "type": "quiz", "question": "Which word is the subject? わたし は のみます", "options": ["わたし", "は", "のみます"], "answer": "わたし" },
        { "type": "typing", "question": "Build sentence: I eat.", "character": "わたし は たべます", "answer": "わたしはたべます" }
      ]
    }
  },
  {
    "id": "m6-lesson-3",
    "subModule": "sentence-formation",
    "title": "Subject + Object + Verb",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 35,
    "order": 3,
    "phases": {
      "learn": [
        { "type": "intro", "character": "わたし は パン を たべます", "romaji": "I eat bread.", "hint": "Subject + は + Object + を + Verb" }
      ],
      "practice": [
        { "type": "quiz", "question": "Identify object: わたし は パン を たべます", "options": ["パン", "わたし", "は", "たべます"], "answer": "パン" },
        { "type": "quiz", "question": "Translate: みず を のみます", "options": ["drink water", "eat water", "see water", "go water"], "answer": "drink water" },
        { "type": "quiz", "question": "Fill blank: パン ___ たべます", "options": ["を", "は", "が", "に"], "answer": "を" },
        { "type": "typing", "question": "Arrange: わたし / は / みず / を / のみます", "character": "わたし は みず を のみます", "answer": "わたしはみずをのみます" },
        { "type": "quiz", "question": "What does this mean? ねこ は さかな を たべます", "options": ["The cat eats fish.", "The dog eats fish.", "I eat fish.", "The cat drinks water."], "answer": "The cat eats fish." }
      ],
      "play": [
        { "type": "quiz", "question": "Identify verb: えいが を みます", "options": ["みます", "えいが", "を"], "answer": "みます" },
        { "type": "typing", "question": "Translate: パン を たべます", "character": "パン を たべます", "answer": "パンをたべます" },
        { "type": "quiz", "question": "Fill blank: えいが ___ みます", "options": ["を", "は", "に", "が"], "answer": "を" },
        { "type": "typing", "question": "Build sentence: I watch a movie.", "character": "えいが を みます", "answer": "えいがをみます" },
        { "type": "quiz", "question": "Which particle marks the object?", "options": ["を", "は", "が", "に"], "answer": "を" }
      ]
    }
  },
  {
    "id": "m6-lesson-4",
    "subModule": "sentence-formation",
    "title": "Location Sentences",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 35,
    "order": 4,
    "phases": {
      "learn": [
        { "type": "intro", "character": "がっこう に いきます", "romaji": "go to school.", "hint": "Location + に + Verb" }
      ],
      "practice": [
        { "type": "quiz", "question": "Fill blank: がっこう ___ いきます", "options": ["に", "を", "は", "が"], "answer": "に" },
        { "type": "quiz", "question": "Translate: にほん に いきます", "options": ["go to Japan", "come from Japan", "eat in Japan", "live in Japan"], "answer": "go to Japan" },
        { "type": "typing", "question": "Arrange: わたし / は / がっこう / に / いきます", "character": "わたし は がっこう に いきます", "answer": "わたしはがっこうにいきます" },
        { "type": "quiz", "question": "What particle indicates destination?", "options": ["に", "を", "は", "が"], "answer": "に" },
        { "type": "quiz", "question": "Translate: えき に いきます", "options": ["go to the station", "go to school", "go to the park", "go to the store"], "answer": "go to the station" }
      ],
      "play": [
        { "type": "quiz", "question": "Fill blank: レストラン ___ いきます", "options": ["に", "を", "は", "の"], "answer": "に" },
        { "type": "quiz", "question": "Identify location: がっこう に いきます", "options": ["がっこう", "に", "いき", "ます"], "answer": "がっこう" },
        { "type": "typing", "question": "Translate: ともだち の いえ に いきます", "character": "ともだち の いえ に いきます", "answer": "ともだちのいえにいきます" },
        { "type": "typing", "question": "Arrange: に / いきます / がっこう", "character": "がっこう に いきます", "answer": "がっこうにいきます" },
        { "type": "quiz", "question": "Which particle means to?", "options": ["に", "を", "は", "で"], "answer": "に" }
      ]
    }
  },
  {
    "id": "m6-lesson-5",
    "subModule": "sentence-formation",
    "title": "Talking About Likes",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 35,
    "order": 5,
    "phases": {
      "learn": [
        { "type": "intro", "character": "ねこ が すき です", "romaji": "I like cats.", "hint": "Object + が + すき です" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does すき mean?", "options": ["like", "dislike", "love", "want"], "answer": "like" },
        { "type": "quiz", "question": "Translate: ねこ が すき です", "options": ["I like cats.", "I like dogs.", "I have cats.", "Cats like me."], "answer": "I like cats." },
        { "type": "quiz", "question": "Fill blank: いぬ ___ すき です", "options": ["が", "を", "に", "は"], "answer": "が" },
        { "type": "quiz", "question": "Translate: すし が すき です", "options": ["I like sushi.", "I eat sushi.", "I have sushi.", "Sushi is good."], "answer": "I like sushi." },
        { "type": "typing", "question": "Arrange: わたし / は / すし / が / すき / です", "character": "わたし は すし が すき です", "answer": "わたしはすしがすきです" }
      ],
      "play": [
        { "type": "quiz", "question": "What particle marks what you like?", "options": ["が", "を", "に", "は"], "answer": "が" },
        { "type": "typing", "question": "Translate: えいが が すき です", "character": "えいが が すき です", "answer": "えいががすきです" },
        { "type": "quiz", "question": "Fill blank: パン ___ すき です", "options": ["が", "を", "に", "は"], "answer": "が" },
        { "type": "typing", "question": "Build sentence: I like sushi.", "character": "すし が すき です", "answer": "すしがすきです" },
        { "type": "quiz", "question": "What does 'いぬ が すき です' mean?", "options": ["I like dogs.", "I like cats.", "I have a dog.", "The dog likes me."], "answer": "I like dogs." }
      ]
    }
  },
  {
    "id": "m6-lesson-6",
    "subModule": "sentence-formation",
    "title": "Simple Conversations",
    "category": "Conversation",
    "difficulty": 3,
    "xpReward": 40,
    "order": 6,
    "phases": {
      "learn": [
        { "type": "intro", "character": "あなた は がくせい です か\nはい、がくせい です", "romaji": "Are you a student?\nYes, I am a student." }
      ],
      "practice": [
        { "type": "quiz", "question": "Translate: あなた は がくせい です か", "options": ["Are you a student?", "Is he a student?", "Am I a student?", "Are you a teacher?"], "answer": "Are you a student?" },
        { "type": "quiz", "question": "Answer 'yes, I am a student':", "options": ["はい、がくせい です", "いいえ、がくせい です", "はい、せんせい です", "いいえ、せんせい です"], "answer": "はい、がくせい です" },
        { "type": "quiz", "question": "Fill blank: あなた ___ がくせい です か", "options": ["は", "を", "が", "に"], "answer": "は" },
        { "type": "quiz", "question": "Which word means 'you'?", "options": ["あなた", "わたし", "かれ", "かのじょ"], "answer": "あなた" },
        { "type": "quiz", "question": "Translate: いいえ、がくせい では ありません", "options": ["No, I am not a student.", "Yes, I am a student.", "No, I am not a teacher.", "Yes, I am a teacher."], "answer": "No, I am not a student." }
      ],
      "play": [
        { "type": "quiz", "question": "What does はい mean?", "options": ["yes", "no", "maybe", "thanks"], "answer": "yes" },
        { "type": "quiz", "question": "What does いいえ mean?", "options": ["no", "yes", "thanks", "sorry"], "answer": "no" },
        { "type": "typing", "question": "Arrange: がくせい / です / はい", "character": "はい、がくせい です", "answer": "はい、がくせいですか" },
        { "type": "typing", "question": "Translate: あなた は せんせい です か", "character": "あなた は せんせい です か", "answer": "あなたはせんせいですか" },
        { "type": "quiz", "question": "Fill blank: ___ がくせい です (Answer: Yes)", "options": ["はい", "いいえ", "あなた", "わたし"], "answer": "はい" }
      ]
    }
  },
  {
    "id": "m6-lesson-7",
    "subModule": "sentence-formation",
    "title": "Sentence Mixing",
    "category": "Practice",
    "difficulty": 3,
    "xpReward": 40,
    "order": 7,
    "phases": {
      "learn": [
        { "type": "intro", "character": "わたし は みず を のみます", "romaji": "I drink water." }
      ],
      "practice": [
        { "type": "typing", "question": "Arrange: わたし / は / パン / を / たべます", "character": "わたし は パン を たべます", "answer": "わたしはパンをたべます" },
        { "type": "quiz", "question": "Translate: ねこ は さかな を たべます", "options": ["The cat eats fish.", "The cat drinks milk.", "I eat fish.", "The dog eats fish."], "answer": "The cat eats fish." },
        { "type": "quiz", "question": "Fill blank: みず ___ のみます", "options": ["を", "は", "が", "に"], "answer": "を" },
        { "type": "typing", "question": "Build: I watch TV", "character": "テレビ を みます", "answer": "テレビをみます" },
        { "type": "quiz", "question": "Translate: がっこう に いきます", "options": ["go to school", "come from school", "stay at school", "look at school"], "answer": "go to school" }
      ],
      "play": [
        { "type": "typing", "question": "Arrange: わたし / は / えいが / を / みます", "character": "わたし は えいが を みます", "answer": "わたしはえいがをみます" },
        { "type": "quiz", "question": "Identify object: さかな を たべます", "options": ["さかな", "を", "たべます"], "answer": "さかな" },
        { "type": "typing", "question": "Translate: わたし は すし が すき です", "character": "わたし は すし が すき です", "answer": "わたしはすしがすきです" },
        { "type": "quiz", "question": "Fill blank: えいが ___ みます", "options": ["を", "は", "に", "が"], "answer": "を" },
        { "type": "typing", "question": "Build: I drink water", "character": "みず を のみます", "answer": "みずをのみます" }
      ]
    }
  },
  {
    "id": "boss-m6",
    "subModule": "sentence-formation",
    "title": "Sentence Boss Challenge",
    "category": "Boss",
    "difficulty": 4,
    "xpReward": 100,
    "order": 8,
    "isBoss": true,
    "timer": 60,
    "phases": {
      "play": [
        { "type": "typing", "question": "Build sentence: I eat sushi", "character": "すし を たべます", "answer": "すしをたべます" },
        { "type": "quiz", "question": "Fill blank: わたし ___ みず を のみます", "options": ["は", "を", "が", "に"], "answer": "は" },
        { "type": "quiz", "question": "Translate: ねこ が すき です", "options": ["I like cats.", "I like dogs.", "Cats like fish.", "I have a cat."], "answer": "I like cats." },
        { "type": "typing", "question": "Arrange: えいが / を / みます", "character": "えいが を みます", "answer": "えいがをみます" },
        { "type": "quiz", "question": "Translate: がっこう に いきます", "options": ["go to school", "come from school", "go to work", "go to home"], "answer": "go to school" },
        { "type": "quiz", "question": "Fill blank: さかな ___ たべます", "options": ["を", "は", "に", "が"], "answer": "を" },
        { "type": "quiz", "question": "Identify verb: パン を たべます", "options": ["たべます", "パン", "を"], "answer": "たべます" },
        { "type": "quiz", "question": "Translate: みず を のみます", "options": ["drink water", "eat water", "see water", "buy water"], "answer": "drink water" },
        { "type": "typing", "question": "Build: I watch TV", "character": "テレビ を みます", "answer": "テレビをみます" },
        { "type": "typing", "question": "Translate: わたし は すし が すき です", "character": "わたし は すし が すき です", "answer": "わたしはすしがすきです" }
      ]
    }
  }
];

// Append new lessons to the filtered list (preventing duplicates)
const filteredLessons = lessons.filter(l => l.subModule !== 'sentence-formation');
const newLessons = [...filteredLessons, ...m6Lessons];

fs.writeFileSync(filePath, JSON.stringify(newLessons, null, 2));
console.log('Successfully added Module 6 lessons to lessons.json');
