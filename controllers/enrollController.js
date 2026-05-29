const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const Course = require('../models/Course');

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Payment coming soon', courseId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    res.status(200).json({ message: 'Payment coming soon' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user.id,
      paymentStatus: 'completed'
    }).populate('course', 'title description thumbnail instructor');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
