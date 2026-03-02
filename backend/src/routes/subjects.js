const express = require('express');
const router = express.Router();
const { getAllSubjects, getSubjectById } = require('../controllers/subjectController');

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);

module.exports = router;
