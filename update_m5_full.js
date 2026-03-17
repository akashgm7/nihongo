const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\HP\\Desktop\\AntiGravity\\japanese\\backend\\data\\lessons.json';

// Define the full content for all 14 lessons
const module5Lessons = [
  {
    "id": "m5-lesson-1",
    "subModule": "grammar-basics",
    "title": "Japanese Sentence Structure",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 1,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Arrange the sentence: わたし / は / がくせい / です", "options": ["わたし は がくせい です", "がくせい は わたし です", "です わたし は がくせい", "は わたし です がくせい"], "answer": "わたし は がくせい です" },
      { "id": "q2", "type": "quiz", "question": "Which sentence order is correct?", "options": ["わたし は パン を たべます", "パン わたし は を たべます", "たべます わたし は パン を", "を パン わたし は たべます"], "answer": "わたし は パン を たべます" },
      { "id": "q3", "type": "quiz", "question": "What is the verb in 'わたし は パン を たべます'?", "options": ["たべます", "パン", "わたし", "は"], "answer": "たべます" },
      { "id": "q4", "type": "quiz", "question": "Identify the subject in 'ねこ は さかな を たべます'", "options": ["ねこ", "さかな", "たべます", "は"], "answer": "ねこ" },
      { "id": "q5", "type": "quiz", "question": "Identify the object in 'ねこ は さかな を たべます'", "options": ["さかな", "ねこ", "たべます", "を"], "answer": "さかな" },
      { "id": "q6", "type": "quiz", "question": "Arrange: ねこ / は / かわいい / です", "options": ["ねこ は かわいい です", "かわいい ねこ です は", "です ねこ は かわいい", "ねこ は です かわいい"], "answer": "ねこ は かわいい です" },
      { "id": "q7", "type": "translate", "question": "What does 'わたし は がくせい です' mean?", "options": ["I am a student", "You are a student", "I am a teacher", "He is a student"], "answer": "I am a student" },
      { "id": "q8", "type": "quiz", "question": "Identify the particle: わたし は", "options": ["は", "わたし", "です", "が"], "answer": "は" },
      { "id": "q9", "type": "typing", "question": "Build the sentence: I am Tanaka", "character": "わたし / は / たなか / です", "answer": "わたし は たなか です" },
      { "id": "q10", "type": "quiz", "question": "What comes at the end of Japanese sentences?", "options": ["Verb or です", "Subject", "Particle", "Object"], "answer": "Verb or です" }
    ]
  },
  {
    "id": "m5-lesson-2",
    "subModule": "grammar-basics",
    "title": "Topic Particle は (wa)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 2,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Choose the correct particle: わたし ___ がくせい です", "options": ["は", "を", "が", "の"], "answer": "は" },
      { "id": "q2", "type": "quiz", "question": "Identify the particle: たなかさん は せんせい です", "options": ["は", "さん", "です", "せんせい"], "answer": "は" },
      { "id": "q3", "type": "quiz", "question": "What is the meaning of 'は' in this context?", "options": ["Topic marker", "Object marker", "Subject marker", "Possession marker"], "answer": "Topic marker" },
      { "id": "q4", "type": "translate", "question": "Translate: I am Tanaka", "options": ["わたし は たなか です", "たなか は わたし です", "わたし は せんせい です", "わたし の たなか"], "answer": "わたし は たなか です" },
      { "id": "q5", "type": "quiz", "question": "What is the topic? 'はな は かわいい です'", "options": ["はな", "かわいい", "です", "は"], "answer": "はな" },
      { "id": "q6", "type": "typing", "question": "Arrange: わたし / は / びょういん / に / いきます", "character": "わたし / は / びょういん / に / いきます", "answer": "わたし は びょういん に いきます" },
      { "id": "q7", "type": "quiz", "question": "Meaning of 'は'?", "options": ["Topic marker", "Place marker", "Time marker", "Action marker"], "answer": "Topic marker" },
      { "id": "q8", "type": "quiz", "question": "Identify the topic: 'いぬ は はしります'", "options": ["いぬ", "はしります", "は", "ねこ"], "answer": "いぬ" },
      { "id": "q9", "type": "quiz", "question": "Is 'は' pronounced as 'wa' when used as a particle?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q10", "type": "typing", "question": "Translate: 'Today is hot'", "character": "きょう / は / あつい / です", "answer": "きょう は あつい です" }
    ]
  },
  {
    "id": "m5-lesson-3",
    "subModule": "grammar-basics",
    "title": "Possession Particle の (no)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 3,
    "content": [
      { "id": "q1", "type": "translate", "question": "How do you say 'Tanaka's book'?", "options": ["たなかさん の ほん", "ほん の たなかさん", "たなかさん は ほん", "たなかさん を ほん"], "answer": "たなかさん の ほん" },
      { "id": "q2", "type": "quiz", "question": "Identify the particle: わたしの いぬ", "options": ["の", "わたし", "いぬ", "は"], "answer": "の" },
      { "id": "q3", "type": "quiz", "question": "Meaning of 'の'?", "options": ["Possession", "Topic", "Object", "Subject"], "answer": "Possession" },
      { "id": "q4", "type": "translate", "question": "Translate: My teacher", "options": ["わたし の せんせい", "わたし は せんせい", "せんせい の わたし", "わたし が せんせい"], "answer": "わたし の せんせい" },
      { "id": "q5", "type": "quiz", "question": "Identify the particle: がっこう の こども", "options": ["の", "がっこう", "こども", "は"], "answer": "の" },
      { "id": "q6", "type": "translate", "question": "Translate: Japanese book", "options": ["にほんご の ほん", "にほんご は ほん", "にほんご を ほん", "ほん の にほんご"], "answer": "にほんご の ほん" },
      { "id": "q7", "type": "translate", "question": "Translate: Friend's name", "options": ["ともだち の なまえ", "なまえ の ともだち", "ともだち は なまえ", "ともだち を なまえ"], "answer": "ともだち の なまえ" },
      { "id": "q8", "type": "typing", "question": "Translate 'My name'", "character": "わたし / の / なまえ", "answer": "わたし の なまえ" },
      { "id": "q9", "type": "typing", "question": "Build: My cat is cute", "character": "わたし / の / ねこ / は / かわいい / です", "answer": "わたし の ねこ は かわいい です" },
      { "id": "q10", "type": "quiz", "question": "Whose book? 'だれ の ほん です か'", "options": ["だれ", "の", "ほん", "か"], "answer": "だれ" }
    ]
  },
  {
    "id": "m5-lesson-4",
    "subModule": "grammar-basics",
    "title": "Object Particle を (o/wo)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 4,
    "content": [
      { "id": "q1", "type": "translate", "question": "Translate: Drink water", "options": ["みず を のみます", "みず は のみます", "みず が あります", "みず の のみます"], "answer": "みず を のみます" },
      { "id": "q2", "type": "quiz", "question": "Identify the particle: パン を たべます", "options": ["を", "パン", "たべます", "は"], "answer": "を" },
      { "id": "q3", "type": "quiz", "question": "What is being eaten? 'りんご を たべます'", "options": ["りんご", "たべます", "を", "わたし"], "answer": "りんご" },
      { "id": "q4", "type": "quiz", "question": "What is the object in 'ほん を よみます'?", "options": ["ほん", "よみます", "を", "が"], "answer": "ほん" },
      { "id": "q5", "type": "translate", "question": "Translate: Buy a car", "options": ["くるま を かいます", "くるま は かいます", "くるま が あります", "くるま の かいます"], "answer": "くるま を かいます" },
      { "id": "q6", "type": "quiz", "question": "Identify particle: おんがく を ききます", "options": ["を", "おんがく", "ききます", "は"], "answer": "を" },
      { "id": "q7", "type": "typing", "question": "Translate: Eat sushi", "character": "すし / を / たべます", "answer": "すし を たべます" },
      { "id": "q8", "type": "typing", "question": "Translate: Read book", "character": "ほん / を / よみます", "answer": "ほん を よみます" },
      { "id": "q9", "type": "typing", "question": "Translate: Watch TV", "character": "てれび / を / みます", "answer": "てれび を みます" },
      { "id": "q10", "type": "quiz", "question": "Is 'を' usually pronounced 'o'?", "options": ["Yes", "No"], "answer": "Yes" }
    ]
  },
  {
    "id": "m5-lesson-5",
    "subModule": "grammar-basics",
    "title": "Subject Particle が (ga)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 5,
    "content": [
      { "id": "q1", "type": "translate", "question": "Translate: There is a cat", "options": ["ねこ が います", "ねこ は います", "ねこ を います", "ねこ の います"], "answer": "ねこ が います" },
      { "id": "q2", "type": "quiz", "question": "Subject in 'あめ が ふります' (It rains)?", "options": ["あめ", "ふります", "が", "あき"], "answer": "あめ" },
      { "id": "q3", "type": "quiz", "question": "Particle for existence?", "options": ["が", "を", "は", "に"], "answer": "が" },
      { "id": "q4", "type": "typing", "question": "Build: Dog is here", "character": "いぬ / が / います", "answer": "いぬ が います" },
      { "id": "q5", "type": "quiz", "question": "Identify subject: 'はな が さきます'", "options": ["はな", "さきます", "が", "に"], "answer": "はな" },
      { "id": "q6", "type": "translate", "question": "Translate: I like sushi", "options": ["すし が すき です", "すし を すき です", "すし は すき です", "すし の すき です"], "answer": "すし が すき です" },
      { "id": "q7", "type": "quiz", "question": "Identify the particle: だれ が きますか", "options": ["が", "だれ", "きます", "か"], "answer": "が" },
      { "id": "q8", "type": "quiz", "question": "Identify the subject in 'くるま が あります'?", "options": ["くるま", "あります", "が", "みち"], "answer": "くるま" },
      { "id": "q9", "type": "quiz", "question": "Is 'が' a subject marker?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q10", "type": "typing", "question": "Build: There is a book", "character": "ほん / が / あります", "answer": "ほん が あります" }
    ]
  },
  {
    "id": "m5-lesson-6",
    "subModule": "grammar-basics",
    "title": "Location Particle に (ni)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 6,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank: がっこう ___ いきます (Go to school)", "options": ["に", "で", "を", "は"], "answer": "に" },
      { "id": "q2", "type": "translate", "question": "Translate: Go home", "options": ["うち に かえります", "うち で かえります", "うち を かえります", "うち は かえります"], "answer": "うち に かえります" },
      { "id": "q3", "type": "quiz", "question": "Which particle shows destination?", "options": ["に", "を", "が", "の"], "answer": "に" },
      { "id": "q4", "type": "quiz", "question": "Fill blank: 7じ ___ おきます (Wake up at 7)", "options": ["に", "で", "を", "は"], "answer": "に" },
      { "id": "id", "type": "quiz", "question": "Which particle marks specific time?", "options": ["に", "で", "を", "は"], "answer": "に" },
      { "id": "q6", "type": "translate", "question": "Translate: Walk to the park", "options": ["こうえん に あるきます", "こうえん で あるきます", "こうえん を あるきます", "こうえん は あるきます"], "answer": "こうえん に あるきます" },
      { "id": "q7", "type": "quiz", "question": "Identify the particle: とうきょう に いきます", "options": ["に", "とうきょう", "いきます", "は"], "answer": "に" },
      { "id": "q8", "type": "typing", "question": "Build: Go to the station", "character": "えき / に / いきます", "answer": "えき に いきます" },
      { "id": "q9", "type": "quiz", "question": "Is 'に' used for destinations?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q10", "type": "typing", "question": "Translate: Return to Japan", "character": "にほん / に / かえります", "answer": "にほん に かえります" }
    ]
  },
  {
    "id": "m5-lesson-7",
    "subModule": "grammar-basics",
    "title": "Location Particle で (de)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 7,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank: レストラン ___ たべます (Eat at a restaurant)", "options": ["で", "に", "を", "が"], "answer": "で" },
      { "id": "q2", "type": "translate", "question": "Translate: Study at school", "options": ["がっこう で べんきょう します", "がっこう に べんきょう します", "がっこう を べんきょう します", "がっこう は べんきょう します"], "answer": "がっこう で べんきょう します" },
      { "id": "q3", "type": "quiz", "question": "Which particle marks where an action happens?", "options": ["で", "に", "を", "が"], "answer": "で" },
      { "id": "q4", "type": "quiz", "question": "Fill blank: タクシー ___ いきます (Go by taxi)", "options": ["で", "に", "を", "は"], "answer": "で" },
      { "id": "q5", "type": "quiz", "question": "Which particle marks means or tools?", "options": ["で", "に", "を", "は"], "answer": "で" },
      { "id": "q6", "type": "translate", "question": "Translate: Eat with a spoon", "options": ["スプーン で たべます", "スプーン に たべます", "スプーン を たべます", "スプーン は たべます"], "answer": "スプーン で たべます" },
      { "id": "q7", "type": "quiz", "question": "Identify particle: にほんご で はなします", "options": ["で", "にほんご", "はなします", "は"], "answer": "で" },
      { "id": "q8", "type": "typing", "question": "Build: Read in the library", "character": "としょかん / で / よみます", "answer": "としょかん で よみます" },
      { "id": "q9", "type": "quiz", "question": "Is 'で' used for means of transport?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q10", "type": "typing", "question": "Translate: Write with a pen", "character": "ペン / で / かきます", "answer": "ペン で かきます" }
    ]
  },
  {
    "id": "m5-lesson-8",
    "subModule": "grammar-basics",
    "title": "Polite Ending です / ます (desu/masu)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 8,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank: わたし は がくせい ___", "options": ["です", "ます", "だ", "いる"], "answer": "です" },
      { "id": "q2", "type": "quiz", "question": "Is 'です' polite or casual?", "options": ["Polite", "Casual", "Very formal", "Rude"], "answer": "Polite" },
      { "id": "q3", "type": "translate", "question": "Translate: It is a cat", "options": ["ねこ です", "ねこ が います", "ねこ を たべます", "ねこ は どこ"], "answer": "ねこ です" },
      { "id": "q4", "type": "quiz", "question": "Which one is for verbs? 'たべ___'", "options": ["ます", "です", "だ", "に"], "answer": "ます" },
      { "id": "q5", "type": "translate", "question": "Translate: I drink", "options": ["のみます", "のみです", "のみだ", "のみ"], "answer": "のみます" },
      { "id": "q6", "type": "quiz", "question": "Is 'ます' used for nouns or verbs?", "options": ["Verbs", "Nouns", "Adjectives", "Particles"], "answer": "Verbs" },
      { "id": "q7", "type": "quiz", "question": "Fill blank: これ は ほん ___", "options": ["です", "ます", "を", "が"], "answer": "です" },
      { "id": "q8", "type": "typing", "question": "Build: I eat", "character": "たべます", "answer": "たべます" },
      { "id": "q9", "type": "quiz", "question": "Which is more polite? 'desu' or 'da'?", "options": ["desu", "da"], "answer": "desu" },
      { "id": "q10", "type": "typing", "question": "Translate: It is Tanaka", "character": "たなか / です", "answer": "たなか です" }
    ]
  },
  {
    "id": "m5-lesson-9",
    "subModule": "grammar-basics",
    "title": "Negative Ending (dewa arimasen / masen)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 9,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank (Noun Negative): がくせい では ______", "options": ["ありません", "あります", "です", "ます"], "answer": "ありません" },
      { "id": "q2", "type": "translate", "question": "Translate: It is not a cat", "options": ["ねこ では ありません", "ねこ です", "ねこ が ありません", "ねこ を しりません"], "answer": "ねこ では ありません" },
      { "id": "q3", "type": "quiz", "question": "What is the polite negative of 'desu'?", "options": ["dewa arimasen", "nai desu", "janai", "masen"], "answer": "dewa arimasen" },
      { "id": "q4", "type": "quiz", "question": "Fill blank (Verb Negative): たべ___", "options": ["ません", "ます", "ませんね", "ますね"], "answer": "ません" },
      { "id": "q5", "type": "translate", "question": "Translate: I do not drink", "options": ["のみません", "のみます", "のみない", "のみませんね"], "answer": "のみません" },
      { "id": "q6", "type": "quiz", "question": "Is 'masen' used for verbs?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q7", "type": "translate", "question": "How to say 'Not a book'?", "options": ["ほん では ありません", "ほん です", "ほん を ありません", "ほん が ありません"], "answer": "ほん では ありません" },
      { "id": "q8", "type": "typing", "question": "Build: I do not eat", "character": "たべません", "answer": "たべません" },
      { "id": "q9", "type": "quiz", "question": "Which one is for nouns negative?", "options": ["dewa arimasen", "masen", "nai", "desu"], "answer": "dewa arimasen" },
      { "id": "q10", "type": "typing", "question": "Translate: Is not Tanaka", "character": "たなか / では / ありません", "answer": "たなか では ありません" }
    ]
  },
  {
    "id": "m5-lesson-10",
    "subModule": "grammar-basics",
    "title": "Question Particle か (ka)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 10,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank (Question): あなた は がくせい です ___", "options": ["か", "ね", "よ", "は"], "answer": "か" },
      { "id": "q2", "type": "translate", "question": "How do you ask 'Is it a book?'", "options": ["ほん です か", "ほん です", "ほん を か", "ほん が か"], "answer": "ほん です か" },
      { "id": "q3", "type": "quiz", "question": "Where does 'ka' go in a question?", "options": ["At the end", "At the beginning", "After the subject", "Before the verb"], "answer": "At the end" },
      { "id": "q4", "type": "quiz", "question": "Fill blank: なに を たべます ___", "options": ["か", "ね", "よ", "ぞ"], "answer": "か" },
      { "id": "q5", "type": "translate", "question": "Translate: What do you drink?", "options": ["なに を のみます か", "なに を のみます", "なに は のみます か", "なに が のみます"], "answer": "なに を のみます か" },
      { "id": "q6", "type": "quiz", "question": "Does 'ka' act as a question mark?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q7", "type": "translate", "question": "How to ask 'Are you Tanaka?'", "options": ["たなかさん です か", "たなかさん です", "たなかさん が あります", "たなかさん は どこ"], "answer": "たなかさん です か" },
      { "id": "q8", "type": "typing", "question": "Build: Is it a cat?", "character": "ねこ / です / か", "answer": "ねこ です か" },
      { "id": "q9", "type": "quiz", "question": "Which particle is the question marker?", "options": ["か", "ね", "よ", "わ"], "answer": "か" },
      { "id": "q10", "type": "typing", "question": "Translate: Do you eat?", "character": "たべます / か", "answer": "たべます か" }
    ]
  },
  {
    "id": "m5-lesson-11",
    "subModule": "grammar-basics",
    "title": "Connectors そして & でも (soshite/demo)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 11,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank: ねこ が すき です ____ いぬ も すき", "options": ["そして", "しかし", "から", "ので"], "answer": "そして" },
      { "id": "q2", "type": "quiz", "question": "What does 'そして' mean?", "options": ["And / Also", "But", "Because", "Therefore"], "answer": "And / Also" },
      { "id": "q3", "type": "translate", "question": "Translate: And", "options": ["そして", "でも", "だから", "けれど"], "answer": "そして" },
      { "id": "q4", "type": "quiz", "question": "Fill blank: べんきょう しました ____ わすれました (Studied but forgot)", "options": ["でも", "そして", "から", "ので"], "answer": "でも" },
      { "id": "q5", "type": "quiz", "question": "What does 'でも' mean?", "options": ["But", "And", "Because", "Or"], "answer": "But" },
      { "id": "q6", "type": "translate", "question": "Translate: But", "options": ["でも", "そして", "しかし", "けれど"], "answer": "でも" },
      { "id": "q7", "type": "quiz", "question": "Which one links similar ideas?", "options": ["そして", "でも", "しかし", "けれど"], "answer": "そして" },
      { "id": "q8", "type": "quiz", "question": "Which one links contrasting ideas?", "options": ["でも", "そして", "が", "を"], "answer": "でも" },
      { "id": "q9", "type": "typing", "question": "Build: And (Connector)", "character": "そして", "answer": "そして" },
      { "id": "q10", "type": "typing", "question": "Build: But (Connector)", "character": "でも", "answer": "でも" }
    ]
  },
  {
    "id": "m5-lesson-12",
    "subModule": "grammar-basics",
    "title": "Particle も (mo)",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 30,
    "order": 12,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Fill blank (Also): わたし ___ がくせい です", "options": ["も", "は", "を", "に"], "answer": "も" },
      { "id": "q2", "type": "translate", "question": "Translate: Me too", "options": ["わたし も", "わたし は", "わたし が", "わたし の"], "answer": "わたし も" },
      { "id": "q3", "type": "quiz", "question": "What does 'も' replace when it means 'also'?", "options": ["は or が", "に or で", "を or の", "nothing"], "answer": "は or が" },
      { "id": "q4", "type": "translate", "question": "Translate: Also Tanaka", "options": ["たなかさん も", "たなかさん は", "たなかさん が", "たなかさん の"], "answer": "たなかさん も" },
      { "id": "q5", "type": "quiz", "question": "Fill blank: これ ___ ほん です (This is also a book)", "options": ["も", "は", "を", "が"], "answer": "も" },
      { "id": "q6", "type": "quiz", "question": "Does 'も' mean 'also'?", "options": ["Yes", "No"], "answer": "Yes" },
      { "id": "q7", "type": "translate", "question": "How to say 'You too'?", "options": ["あなた も", "あなた は", "あなた が", "あなた の"], "answer": "あなた も" },
      { "id": "q8", "type": "typing", "question": "Build: Me too", "character": "わたし / も", "answer": "わたし も" },
      { "id": "q9", "type": "quiz", "question": "Which particle is replaced by 'も'?", "options": ["は", "に", "で", "と"], "answer": "は" },
      { "id": "q10", "type": "typing", "question": "Translate: Also eat", "character": "たべます / も", "answer": "たべます も" }
    ]
  },
  {
    "id": "m5-lesson-13",
    "subModule": "grammar-basics",
    "title": "Sentence Building Practice",
    "category": "Grammar",
    "difficulty": 2,
    "xpReward": 40,
    "order": 13,
    "content": [
      { "id": "q1", "type": "typing", "question": "Arrange: わたし / は / パン / を / たべます", "character": "わたし / は / パン / を / たべます", "answer": "わたし は パン を たべます" },
      { "id": "q2", "type": "typing", "question": "Build: Cat eats fish", "character": "ねこ / さかな / たべる", "answer": "ねこ は さかな を たべます" },
      { "id": "q3", "type": "typing", "question": "Arrange: いぬ / が / います", "character": "いぬ / が / います", "answer": "いぬ が います" },
      { "id": "q4", "type": "typing", "question": "Build: I drink water", "character": "みず / を / のみます", "answer": "みず を のみます" },
      { "id": "q5", "type": "translate", "question": "Translate: Tanaka's book", "options": ["たなか の ほん", "たなか は ほん", "ほん の たなか", "たなか を ほん"], "answer": "たなか の ほん" },
      { "id": "q6", "type": "typing", "question": "Build: I am a student", "character": "わたし / は / がくせい / です", "answer": "わたし は がくせい です" },
      { "id": "q7", "type": "typing", "question": "Build: Subject + Verb order", "character": "いぬ / はしる", "answer": "いぬ は はしります" },
      { "id": "q8", "type": "typing", "question": "Build: Eat sushi", "character": "すし / たべる", "answer": "すし を たべます" },
      { "id": "q9", "type": "typing", "question": "Arrange: きょう / は / あつい / です", "character": "きょう / は / あつい / です", "answer": "きょう は あつい です" },
      { "id": "q10", "type": "typing", "question": "Build: My cat", "character": "わたし / の / ねこ", "answer": "わたし の ねこ" }
    ]
  },
  {
    "id": "boss-m5",
    "subModule": "grammar-basics",
    "isBoss": true,
    "title": "Module 5 Boss: Grammar Pro",
    "category": "Grammar",
    "difficulty": 3,
    "xpReward": 200,
    "order": 14,
    "timeLimit": 60,
    "content": [
      { "id": "q1", "type": "quiz", "question": "Identity topic particle in 'わたし は がくせい'", "options": ["は", "わたし", "がくせい", "です"], "answer": "は" },
      { "id": "q2", "type": "typing", "question": "Build: I eat sushi", "character": "すし / たべる", "answer": "すし を たべます" },
      { "id": "q3", "type": "translate", "question": "Translate: my book", "options": ["わたし の ほん", "わたし は ほん", "わたし が ほん", "ほん の わたし"], "answer": "わたし の ほん" },
      { "id": "q4", "type": "quiz", "question": "Fill blank: がっこう ___ いきます", "options": ["に", "を", "で", "は"], "answer": "に" },
      { "id": "q5", "type": "quiz", "question": "Identify particle: パン を たべます", "options": ["を", "パン", "たべます", "は"], "answer": "を" },
      { "id": "q6", "type": "quiz", "question": "Ask question: あなた は がくせい です ___", "options": ["か", "ね", "よ", "わ"], "answer": "か" },
      { "id": "q7", "type": "translate", "question": "Translate: There is a cat", "options": ["ねこ が います", "ねこ は います", "ねこ を います", "ねこ の います"], "answer": "ねこ が います" },
      { "id": "q8", "type": "quiz", "question": "Fill blank: わたし ___ がくせい (Also)", "options": ["も", "は", "に", "を"], "answer": "も" },
      { "id": "q9", "type": "typing", "question": "Arrange: ねこ / は / かわいい / です", "character": "ねこ / は / かわいい / です", "answer": "ねこ は かわいい です" },
      { "id": "q10", "type": "typing", "question": "Translate: Drink water", "character": "みず / のむ", "answer": "みず を のみます" }
    ]
  }
];

try {
  const content = fs.readFileSync(filePath, 'utf8');
  let lessons = JSON.parse(content);
  
  // Filter out any existing Module 5 lessons to avoid duplicates and ensure a clean replace
  lessons = lessons.filter(l => l.subModule !== 'grammar-basics');
  
  // Add the new lessons
  const updatedLessons = [...lessons, ...module5Lessons];
  
  fs.writeFileSync(filePath, JSON.stringify(updatedLessons, null, 2), 'utf8');
  console.log('Successfully updated lessons.json with ALL 10 questions per Module 5 lesson');
} catch (error) {
  console.error('Error updating lessons.json:', error);
  process.exit(1);
}
