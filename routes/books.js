const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const validateBook = require('../middlewares/validateBook.js');

const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.post('/', verifyToken, validateBook, bookController.createBook);
router.get('/:id', bookController.getBookById);
router.get('/author/:authorId', bookController.getBooksByAuthor);
router.put('/:id', verifyToken, validateBook, bookController.updateBook);
router.delete('/:id', verifyToken, bookController.deleteBook);

module.exports = router;