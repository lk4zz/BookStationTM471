const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { verifyToken, checkIfBanned }  = require('../middlewares/verifyToken');

router.use(verifyToken, checkIfBanned);

router.post('/books/:bookId', libraryController.saveBook);
router.get('/books', libraryController.getlibraryBooks);
router.delete('/books/:bookId', libraryController.removeBookFromLibrary);


module.exports = router;
