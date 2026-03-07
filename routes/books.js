const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const validateBook = require('../middlewares/validateBook.js');
const BookController = require('../controllers/bookController');

router.post('/', verifyToken, validateBook, BookController.createBook);

module.exports = router;