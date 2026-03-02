const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses,
  getMyCreatedCourses,
  addSection,
  addVideo,
  updateVideo,
  deleteVideo,
  deleteSection,
  getVideoProgress
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/my-courses').get(protect, getMyCourses);
router.route('/my-created-courses').get(protect, authorize('instructor', 'admin'), getMyCreatedCourses);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.route('/:id/enroll').post(protect, enrollCourse);

// Section and Video management routes
router.route('/:id/sections')
  .post(protect, authorize('instructor', 'admin'), addSection);

router.route('/:id/sections/:sectionId')
  .delete(protect, authorize('instructor', 'admin'), deleteSection);

router.route('/:id/sections/:sectionId/videos')
  .post(protect, authorize('instructor', 'admin'), addVideo);

router.route('/:id/sections/:sectionId/videos/:videoId')
  .put(protect, authorize('instructor', 'admin'), updateVideo)
  .delete(protect, authorize('instructor', 'admin'), deleteVideo);

router.route('/:id/sections/:sectionId/videos/:videoId/progress')
  .get(protect, getVideoProgress);

module.exports = router;
