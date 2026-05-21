const express = require('express');
const router = express.Router();
const { verifyToken, checkIfBanned } = require('../middlewares/verifyToken');
const ratingController = require('../controllers/interactionController/ratingController');

router.post('/stats', ratingController.getBatchRatingStats);
router.post('/:bookId', verifyToken, checkIfBanned, ratingController.addOrUpdateRating);
router.get('/:bookId', ratingController.getRatingStats);
router.get('/:bookId/me', verifyToken, checkIfBanned, ratingController.getUserRating);
router.delete('/:bookId', verifyToken, checkIfBanned, ratingController.deleteRating);

module.exports = router;
