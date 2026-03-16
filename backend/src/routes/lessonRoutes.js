const express = require('express');
const { getLessons, getLessonById, completeLesson, deleteLesson } = require('../controllers/lessonController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getLessons);
router.get('/:id', auth, getLessonById);
router.post('/:id/complete', auth, completeLesson);
router.delete('/:id', auth, deleteLesson);

module.exports = router;
