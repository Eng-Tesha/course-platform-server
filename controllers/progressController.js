const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// ─── MARK LESSON COMPLETE ────────────────────────────────
exports.markLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    // 1. Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'completed'
    });
    if (!enrollment) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // 2. Get total number of lessons in the course
    const course = await Course.findById(courseId);
    const totalLessons = course.modules.reduce((total, module) => {
      return total + module.lessons.length;
    }, 0);

    // 3. Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        course: courseId,
        completedLessons: []
      });
    }

    // 4. Add lesson if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // 5. Calculate progress percentage
    progress.progressPercent = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    await progress.save();

    res.status(200).json({
      completedLessons: progress.completedLessons,
      progressPercent: progress.progressPercent
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET PROGRESS ────────────────────────────────────────
exports.getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId
    });

    if (!progress) {
      return res.status(200).json({
        completedLessons: [],
        progressPercent: 0
      });
    }

    res.status(200).json({
      completedLessons: progress.completedLessons,
      progressPercent: progress.progressPercent
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};