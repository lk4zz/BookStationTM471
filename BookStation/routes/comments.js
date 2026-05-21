const express = require('express');
const router = express.Router();
const commentController = require('../controllers/interactionController/commentController');
const { verifyToken, optionalAuthWithBanCheck, checkIfBanned }  = require('../middlewares/verifyToken');

router.get('/:bookId', ...optionalAuthWithBanCheck, commentController.getCommentsByBook);
router.post('/:bookId', verifyToken, checkIfBanned, commentController.commentOnBook);
router.delete('/:commentId', verifyToken, checkIfBanned, commentController.deleteComment);


module.exports = router;