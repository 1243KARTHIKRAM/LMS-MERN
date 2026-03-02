const VideoProgress = require('../models/VideoProgress');
const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Save video progress
// @route   POST /api/video-progress
// @access  Private (logged-in user)
exports.saveProgress = asyncHandler(async (req, res) => {
  const { videoId, watchedTime, duration } = req.body;
  const userId = req.user.id;

  if (!videoId || watchedTime === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide videoId and watchedTime'
    });
  }

  // Calculate completion percentage (90% threshold for completion)
  let isCompleted = false;

  if (duration && duration > 0) {
    isCompleted = watchedTime >= (duration * 0.9);
  }

  // Check if progress already exists
  let progress = await VideoProgress.findOne({ user: userId, video: videoId });

  if (progress) {
    // Update existing progress only if new time is greater
    if (watchedTime > progress.watchedTime) {
      progress.watchedTime = watchedTime;
      progress.completed = isCompleted || progress.completed;
      await progress.save();
    }
  } else {
    // Create new progress
    progress = await VideoProgress.create({
      user: userId,
      video: videoId,
      watchedTime,
      completed: isCompleted
    });
  }

  res.status(200).json({
    success: true,
    progress: {
      watchedTime: progress.watchedTime,
      completed: progress.completed
    }
  });
});

// @desc    Get video progress for current user
// @route   GET /api/video-progress/:videoId
// @access  Private (logged-in user)
exports.getProgress = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  if (!videoId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide videoId'
    });
  }

  const progress = await VideoProgress.findOne({ user: userId, video: videoId });

  if (!progress) {
    return res.status(200).json({
      success: true,
      progress: {
        watchedTime: 0,
        completed: false
      }
    });
  }

  res.status(200).json({
    success: true,
    progress: {
      watchedTime: progress.watchedTime,
      completed: progress.completed
    }
  });
});

// @desc    Get all progress for a course
// @route   GET /api/video-progress/course/:courseId
// @access  Private (logged-in user)
exports.getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const Course = require('../models/Course');
  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Collect all video IDs from all sections
  const videoIds = [];
  course.sections.forEach(section => {
    section.videos.forEach(video => {
      videoIds.push(video._id);
    });
  });

  // Get progress for all videos
  const progressRecords = await VideoProgress.find({
    user: userId,
    video: { $in: videoIds }
  });

  const progressMap = {};
  progressRecords.forEach(progress => {
    progressMap[progress.video.toString()] = {
      watchedTime: progress.watchedTime,
      completed: progress.completed
    };
  });

  res.status(200).json({
    success: true,
    progress: progressMap
  });
});
