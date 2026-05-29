const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String
  }
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String
  },
  instructor: {
    type: String,
    required: true
  },
  modules: [moduleSchema],
  category: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);