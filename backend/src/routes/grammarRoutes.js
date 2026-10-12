const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getGrammarPoints, getGrammarById,
  updateGrammarProgress, getGrammarStats
} = require('../controllers/grammarController');

router.get('/', auth, getGrammarPoints);
router.get('/stats', auth, getGrammarStats);
router.get('/:id', auth, getGrammarById);
router.post('/progress', auth, updateGrammarProgress);

module.exports = router;
