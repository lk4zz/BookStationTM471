const express = require('express');
const router = express.Router();
const { verifyToken, optionalAuthWithBanCheck, checkIfBanned } = require('../middlewares/verifyToken');
const viewsController = require('../controllers/interactionController/viewsController');

router.post('/:bookId', verifyToken, checkIfBanned, viewsController.addView);
router.get('/:bookId', ...optionalAuthWithBanCheck, viewsController.getViews);
router.get('/books/mostviewed', ...optionalAuthWithBanCheck, viewsController.getMostViewedBook);

module.exports = router;