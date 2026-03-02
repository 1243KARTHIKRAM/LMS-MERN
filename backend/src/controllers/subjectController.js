const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
exports.getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().populate('instructor', 'name email');
  
  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects
  });
});

// @desc    Get single subject with sections and videos
// @route   GET /api/subjects/:id
// @access  Public
exports.getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate('instructor', 'name email');
  
  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found'
    });
  }

  // Populate sections and videos within sections
  const subjectWithDetails = await Subject.findById(req.params.id)
    .populate({
      path: 'sections',
      options: { sort: { orderIndex: 1 } },
      populate: {
        path: 'videos',
        options: { sort: { orderIndex: 1 } }
      }
    });

  res.status(200).json({
    success: true,
    data: subjectWithDetails
  });
});
