const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const chapterController = require('../controllers/chapterController');

// Public Routes (No jwt required)
router.get('/book/:bookId', chapterController.getChaptersByBook); 
router.get('/:id', chapterController.getChapterById); 

// Protected Routes 
router.post('/', verifyToken, chapterController.createChapter);
router.put('/:id', verifyToken, chapterController.updateChapter);
router.delete('/:id', verifyToken, chapterController.deleteChapter);

module.exports = router;