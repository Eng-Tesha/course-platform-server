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
 
// NEW: Complete a lesson and update progress
exports.completeLesson = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lessonId } = req.body;
 
    // Find the enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
 
    // Check if user owns this enrollment
    if (enrollment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
 
    // Check if lesson already completed (avoid duplicates)
    const lessonAlreadyCompleted = enrollment.progressedLessons.some(
      (item) => item.lesson.toString() === lessonId
    );
 
    if (!lessonAlreadyCompleted) {
      // Add lesson to completed list
      enrollment.progressedLessons.push({
        lesson: lessonId,
        completedAt: new Date()
      });
    }
 
    // Populate course to get total lessons count
    await enrollment.populate('course');
 
    // Calculate progress percentage
    const totalLessons = enrollment.course.lessons.length || 1;
    const completedCount = enrollment.progressedLessons.length;
    enrollment.progressPercentage = Math.round(
      (completedCount / totalLessons) * 100
    );
 
    // Update status based on progress
    if (enrollment.progressPercentage === 100) {
      enrollment.status = 'completed';
    } else if (enrollment.progressPercentage > 0) {
      enrollment.status = 'in-progress';
    }
 
    // Update last accessed time
    enrollment.lastAccessedAt = new Date();
 
    // Save and return
    await enrollment.save();
    res.status(200).json({
      message: 'Lesson marked as complete',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// NEW: Get detailed progress for a single enrollment
exports.getEnrollmentProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
 
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('course', 'title description lessons')
      .populate('progressedLessons.lesson', 'title duration');
 
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
 
    // Check authorization
    if (enrollment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
 
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
