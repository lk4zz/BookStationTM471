const express = require('express');
const router = express.Router();
const commentController = require('../controllers/interactionController/commentController');
const { verifyToken, verifyTokenOptional }  = require('../middlewares/verifyToken');

router.get('/:bookId', verifyTokenOptional, commentController.getCommentsByBook);
router.post('/:bookId', verifyToken, commentController.commentOnBook);
router.delete('/:commentId', verifyToken, commentController.deleteComment);


module.exports = router;