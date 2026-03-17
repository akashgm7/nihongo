const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'data', 'lessons.json');
const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const m4Lessons = [
  {
    "id": "m4-lesson-1",
    "subModule": "word-building",
    "title": "Word Formation Basics",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 1,
    "phases": {
      "learn": [
        { "type": "intro", "character": "ね + こ", "romaji": "neko (cat)", "hint": "Build cat" },
        { "type": "intro", "character": "い + ぬ", "romaji": "inu (dog)", "hint": "Build dog" },
        { "type": "intro", "character": "や + ま", "romaji": "yama (mountain)", "hint": "Build mountain" },
        { "type": "intro", "character": "う + み", "romaji": "umi (sea)", "hint": "Build sea" },
        { "type": "intro", "character": "と + り", "romaji": "tori (bird)", "hint": "Build bird" }
      ],
      "practice": [
        { "type": "quiz", "question": "Build the word cat", "options": ["ねこ", "いぬ", "とり", "うま"], "answer": "ねこ" },
        { "type": "quiz", "question": "Build the word dog", "options": ["いぬ", "ねこ", "とり", "うま"], "answer": "いぬ" },
        { "type": "quiz", "question": "Which word means cat?", "options": ["ねこ", "いぬ", "やま", "うみ"], "answer": "ねこ" },
        { "type": "quiz", "question": "Build the word mountain", "options": ["やま", "うみ", "ねこ", "とり"], "answer": "やま" },
        { "type": "quiz", "question": "Which is the correct order for cat?", "options": ["ね + こ", "こ + ね", "い + ぬ", "ぬ + い"], "answer": "ね + こ" }
      ],
      "play": [
        { "type": "typing", "question": "Build the word sea", "character": "う + み", "answer": "うみ" },
        { "type": "quiz", "question": "Which word means sea?", "options": ["うみ", "やま", "ねこ", "とり"], "answer": "うみ" },
        { "type": "typing", "question": "Arrange correctly: ま + や", "character": "ま + や", "answer": "やま" },
        { "type": "typing", "question": "Build the word bird", "character": "と + り", "answer": "とり" },
        { "type": "quiz", "question": "Which word means bird", "options": ["とり", "ねこ", "いぬ", "うま"], "answer": "とり" }
      ]
    }
  },
  {
    "id": "m4-lesson-2",
    "subModule": "word-building",
    "title": "Animals",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 2,
    "phases": {
      "learn": [
        { "type": "intro", "character": "ねこ", "romaji": "cat" },
        { "type": "intro", "character": "いぬ", "romaji": "dog" },
        { "type": "intro", "character": "とり", "romaji": "bird" },
        { "type": "intro", "character": "うま", "romaji": "horse" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does ねこ mean?", "options": ["cat", "dog", "bird", "horse"], "answer": "cat" },
        { "type": "quiz", "question": "Build dog", "options": ["い + ぬ", "ね + こ", "う + ま", "と + り"], "answer": "い + ぬ" },
        { "type": "quiz", "question": "What does とり mean?", "options": ["bird", "cat", "dog", "horse"], "answer": "bird" },
        { "type": "quiz", "question": "Build horse", "options": ["う + ま", "い + ぬ", "ね + こ", "と + り"], "answer": "う + ま" },
        { "type": "quiz", "question": "Which is cat", "options": ["ねこ", "いぬ", "うま", "とり"], "answer": "ねこ" }
      ],
      "play": [
        { "type": "quiz", "question": "Which word means dog", "options": ["いぬ", "ねこ", "うま", "とり"], "answer": "いぬ" },
        { "type": "typing", "question": "Arrange: り + と", "character": "り + と", "answer": "とり" },
        { "type": "quiz", "question": "What animal is うま", "options": ["horse", "cat", "dog", "bird"], "answer": "horse" },
        { "type": "quiz", "question": "Choose the correct word: cat", "options": ["ねこ", "いぬ", "うま"], "answer": "ねこ" },
        { "type": "typing", "question": "Build: ね + こ", "character": "ね + こ", "answer": "ねこ" }
      ]
    }
  },
  {
    "id": "m4-lesson-3",
    "subModule": "word-building",
    "title": "Nature",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 3,
    "phases": {
      "learn": [
        { "type": "intro", "character": "やま", "romaji": "mountain" },
        { "type": "intro", "character": "うみ", "romaji": "sea" },
        { "type": "intro", "character": "かわ", "romaji": "river" },
        { "type": "intro", "character": "そら", "romaji": "sky" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does やま mean?", "options": ["mountain", "sea", "river", "sky"], "answer": "mountain" },
        { "type": "quiz", "question": "Build sea", "options": ["う + み", "や + ま", "か + わ", "そ + ら"], "answer": "う + み" },
        { "type": "quiz", "question": "What does かわ mean?", "options": ["river", "mountain", "sea", "sky"], "answer": "river" },
        { "type": "quiz", "question": "Build: そ + ら", "options": ["そら", "うみ", "やま", "かわ"], "answer": "そら" },
        { "type": "quiz", "question": "Which word means sky", "options": ["そら", "やま", "かわ", "うみ"], "answer": "そら" }
      ],
      "play": [
        { "type": "typing", "question": "Arrange: わ + か", "character": "わ + か", "answer": "かわ" },
        { "type": "quiz", "question": "Which means mountain", "options": ["やま", "うみ", "そら", "かわ"], "answer": "やま" },
        { "type": "quiz", "question": "What does うみ mean?", "options": ["sea", "mountain", "river", "sky"], "answer": "sea" },
        { "type": "typing", "question": "Build: や + ま", "character": "や + ま", "answer": "やま" },
        { "type": "quiz", "question": "Which means river", "options": ["かわ", "やま", "うみ", "そら"], "answer": "かわ" }
      ]
    }
  },
  {
    "id": "m4-lesson-4",
    "subModule": "word-building",
    "title": "Food",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 4,
    "phases": {
      "learn": [
        { "type": "intro", "character": "すし", "romaji": "sushi" },
        { "type": "intro", "character": "パン", "romaji": "bread" },
        { "type": "intro", "character": "みず", "romaji": "water" },
        { "type": "intro", "character": "ちゃ", "romaji": "tea" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does すし mean?", "options": ["sushi", "bread", "water", "tea"], "answer": "sushi" },
        { "type": "quiz", "question": "Build tea", "options": ["ちゃ", "ち", "つ", "た"], "answer": "ちゃ" },
        { "type": "quiz", "question": "What does みず mean?", "options": ["water", "tea", "sushi", "bread"], "answer": "water" },
        { "type": "quiz", "question": "Which word means bread", "options": ["パン", "みず", "すし", "ちゃ"], "answer": "パン" },
        { "type": "typing", "question": "Arrange: し + す", "character": "し + す", "answer": "すし" }
      ],
      "play": [
        { "type": "quiz", "question": "Which means water", "options": ["みず", "ちゃ", "パン", "すし"], "answer": "みず" },
        { "type": "typing", "question": "Build: み + ず", "character": "み + ず", "answer": "みず" },
        { "type": "quiz", "question": "What does ちゃ mean?", "options": ["tea", "water", "bread", "sushi"], "answer": "tea" },
        { "type": "quiz", "question": "Choose sushi", "options": ["すし", "いぬ", "ねこ", "やま"], "answer": "すし" },
        { "type": "typing", "question": "Build: パ + ン", "character": "パ + ン", "answer": "パン" }
      ]
    }
  },
  {
    "id": "m4-lesson-5",
    "subModule": "word-building",
    "title": "Objects",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 5,
    "phases": {
      "learn": [
        { "type": "intro", "character": "ほん", "romaji": "book" },
        { "type": "intro", "character": "くつ", "romaji": "shoes" },
        { "type": "intro", "character": "かばん", "romaji": "bag" },
        { "type": "intro", "character": "かぎ", "romaji": "key" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does ほん mean?", "options": ["book", "shoes", "bag", "key"], "answer": "book" },
        { "type": "quiz", "question": "Build bag", "options": ["か + ば + ん", "か + ぱ + ん", "は + は", "き + れ"], "answer": "か + ば + ん" },
        { "type": "quiz", "question": "What does くつ mean?", "options": ["shoes", "bag", "key", "book"], "answer": "shoes" },
        { "type": "quiz", "question": "Which word means key", "options": ["かぎ", "かき", "かみ", "かび"], "answer": "かぎ" },
        { "type": "typing", "question": "Arrange: ん + ほ", "character": "ん + ほ", "answer": "ほん" }
      ],
      "play": [
        { "type": "typing", "question": "Build shoes: く + つ", "character": "く + つ", "answer": "くつ" },
        { "type": "quiz", "question": "Which word means bag", "options": ["かばん", "ほん", "くつ", "かぎ"], "answer": "かばん" },
        { "type": "quiz", "question": "What does かぎ mean?", "options": ["key", "bag", "book", "shoes"], "answer": "key" },
        { "type": "typing", "question": "Build: ほ + ん", "character": "ほ + ん", "answer": "ほん" },
        { "type": "quiz", "question": "Which means book", "options": ["ほん", "かばん", "かぎ", "くつ"], "answer": "ほん" }
      ]
    }
  },
  {
    "id": "m4-lesson-6",
    "subModule": "word-building",
    "title": "Numbers",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 6,
    "phases": {
      "learn": [
        { "type": "intro", "character": "いち", "romaji": "1" },
        { "type": "intro", "character": "に", "romaji": "2" },
        { "type": "intro", "character": "さん", "romaji": "3" },
        { "type": "intro", "character": "よん", "romaji": "4" },
        { "type": "intro", "character": "ご", "romaji": "5" }
      ],
      "practice": [
        { "type": "quiz", "question": "What is いち", "options": ["1", "2", "3", "4"], "answer": "1" },
        { "type": "quiz", "question": "Build: さ + ん", "options": ["さん", "さる", "しん", "そん"], "answer": "さん" },
        { "type": "quiz", "question": "What is に", "options": ["2", "1", "3", "4"], "answer": "2" },
        { "type": "quiz", "question": "What is ご", "options": ["5", "3", "1", "2"], "answer": "5" },
        { "type": "quiz", "question": "Which number is 4", "options": ["よん", "さん", "に", "いち"], "answer": "よん" }
      ],
      "play": [
        { "type": "typing", "question": "Build: い + ち", "character": "い + ち", "answer": "いち" },
        { "type": "quiz", "question": "What number is さん", "options": ["3", "1", "2", "4"], "answer": "3" },
        { "type": "quiz", "question": "Which is two", "options": ["に", "ご", "いち", "よん"], "answer": "に" },
        { "type": "typing", "question": "Arrange: ん + よ", "character": "ん + よ", "answer": "よん" },
        { "type": "quiz", "question": "What is ご", "options": ["5", "3", "1", "2"], "answer": "5" }
      ]
    }
  },
  {
    "id": "m4-lesson-7",
    "subModule": "word-building",
    "title": "Family",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 7,
    "phases": {
      "learn": [
        { "type": "intro", "character": "はは", "romaji": "mother" },
        { "type": "intro", "character": "ちち", "romaji": "father" },
        { "type": "intro", "character": "あに", "romaji": "older brother" },
        { "type": "intro", "character": "あね", "romaji": "older sister" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does はは mean?", "options": ["mother", "father", "brother", "sister"], "answer": "mother" },
        { "type": "quiz", "question": "Build father", "options": ["ち + ち", "は + は", "あ + に", "あ + ね"], "answer": "ち + ち" },
        { "type": "quiz", "question": "What does あに mean?", "options": ["older brother", "mother", "father", "sister"], "answer": "older brother" },
        { "type": "quiz", "question": "Which means older sister", "options": ["あね", "あに", "はは", "ちち"], "answer": "あね" },
        { "type": "typing", "question": "Arrange: は + は", "character": "は + は", "answer": "はは" }
      ],
      "play": [
        { "type": "typing", "question": "Build: あ + ね", "character": "あ + ね", "answer": "あね" },
        { "type": "quiz", "question": "Which means mother", "options": ["はは", "ちち", "あに", "あね"], "answer": "はは" },
        { "type": "quiz", "question": "What does ちち mean?", "options": ["father", "mother", "brother", "sister"], "answer": "father" },
        { "type": "quiz", "question": "Which means brother", "options": ["あに", "あね", "はは", "ちち"], "answer": "あに" },
        { "type": "typing", "question": "Build: あ + に", "character": "あ + に", "answer": "あに" }
      ]
    }
  },
  {
    "id": "m4-lesson-8",
    "subModule": "word-building",
    "title": "Adjectives",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 25,
    "order": 8,
    "phases": {
      "learn": [
        { "type": "intro", "character": "おおきい", "romaji": "big" },
        { "type": "intro", "character": "ちいさい", "romaji": "small" },
        { "type": "intro", "character": "あかい", "romaji": "red" }
      ],
      "practice": [
        { "type": "quiz", "question": "What does おおきい mean?", "options": ["big", "small", "red", "blue"], "answer": "big" },
        { "type": "quiz", "question": "What does ちいさい mean?", "options": ["small", "big", "red", "blue"], "answer": "small" },
        { "type": "quiz", "question": "Which word means red", "options": ["あかい", "あおい", "しろい", "くろい"], "answer": "あかい" },
        { "type": "typing", "question": "Build: あ + か + い", "character": "あ + か + い", "answer": "あかい" },
        { "type": "quiz", "question": "Which means big", "options": ["おおきい", "ちいさい", "あかい", "あおい"], "answer": "おおきい" }
      ],
      "play": [
        { "type": "quiz", "question": "What does あかい mean?", "options": ["red", "big", "small", "blue"], "answer": "red" },
        { "type": "typing", "question": "Build: ち + い + さ + い", "character": "ち + い + さ + い", "answer": "ちいさい" },
        { "type": "quiz", "question": "Choose small", "options": ["ちいさい", "おおきい", "あかい", "あおい"], "answer": "ちいさい" },
        { "type": "quiz", "question": "Which means red", "options": ["あかい", "あおい", "しろい", "くろい"], "answer": "あかい" },
        { "type": "typing", "question": "Build: お + お + き + い", "character": "お + お + き + い", "answer": "おおきい" }
      ]
    }
  },
  {
    "id": "m4-lesson-9",
    "subModule": "word-building",
    "title": "Word puzzle game",
    "category": "Games",
    "difficulty": 2,
    "xpReward": 30,
    "order": 9,
    "phases": {
      "learn": [{ "type": "intro", "character": "Word Puzzle", "romaji": "Combine kana to form complete words.", "hint": "Focus on the order." }],
      "practice": [
        { "type": "quiz", "question": "Build: ね + こ", "options": ["ねこ", "いぬ", "とり", "うま"], "answer": "ねこ" },
        { "type": "quiz", "question": "Build: い + ぬ", "options": ["いぬ", "ねこ", "とり", "うま"], "answer": "いぬ" },
        { "type": "quiz", "question": "Build: や + ま", "options": ["やま", "うみ", "かわ", "そら"], "answer": "やま" },
        { "type": "quiz", "question": "Build: う + み", "options": ["うみ", "やま", "かわ", "そら"], "answer": "うみ" },
        { "type": "quiz", "question": "Build: す + し", "options": ["すし", "パン", "みず", "ちゃ"], "answer": "すし" }
      ],
      "play": [
        { "type": "typing", "question": "Build book", "character": "ほ + ん", "answer": "ほん" },
        { "type": "typing", "question": "Build water", "character": "み + ず", "answer": "みず" },
        { "type": "typing", "question": "Build bird", "character": "と + り", "answer": "とり" },
        { "type": "typing", "question": "Build sky", "character": "そ + ら", "answer": "そら" },
        { "type": "typing", "question": "Build shoes", "character": "く + つ", "answer": "くつ" }
      ]
    }
  },
  {
    "id": "m4-lesson-10",
    "subModule": "word-building",
    "title": "Word recognition quiz",
    "category": "Vocabulary",
    "difficulty": 2,
    "xpReward": 30,
    "order": 10,
    "phases": {
      "learn": [{ "type": "intro", "character": "Word Recognition", "romaji": "Identify the meaning of complete words.", "hint": "Vocabulary check." }],
      "practice": [
        { "type": "quiz", "question": "What does やま mean?", "options": ["mountain", "sea", "river", "sky"], "answer": "mountain" },
        { "type": "quiz", "question": "What does ねこ mean?", "options": ["cat", "dog", "bird", "horse"], "answer": "cat" },
        { "type": "quiz", "question": "What does ほん mean?", "options": ["book", "shoes", "bag", "key"], "answer": "book" },
        { "type": "quiz", "question": "What does いち mean?", "options": ["1", "2", "3", "4"], "answer": "1" },
        { "type": "quiz", "question": "What does すし mean?", "options": ["sushi", "bread", "water", "tea"], "answer": "sushi" }
      ],
      "play": [
        { "type": "quiz", "question": "What does うみ mean?", "options": ["sea", "mountain", "river", "sky"], "answer": "sea" },
        { "type": "quiz", "question": "What does いぬ mean?", "options": ["dog", "cat", "bird", "horse"], "answer": "dog" },
        { "type": "quiz", "question": "What does かばん mean?", "options": ["bag", "book", "shoes", "key"], "answer": "bag" },
        { "type": "quiz", "question": "What does はは mean?", "options": ["mother", "father", "brother", "sister"], "answer": "mother" },
        { "type": "quiz", "question": "What does おおきい mean?", "options": ["big", "small", "red", "blue"], "answer": "big" }
      ]
    }
  },
  {
    "id": "m4-lesson-11",
    "subModule": "word-building",
    "title": "Word reading",
    "category": "Hiragana",
    "difficulty": 3,
    "xpReward": 30,
    "order": 11,
    "phases": {
      "learn": [{ "type": "intro", "character": "Reading Mastery", "romaji": "Read complete words in Hiragana/Katakana.", "hint": "Sound it out." }],
      "practice": [
        { "type": "quiz", "question": "Read: ねこ", "options": ["neko", "inu", "tori", "uma"], "answer": "neko" },
        { "type": "quiz", "question": "Read: やま", "options": ["yama", "umi", "kawa", "sora"], "answer": "yama" },
        { "type": "quiz", "question": "Read: ほん", "options": ["hon", "kutsu", "kaban", "kagi"], "answer": "hon" },
        { "type": "quiz", "question": "Read: いち", "options": ["ichi", "ni", "san", "yon"], "answer": "ichi" },
        { "type": "quiz", "question": "Read: すし", "options": ["sushi", "pan", "mizu", "cha"], "answer": "sushi" }
      ],
      "play": [
        { "type": "typing", "question": "Type the reading for: いぬ", "character": "いぬ", "answer": "inu" },
        { "type": "typing", "question": "Type the reading for: うみ", "character": "うみ", "answer": "umi" },
        { "type": "typing", "question": "Type the reading for: かばん", "character": "かばん", "answer": "kaban" },
        { "type": "typing", "question": "Type the reading for: はは", "character": "はは", "answer": "haha" },
        { "type": "typing", "question": "Type the reading for: あかい", "character": "あかい", "answer": "akai" }
      ]
    }
  },
  {
    "id": "m4-lesson-12",
    "subModule": "word-building",
    "title": "Speed builder game",
    "category": "Games",
    "difficulty": 3,
    "xpReward": 35,
    "order": 12,
    "timer": 45,
    "phases": {
      "learn": [{ "type": "intro", "character": "Speed Builder", "romaji": "Build words rapidly against the clock.", "hint": "Think fast!" }],
      "practice": [
        { "type": "quiz", "question": "Build: う + み", "options": ["うみ", "やま", "かわ", "そら"], "answer": "うみ" },
        { "type": "quiz", "question": "Build: ぱ + ん", "options": ["ぱん", "みず", "すし", "ちゃ"], "answer": "ぱん" },
        { "type": "quiz", "question": "Build: こ + ね", "options": ["ねこ", "いぬ", "うま", "とり"], "answer": "ねこ" },
        { "type": "quiz", "question": "Build: ぬ + い", "options": ["いぬ", "ねこ", "うま", "とり"], "answer": "いぬ" },
        { "type": "quiz", "question": "Build: ま + や", "options": ["やま", "うみ", "かわ", "そら"], "answer": "やま" }
      ],
      "play": [
        { "type": "typing", "question": "Speed build bird", "character": "と + り", "answer": "とり" },
        { "type": "typing", "question": "Speed build water", "character": "み + ず", "answer": "みず" },
        { "type": "typing", "question": "Speed build bag", "character": "か + ば + ん", "answer": "かばん" },
        { "type": "typing", "question": "Speed build book", "character": "ほ + ん", "answer": "ほん" },
        { "type": "typing", "question": "Speed build sky", "character": "そ + ら", "answer": "そら" }
      ]
    }
  },
  {
    "id": "m4-lesson-13",
    "subModule": "word-building",
    "title": "Memory matching",
    "category": "Games",
    "difficulty": 2,
    "xpReward": 30,
    "order": 13,
    "phases": {
      "learn": [{ "type": "intro", "character": "Memory Match", "romaji": "Link the Japanese word with its translation.", "hint": "Memorize the pairs." }],
      "practice": [
        { "type": "quiz", "question": "Match: ねこ", "options": ["cat", "dog", "bird", "horse"], "answer": "cat" },
        { "type": "quiz", "question": "Match: うみ", "options": ["sea", "mountain", "river", "sky"], "answer": "sea" },
        { "type": "quiz", "question": "Match: ほん", "options": ["book", "shoes", "bag", "key"], "answer": "book" },
        { "type": "quiz", "question": "Match: いち", "options": ["1", "2", "3", "4"], "answer": "1" },
        { "type": "quiz", "question": "Match: すし", "options": ["sushi", "bread", "water", "tea"], "answer": "sushi" }
      ],
      "play": [
        { "type": "quiz", "question": "Match: いぬ", "options": ["dog", "cat", "bird", "horse"], "answer": "dog" },
        { "type": "quiz", "question": "Match: やま", "options": ["mountain", "sea", "river", "sky"], "answer": "mountain" },
        { "type": "quiz", "question": "Match: かばん", "options": ["bag", "book", "shoes", "key"], "answer": "bag" },
        { "type": "quiz", "question": "Match: はは", "options": ["mother", "father", "brother", "sister"], "answer": "mother" },
        { "type": "quiz", "question": "Match: おおきい", "options": ["big", "small", "red", "blue"], "answer": "big" }
      ]
    }
  },
  {
    "id": "m4-lesson-14",
    "subModule": "word-building",
    "title": "Reading challenge",
    "category": "Hiragana",
    "difficulty": 3,
    "xpReward": 35,
    "order": 14,
    "phases": {
      "learn": [{ "type": "intro", "character": "Reading Challenge", "romaji": "Advanced word reading and comprehension.", "hint": "Read carefully." }],
      "practice": [
        { "type": "quiz", "question": "Read and translate: いぬ", "options": ["dog", "cat", "bird", "horse"], "answer": "dog" },
        { "type": "quiz", "question": "Read and translate: かわ", "options": ["river", "mountain", "sea", "sky"], "answer": "river" },
        { "type": "quiz", "question": "Read and translate: かぎ", "options": ["key", "bag", "book", "shoes"], "answer": "key" },
        { "type": "quiz", "question": "Read and translate: よん", "options": ["4", "3", "2", "1"], "answer": "4" },
        { "type": "quiz", "question": "Read and translate: ちゃ", "options": ["tea", "water", "sushi", "bread"], "answer": "tea" }
      ],
      "play": [
        { "type": "typing", "question": "What does this mean? いぬ", "character": "いぬ", "answer": "dog" },
        { "type": "typing", "question": "What does this mean? そら", "character": "そら", "answer": "sky" },
        { "type": "typing", "question": "What does this mean? くつ", "character": "くつ", "answer": "shoes" },
        { "type": "typing", "question": "What does this mean? あかい", "character": "あかい", "answer": "red" },
        { "type": "typing", "question": "What does this mean? ちち", "character": "ちち", "answer": "father" }
      ]
    }
  },
  {
    "id": "boss-m4",
    "subModule": "word-building",
    "title": "Module 4 Boss: Word General",
    "category": "Boss",
    "difficulty": 4,
    "xpReward": 100,
    "order": 15,
    "isBoss": true,
    "timer": 60,
    "phases": {
      "play": [
        { "type": "typing", "question": "Build: ね + こ", "character": "ね + こ", "answer": "ねこ" },
        { "type": "quiz", "question": "What does うみ mean?", "options": ["sea", "mountain", "river", "sky"], "answer": "sea" },
        { "type": "quiz", "question": "Which word means mountain", "options": ["やま", "うみ", "かわ", "そら"], "answer": "やま" },
        { "type": "typing", "question": "Build dog: い + ぬ", "character": "い + ぬ", "answer": "いぬ" },
        { "type": "quiz", "question": "What does ほん mean?", "options": ["book", "shoes", "bag", "key"], "answer": "book" },
        { "type": "quiz", "question": "Which word means water", "options": ["みず", "ちゃ", "すし", "パン"], "answer": "みず" },
        { "type": "typing", "question": "Build river: か + わ", "character": "か + わ", "answer": "かわ" },
        { "type": "quiz", "question": "What does すし mean?", "options": ["sushi", "bread", "water", "tea"], "answer": "sushi" },
        { "type": "quiz", "question": "Which word means bird", "options": ["とり", "ねこ", "いぬ", "うま"], "answer": "とり" },
        { "type": "typing", "question": "Build sky: そ + ら", "character": "そ + ら", "answer": "そら" }
      ]
    }
  }
];

// Filter out existing Module 4 lessons and insert new ones
const filteredLessons = lessons.filter(l => l.subModule !== 'word-building');
const newLessons = [...filteredLessons, ...m4Lessons];

// Optional: Sort by order if needed, but keeping original positions is better.
// Actually, let's just make sure they are at the end of Module 3 or where they were.

fs.writeFileSync(filePath, JSON.stringify(newLessons, null, 2));
console.log('Successfully updated Module 4 lessons in lessons.json');
