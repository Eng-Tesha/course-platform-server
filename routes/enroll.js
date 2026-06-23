const router = require('express').Router();
const {
  createOrder,
  verifyPayment,
  getMyEnrollments,
  completeLesson,
  getEnrollmentProgress
} = require('../controllers/enrollController');
const { protect } = require('../middleware/authMiddleware');

// All enrollment routes require login
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-enrollments', protect, getMyEnrollments);

// NEW: Progress tracking routes
router.post('/:enrollmentId/complete-lesson', protect, completeLesson);
router.get('/:enrollmentId', protect, getEnrollmentProgress);

module.exports = router;
