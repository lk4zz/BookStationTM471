const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerUploadCover');

const { verifyToken, requireAuthor, optionalAuthWithBanCheck, checkIfBanned } = require('../middlewares/verifyToken');
const { validateBook, validateStatus, validateBookCover } = require('../middlewares/validateBook.js');

const bookController = require('../controllers/booksController/booksController');
const recommendationController = require('../controllers/booksController/recommendationController');

// STATIC GET ROUTES (Must come first)
router.get('/', ...optionalAuthWithBanCheck, bookController.getAllPublicBooks);
router.get('/trending', ...optionalAuthWithBanCheck, bookController.getTrendingBooks);
router.get('/high-engagement', ...optionalAuthWithBanCheck, bookController.getHighEngagementBooks);
router.get('/discover', ...optionalAuthWithBanCheck, bookController.getDiscoverBooks);
router.get('/completed', ...optionalAuthWithBanCheck, bookController.getCompletedBooks);

// DYNAMIC GET ROUTES (More specific to least specific)
router.get('/recommendations/followedAuthors', verifyToken, checkIfBanned, bookController.getFollowedAuthorsBooks) 
router.get("/recommendations/for-you", ...optionalAuthWithBanCheck, recommendationController.getForYouRecommendations);
router.get('/recommendations/:bookId', ...optionalAuthWithBanCheck, recommendationController.getRecommendationsByBookId);
router.get('/genres/:genreId', ...optionalAuthWithBanCheck, bookController.getAllBooksByGenre);
router.get('/author/:authorId', ...optionalAuthWithBanCheck, bookController.getBooksByAuthor);

// The catch-all GET route for a single book MUST be the very last GET route
router.get('/:bookId', ...optionalAuthWithBanCheck, bookController.getBookById);


// AUTHOR ROUTES    
// PROTECTED POST/PUT/DELETE ROUTES
router.post('/', ...requireAuthor, validateBook, bookController.createBook);
router.post('/:bookId/genres', ...requireAuthor, bookController.tagBook);
router.put('/:bookId', ...requireAuthor, validateBook, bookController.updateBook);
router.put('/:bookId/cover', ...requireAuthor, upload.single('file'), validateBookCover, bookController.updateBookCover);
router.put('/:bookId/status', ...requireAuthor, validateStatus, bookController.updateBookStatus);
router.put('/:bookId/launch', ...requireAuthor, bookController.launchBook);

// NEW: Author submits a flagged book for admin review
router.put('/:bookId/submit-review', ...requireAuthor, bookController.submitForReview);

router.delete('/:bookId', ...requireAuthor, bookController.deleteBook);

module.exports = router;