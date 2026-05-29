const router = require('express').Router();
const {
  createOrder,
  verifyPayment,
  getMyEnrollments
} = require('../controllers/enrollController');
const { protect } = require('../middleware/authMiddleware');

// All enrollment routes require login
router.post('/create-order',    protect, createOrder);
router.post('/verify-payment',  protect, verifyPayment);
router.get('/my-enrollments',   protect, getMyEnrollments);

module.exports = router;