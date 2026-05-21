const express = require('express');
const router = express.Router();
const { verifyToken, requireAuthor, optionalAuthWithBanCheck, checkIfBanned } = require('../middlewares/verifyToken');
const chapterController = require('../controllers/chapterController/chapterController');
const validateChapter = require('../middlewares/validateChapter.js');

// Public Routes (No jwt required)
router.get('/book/:bookId', ...optionalAuthWithBanCheck, chapterController.getChaptersByBook);
router.get('/:chapterId', ...optionalAuthWithBanCheck, chapterController.getChapterById); 


//AUTHOR ROUTES
// Protected Routes 
router.post('/book/:bookId', ...requireAuthor, validateChapter, chapterController.createChapter);
router.post('/:id/unlock', verifyToken, checkIfBanned, chapterController.unlockChapter);
router.put('/:id/publish', ...requireAuthor, chapterController.publishChapter);
router.put('/:id', verifyToken, checkIfBanned, validateChapter, chapterController.updateChapter);
router.delete('/:id', ...requireAuthor, chapterController.deleteChapter);

module.exports = router;