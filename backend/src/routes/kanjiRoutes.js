const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getKanji, getKanjiById, getKanjiByCharacter,
  updateKanjiProgress, getKanjiStats
} = require('../controllers/kanjiController');

router.get('/', auth, getKanji);
router.get('/stats', auth, getKanjiStats);
router.get('/char/:character', auth, getKanjiByCharacter);
router.get('/:id', auth, getKanjiById);
router.post('/progress', auth, updateKanjiProgress);

module.exports = router;
