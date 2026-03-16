const express = require('express');
const { getProfile, deductHeart, recordActivity } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', auth, getProfile);
router.post('/deduct-heart', auth, deductHeart);
router.post('/activity', auth, recordActivity);

module.exports = router;
