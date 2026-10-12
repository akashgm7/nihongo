const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  generateDailyTasks, getTodayTasks,
  updateDailyTask, incrementDailyTask
} = require('../controllers/dailyTaskController');

router.get('/today', auth, getTodayTasks);
router.post('/generate', auth, generateDailyTasks);
router.put('/:id', auth, updateDailyTask);
router.post('/increment', auth, incrementDailyTask);

module.exports = router;
