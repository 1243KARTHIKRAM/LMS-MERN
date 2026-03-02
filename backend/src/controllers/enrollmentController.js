const Enrollment = require('../models/Enrollment');
const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Enroll in a subject
// @route   POST /api/enrollments
// @access  Private
exports.enrollInSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.body;

  // Check if subjectId is provided
  if (!subjectId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a subject ID'
    });
  }

  // Check if subject exists
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found'
    });
  }

  // Check if user is already enrolled in this subject
  const existingEnrollment = await Enrollment.findOne({
    user: req.user.id,
    subject: subjectId
  });

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'You are already enrolled in this subject'
    });
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: req.user.id,
    subject: subjectId
  });

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in the subject',
    enrollment
  });
});

// @desc    Get my enrolled courses (subjects)
// @route   GET /api/enrollments/my-courses
// @access  Private
exports.getMyCourses = asyncHandler(async (req, res) => {
  // Fetch enrollments where user is enrolled and populate subject details
  const enrollments = await Enrollment.find({ user: req.user.id })
    .populate({
      path: 'subject',
      select: 'title description thumbnail category instructor isPublished',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    })
    .sort({ createdAt: -1 });

  // Extract subjects from enrollments
  const courses = enrollments.map(enrollment => enrollment.subject);

  res.json({
    success: true,
    count: courses.length,
    courses
  });
});

// @desc    Get all enrollments (for admin)
// @route   GET /api/enrollments
// @access  Private (Admin)
exports.getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate('user', 'name email')
    .populate({
      path: 'subject',
      select: 'title category instructor'
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: enrollments.length,
    enrollments
  });
});

// @desc    Check enrollment status for a subject
// @route   GET /api/enrollments/status/:subjectId
// @access  Private
exports.checkEnrollmentStatus = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const enrollment = await Enrollment.findOne({
    user: req.user.id,
    subject: subjectId
  });

  res.json({
    success: true,
    isEnrolled: !!enrollment,
    enrollment: enrollment || null
  });
});
