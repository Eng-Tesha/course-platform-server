const router = require('express').Router();
const { markLesson, getProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// All progress routes require login
router.post('/mark',        protect, markLesson);
router.get('/:courseId',    protect, getProgress);

module.exports = router;