const express = require('express');
const router = express.Router();
const followingController = require('../controllers/followingController');
const { verifyToken }  = require('../middlewares/verifyToken');

router.post('/:authorId', verifyToken, followingController.follow);
router.delete('/:followedId' , verifyToken, followingController.unfollow);

module.exports = router;