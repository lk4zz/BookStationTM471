const express = require('express');
const router = express.Router();
const genreController = require('../controllers/adminController/genreController');
const { verifyToken }  = require('../middlewares/verifyToken');

// Public route
router.get('/', genreController.getAllGenres);

// Protected route: for admins
router.post('/', verifyToken, genreController.createGenre);

module.exports = router;