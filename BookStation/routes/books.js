const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUploadCover');

const { verifyToken, verifyTokenOptional, verifyAuthor } = require('../middlewares/verifyToken');
const { validateBook, validateStatus, validateBookCover } = require('../middlewares/validateBook.js');

const bookGenreController = require('../controllers/booksController/bookGenreController');
const bookController = require('../controllers/booksController/booksController');
const recommendationController = require('../controllers/booksController/recommendationController');

// STATIC GET ROUTES (Must come first)
router.get('/', verifyTokenOptional, bookController.getAllPublicBooks);
router.get('/trending', verifyTokenOptional, bookController.getTrendingBooks);
router.get('/high-engagement', verifyTokenOptional, bookController.getHighEngagementBooks);

// DYNAMIC GET ROUTES (More specific to least specific)
router.get('/recommendations/followedAuthors', verifyToken, bookController.getFollowedAuthorsBooks) 
router.get("/recommendations/for-you", verifyTokenOptional,
    recommendationController.getForYouRecommendations);
router.get('/genres/:genreId', verifyTokenOptional, bookController.getAllBooksByGenre);
router.get('/author/:authorId', verifyTokenOptional, bookController.getBooksByAuthor);


// The catch-all GET route for a single book MUST be the very last GET route
router.get('/:bookId', verifyTokenOptional, bookController.getBookById);



// AUTHOR ROUTES    
// PROTECTED POST/PUT/DELETE ROUTES
router.post('/', verifyToken, verifyAuthor, validateBook, bookController.createBook);
router.post('/:bookId/genres', verifyAuthor, verifyToken, bookGenreController.tagBook);
router.put('/:bookId', verifyToken, verifyAuthor, validateBook, bookController.updateBook);
router.put('/:bookId/cover', verifyToken, verifyAuthor, upload.single('file'), validateBookCover, bookController.updateBookCover);
router.put('/:bookId/status', verifyToken, verifyAuthor, validateStatus, bookController.updateBookStatus);
router.put('/:bookId/launch', verifyToken, verifyAuthor, bookController.launchBook);
router.delete('/:bookId', verifyToken, verifyAuthor, bookController.deleteBook);

module.exports = router;