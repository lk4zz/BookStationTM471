const express = require('express');
const router = express.Router();
const { verifyTokenOptional } = require('../middlewares/verifyToken');
const viewsController = require('../controllers/viewsController');

router.post('/:bookId', verifyTokenOptional, viewsController.addView);
router.get('/:bookId', verifyTokenOptional, viewsController.getViews);

module.exports = router;