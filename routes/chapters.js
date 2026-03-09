const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const chapterController = require('../controllers/chapterController');
const validateChapter = require('../middlewares/validateChapter.js');

// Public Routes (No jwt required)
router.get('/book/:bookId', chapterController.getChaptersByBook); 
router.get('/:id', chapterController.getChapterById); 

// Protected Routes 
router.post('/', verifyToken, validateChapter, chapterController.createChapter);
router.put('/:id', verifyToken, validateChapter, chapterController.updateChapter);
router.delete('/:id', verifyToken, chapterController.deleteChapter);

module.exports = router;