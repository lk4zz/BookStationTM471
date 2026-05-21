const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin, checkIfBanned } = require('../middlewares/verifyToken');
const reportController = require('../controllers/booksController/reportController');


router.post('/:bookId/report', verifyToken, checkIfBanned, reportController.submitReport);
router.get('/:bookId/report', ...requireAdmin, reportController.getBookReportDetails);


module.exports = router;