const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController/adminController'); 
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');

router.use(verifyToken);
router.use(verifyAdmin);


router.get('/radar/:userId', adminController.getUserRadar);
router.get('/users', adminController.getAllUsers);

router.delete('/users/:userId', adminController.banUser);

router.delete('/books/:bookId', adminController.deleteBook);

module.exports = router;