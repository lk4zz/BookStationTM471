const express = require('express');
const router = express.Router();
const followingController = require('../controllers/interactionController/followingController');
const { verifyToken }  = require('../middlewares/verifyToken');

router.get('/:authorId', verifyToken, followingController.followStatus);
router.post('/:authorId', verifyToken, followingController.follow);
router.delete('/:authorId' , verifyToken, followingController.unfollow);

module.exports = router;