const Course = require('../models/Course');
const User = require('../models/User');
const VideoProgress = require('../models/VideoProgress');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    
    let query = { isPublished: true };

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .select('-lessons');

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar email')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
exports.createCourse = async (req, res) => {
  try {
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    // Add course to user's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor, Admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor, Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    // Remove course from user's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { createdCourses: course._id }
    });

    // Remove course from enrolled students
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in the course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });

    res.json({
      success: true,
      courses: user.enrolledCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/my-created-courses
// @access  Private (Instructor, Admin)
exports.getMyCreatedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'name avatar')
      .populate('enrolledStudents', 'name email');

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add section to course
// @route   POST /api/courses/:id/sections
// @access  Private (Instructor, Admin)
exports.addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const { title, description } = req.body;
    const orderIndex = course.sections.length;

    course.sections.push({
      title,
      description,
      orderIndex,
      videos: []
    });

    await course.save();

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add video to course section
// @route   POST /api/courses/:id/sections/:sectionId/videos
// @access  Private (Instructor, Admin)
exports.addVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const { title, description, videoUrl, duration, thumbnail, isFree } = req.body;
    const orderIndex = section.videos.length;

    section.videos.push({
      title,
      description,
      videoUrl,
      duration: duration || 0,
      thumbnail,
      orderIndex,
      isFree: isFree || false
    });

    await course.save();

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update video in course section
// @route   PUT /api/courses/:id/sections/:sectionId/videos/:videoId
// @access  Private (Instructor, Admin)
exports.updateVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const video = section.videos.id(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const { title, description, videoUrl, duration, thumbnail, isFree } = req.body;

    video.title = title || video.title;
    video.description = description || video.description;
    video.videoUrl = videoUrl || video.videoUrl;
    video.duration = duration !== undefined ? duration : video.duration;
    video.thumbnail = thumbnail || video.thumbnail;
    video.isFree = isFree !== undefined ? isFree : video.isFree;

    await course.save();

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete video from course section
// @route   DELETE /api/courses/:id/sections/:sectionId/videos/:videoId
// @access  Private (Instructor, Admin)
exports.deleteVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const section = course.sections.id(req.params.sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    section.videos = section.videos.filter(
      v => v._id.toString() !== req.params.videoId
    );

    // Re-order remaining videos
    section.videos.forEach((video, index) => {
      video.orderIndex = index;
    });

    await course.save();

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete section from course
// @route   DELETE /api/courses/:id/sections/:sectionId
// @access  Private (Instructor, Admin)
exports.deleteSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course.sections = course.sections.filter(
      s => s._id.toString() !== req.params.sectionId
    );

    // Re-order remaining sections
    course.sections.forEach((section, index) => {
      section.orderIndex = index;
    });

    await course.save();

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get video progress with resume time
// @route   GET /api/courses/:id/sections/:sectionId/videos/:videoId/progress
// @access  Private
exports.getVideoProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    const progress = await VideoProgress.findOne({ user: userId, video: videoId });

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          watchedTime: 0,
          completed: false
        }
      });
    }

    res.json({
      success: true,
      progress: {
        watchedTime: progress.watchedTime,
        completed: progress.completed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
