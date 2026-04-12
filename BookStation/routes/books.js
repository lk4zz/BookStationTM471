const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUploadCover');

const { verifyToken, verifyTokenOptional } = require('../middlewares/verifyToken');
const { validateBook, validateStatus, validateBookCover } = require('../middlewares/validateBook.js');

const bookGenreController = require('../controllers/bookGenreController');
const bookController = require('../controllers/bookController');
const recommendationController = require('../controllers/recommendationController');

// STATIC GET ROUTES (Must come first)
router.get('/', verifyTokenOptional, bookController.getAllPublicBooks);
router.get('/trending', verifyTokenOptional, bookController.getTrendingBooks);

// DYNAMIC GET ROUTES (More specific to least specific)
router.get("/recommendations/for-you", verifyTokenOptional,
    recommendationController.getForYouRecommendations);
router.get('/genres/:genreId', verifyTokenOptional, bookController.getAllBooksByGenre);
router.get('/author/:authorId', verifyTokenOptional, bookController.getBooksByAuthor);


// The catch-all GET route for a single book MUST be the very last GET route
router.get('/:bookId', verifyTokenOptional, bookController.getBookById);

// PROTECTED POST/PUT/DELETE ROUTES
router.post('/', verifyToken, validateBook, bookController.createBook);
router.post('/:bookId/genres', verifyToken, bookGenreController.tagBook);
router.put('/:bookId', verifyToken, validateBook, bookController.updateBook);
router.put('/:bookId/cover', verifyToken, upload.single('file'), validateBookCover, bookController.updateBookCover);
router.put('/:bookId/status', verifyToken, validateStatus, bookController.updateBookStatus);
router.put('/:bookId/launch', verifyToken, bookController.launchBook);
router.delete('/:bookId', verifyToken, bookController.deleteBook);

module.exports = router;