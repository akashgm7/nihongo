const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getVocabulary, getVocabById, getVocabByLesson,
  updateVocabProgress, batchUpdateVocabProgress, getVocabStats
} = require('../controllers/vocabController');

router.get('/', auth, getVocabulary);
router.get('/stats', auth, getVocabStats);
router.get('/lesson/:lessonNum', auth, getVocabByLesson);
router.get('/:id', auth, getVocabById);
router.post('/progress', auth, updateVocabProgress);
router.post('/progress/batch', auth, batchUpdateVocabProgress);

module.exports = router;
