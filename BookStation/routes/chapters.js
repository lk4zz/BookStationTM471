const express = require('express');
const router = express.Router();
const  { verifyToken, verifyTokenOptional, verifyAuthor } = require('../middlewares/verifyToken');
const chapterController = require('../controllers/chapterController/chapterController');
const validateChapter = require('../middlewares/validateChapter.js');

// Public Routes (No jwt required)
router.get('/book/:bookId', verifyTokenOptional, chapterController.getChaptersByBook);
router.get('/:chapterId', verifyTokenOptional, chapterController.getChapterById); 


//AUTHOR ROUTES
// Protected Routes 
router.post('/book/:bookId', verifyToken, verifyAuthor, validateChapter, chapterController.createChapter);
router.post('/:id/unlock', verifyToken, chapterController.unlockChapter);
router.put('/:id/publish', verifyToken, verifyAuthor, chapterController.publishChapter);
router.put('/:id', verifyToken, validateChapter, chapterController.updateChapter);
router.delete('/:id', verifyToken, verifyAuthor, chapterController.deleteChapter);

module.exports = router;