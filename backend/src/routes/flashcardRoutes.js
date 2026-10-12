const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getReviewQueue, reviewFlashcard, createFlashcard,
  autoGenerateFlashcards, deleteFlashcard, getFlashcardStats
} = require('../controllers/flashcardController');

router.get('/queue', auth, getReviewQueue);
router.get('/stats', auth, getFlashcardStats);
router.post('/review', auth, reviewFlashcard);
router.post('/create', auth, createFlashcard);
router.post('/auto-generate', auth, autoGenerateFlashcards);
router.delete('/:id', auth, deleteFlashcard);

module.exports = router;
