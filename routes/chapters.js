const express = require('express');
const router = express.Router();
const  { verifyToken, verifyTokenOptional } = require('../middlewares/verifyToken');
const chapterController = require('../controllers/chapterController');
const validateChapter = require('../middlewares/validateChapter.js');

// Public Routes (No jwt required)
router.get('/book/:bookId', verifyTokenOptional, chapterController.getChaptersByBook);
router.get('/:chapterId', verifyTokenOptional, chapterController.getChapterById); 

// Protected Routes 
router.post('/book/:bookId', verifyToken, validateChapter, chapterController.createChapter);
router.post('/:id/unlock', verifyToken, chapterController.unlockChapter);
router.put('/:id/publish', verifyToken, chapterController.publishChapter);
router.put('/:id', verifyToken, validateChapter, chapterController.updateChapter);
router.delete('/:id', verifyToken, chapterController.deleteChapter);

module.exports = router;