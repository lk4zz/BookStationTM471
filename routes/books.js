const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const validateBook = require('../middlewares/validateBook.js');
const bookGenreController = require('../controllers/bookGenreController');
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.post('/', verifyToken, validateBook, bookController.createBook);
router.get('/:id', bookController.getBookById);
router.get('/author/:authorId', bookController.getBooksByAuthor);
router.put('/:id', verifyToken, validateBook, bookController.updateBook);
router.delete('/:id', verifyToken, bookController.deleteBook);
router.post('/:bookId/genres', verifyToken, bookGenreController.tagBook);

module.exports = router;