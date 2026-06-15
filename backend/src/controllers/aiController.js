const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require('../lib/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateLesson = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: "Topic is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are a Japanese language expert and an educator.
      Create a comprehensive Japanese lesson about the topic: "${topic}".
      The lesson must be an object with the following structure:
      {
        "id": "generated-lesson-${Date.now()}",
        "title": "Topic: ${topic}",
        "category": "AI Generated",
        "difficulty": 1,
        "xpReward": 30,
        "order": 1,
        "content": [
          // A mix of 6-8 questions using these types:
          // 1. { "type": "quiz", "question": "...", "character": "...", "options": ["...", "..."], "answer": "...", "hint": "..." }
          // 2. { "type": "match", "pairs": [{ "character": "...", "sound": "..." }] }
          // 3. { "type": "translate", "question": "...", "options": ["...", "..."], "answer": "..." }
          // 4. { "type": "drag_drop", "question": "...", "words": ["...", "..."], "answer": ["word1", "word2"] }
        ]
      }
      Important: 
      - Return ONLY the JSON object, no Markdown code blocks or extra text.
      - Ensure 'answer' for quiz/translate is exactly one of the 'options'.
      - For 'match', provide 3-5 pairs.
      - For 'drag_drop', the 'answer' must be an array of words from the 'words' list in correct order.
      - Use authentic Japanese characters (Hiragana/Katakana/Kanji) where appropriate.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown blocks if AI ignored instructions
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let newLesson;
    try {
      newLesson = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error:", cleanedText);
      return res.status(500).json({ message: "Failed to parse AI response into valid JSON", raw: cleanedText });
    }

    // Save to SQLite via Prisma
    const lessonCount = await prisma.lesson.count();
    newLesson.order = lessonCount + 1;

    await prisma.lesson.create({
      data: {
        id: newLesson.id,
        title: newLesson.title,
        category: newLesson.category,
        difficulty: newLesson.difficulty || 1,
        xpReward: newLesson.xpReward || 30,
        order: newLesson.order,
        content: JSON.stringify(newLesson.content),
        subModule: 'ai-generated'
      }
    });

    res.status(201).json({
      message: "Lesson generated successfully!",
      lesson: newLesson
    });

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ message: "Error generating lesson with Gemini", error: error.message });
  }
};

exports.refreshLesson = async (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ message: "Lesson ID is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // We specifically want to refresh Lesson 5 with A, K, S row sentences
    const prompt = `
      You are a Japanese language expert.
      Regenerate the content for a Japanese lesson.
      The topic is: "Sentence Builder using A, K, and S row Hiragana".
      Characters allowed: 
      - A-row: あ, い, う, え, お
      - K-row: か, き, く, け, こ
      - S-row: さ, し, す, せ, そ
      
      Common words to use (but not limited to):
      あおい (blue), あかい (red), あき (autumn), あさ (morning), 
      いか (squid), いけ (pond), いえ (house), うし (cow), 
      うえ (above), かさ (umbrella), かく (to write), きく (to listen), 
      こえ (voice), さけ (sake), すし (sushi), そら (sky), 
      せかい (world), しか (deer), おかし (sweets), すき (like).

      Requirements:
      - Create EXACTLY 20 questions.
      - Use a mix of:
        1. "translate" (Question in English, options in Japanese)
        2. "typing" (Question in Japanese, answer in Romaji/English)
        3. "quiz" (Multiple choice about meanings/characters, uses "options" field)
        4. "drag_drop" (Sentence construction, MUST use "words" field for the word pool, NOT "options")
      - The 'answer' for 'drag_drop' must be an array of Japanese words/particles in order.
      - Return ONLY a JSON array of these 20 question objects.
      
      Example structures:
      { "type": "translate", "question": "Blue", "options": ["あおい", "あかい", "あさ", "いか"], "answer": "あおい" }
      { "type": "drag_drop", "question": "Red house", "words": ["あかい", "いえ", "いか", "さけ"], "answer": ["あかい", "いえ"] }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let newContent;
    try {
      newContent = JSON.parse(cleanedText);
    } catch (e) {
      return res.status(500).json({ message: "Failed to parse AI response into valid JSON", raw: cleanedText });
    }

    if (!Array.isArray(newContent)) {
      return res.status(500).json({ message: "AI response is not an array" });
    }

    // Update in SQLite via Prisma
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        content: JSON.stringify(newContent)
      }
    });

    res.json({
      message: "Lesson refreshed successfully!",
      content: newContent
    });

  } catch (error) {
    console.error("Gemini Refresh Error:", error);
    res.status(500).json({ message: "Error refreshing lesson", error: error.message });
  }
};
