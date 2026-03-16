const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

// Only authenticated users can trigger generation
router.post('/generate', auth, aiController.generateLesson);
router.post('/refresh', auth, aiController.refreshLesson);

module.exports = router;
