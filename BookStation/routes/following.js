const express = require('express');
const router = express.Router();
const followingController = require('../controllers/interactionController/followingController');
const { verifyToken, checkIfBanned }  = require('../middlewares/verifyToken');

router.use(verifyToken, checkIfBanned);

router.get('/:authorId', followingController.followStatus);
router.post('/:authorId', followingController.follow);
router.delete('/:authorId' , followingController.unfollow);

module.exports = router;
