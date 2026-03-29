const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const progressController = require('../controllers/progressController');

// all progress routes are protected (users must be logged in to save progress)
router.post('/:bookId/:chapterId', verifyToken, progressController.updateProgress);
router.get('/book/:bookId', verifyToken, progressController.getProgress);   

module.exports = router;