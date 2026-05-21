const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController/adminController'); 
const { requireAdmin } = require('../middlewares/verifyToken');

router.use(...requireAdmin);

// USER MANAGEMENT
router.get('/radar/:userId', adminController.getUserRadar);
router.get('/users', adminController.getAllUsers);
router.put('/users', adminController.changeUserRole);
router.put('/users/:userId', adminController.banUser);

// BOOK MANAGEMENT & MODERATION
router.get('/books', adminController.getAdminBooks);

// NEW: Get the list of books waiting for admin approval
router.get('/books/review-queue', adminController.getReviewQueue);

// NEW: Flag a book and tell the author why
router.put('/books/:bookId/flag', adminController.flagBookAndNotify);

// NEW: Approve the author's fixes and restore the book
router.put('/books/:bookId/unflag', adminController.unflagBook);

// NEW: Send feedback again (UNDER_REVIEW -> AWAITING_AUTHOR)
router.put('/books/:bookId/send-feedback', adminController.sendFeedbackAgain);

// Existing delete route
router.delete('/books/:bookId', adminController.deleteBook);

module.exports = router;