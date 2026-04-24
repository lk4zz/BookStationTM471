const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const ratingController = require('../controllers/interactionController/ratingController');

router.post('/:bookId', verifyToken, ratingController.addOrUpdateRating);
router.get('/:bookId', ratingController.getRatingStats);
router.get('/:bookId/me', verifyToken, ratingController.getUserRating);
router.delete('/:bookId', verifyToken, ratingController.deleteRating);

module.exports = router;
