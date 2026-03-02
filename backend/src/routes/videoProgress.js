const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveProgress,
  getProgress,
  getCourseProgress
} = require('../controllers/videoProgressController');

// Route: /api/video-progress

// POST /api/video-progress - Save video progress
router.post('/', protect, saveProgress);

// GET /api/video-progress/:videoId - Get video progress
router.get('/:videoId', protect, getProgress);

// GET /api/video-progress/course/:courseId - Get all progress for a course
router.get('/course/:courseId', protect, getCourseProgress);

module.exports = router;
