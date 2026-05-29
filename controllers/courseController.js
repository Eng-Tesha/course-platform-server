const Course = require('../models/Course');

// ─── GET ALL COURSES ─────────────────────────────────────
exports.getCourses = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build filter object based on query params
    let filter = { isPublished: true };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter).select('-modules');

    res.status(200).json(courses);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET SINGLE COURSE ───────────────────────────────────
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── CREATE COURSE (admin only) ──────────────────────────
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── UPDATE COURSE (admin only) ──────────────────────────
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── DELETE COURSE (admin only) ──────────────────────────
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};