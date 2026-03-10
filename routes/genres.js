const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const verifyToken  = require('../middlewares/verifyToken');

// Public route: Anyone can read the menu! No Bouncer needed.
router.get('/', genreController.getAllGenres);

// Protected route: You must have a VIP Wristband to add a new category to the restaurant.
router.post('/', verifyToken, genreController.createGenre);

module.exports = router;