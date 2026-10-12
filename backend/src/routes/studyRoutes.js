const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  startSession, endSession, getStudyStats, getDashboardStats
} = require('../controllers/studyController');

router.get('/stats', auth, getStudyStats);
router.get('/dashboard', auth, getDashboardStats);
router.post('/start', auth, startSession);
router.put('/:id/end', auth, endSession);

module.exports = router;
