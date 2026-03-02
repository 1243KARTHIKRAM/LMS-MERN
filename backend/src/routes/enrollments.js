const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  enrollInSubject,
  getMyCourses,
  getAllEnrollments,
  checkEnrollmentStatus
} = require('../controllers/enrollmentController');

// @route   POST /api/enrollments
// @desc    Enroll in a subject
// @access  Private
router.post('/', protect, enrollInSubject);

// @route   GET /api/enrollments/my-courses
// @desc    Get user's enrolled courses (subjects)
// @access  Private
router.get('/my-courses', protect, getMyCourses);

// @route   GET /api/enrollments/status/:subjectId
// @desc    Check if user is enrolled in a subject
// @access  Private
router.get('/status/:subjectId', protect, checkEnrollmentStatus);

// @route   GET /api/enrollments
// @desc    Get all enrollments (admin)
// @access  Private (Admin)
router.get('/', protect, getAllEnrollments);

module.exports = router;
