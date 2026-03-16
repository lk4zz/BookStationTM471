const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { verifyToken }  = require('../middlewares/verifyToken');

router.post('/books/:bookId', verifyToken, libraryController.saveBook);
router.get('/books', verifyToken, libraryController.getlibraryBooks);
router.delete('/books/:bookId', verifyToken, libraryController.removeBookFromLibrary);


module.exports = router;