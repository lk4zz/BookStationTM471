const express = require('express');
const router = express.Router();
const { verifyToken, checkIfBanned } = require('../middlewares/verifyToken');
const progressController = require('../controllers/interactionController/progressController');

router.use(verifyToken, checkIfBanned);

// all progress routes are protected (users must be logged in to save progress)
router.post('/:bookId/:chapterId', progressController.updateProgress);
router.get('/book/:bookId', progressController.getProgress);   

module.exports = router;
