const express = require('express');
const router = express.Router();
const uploadDocs = require('../middlewares/multerUploadCover'); // Your new multer config
const { verifyToken, requireAdmin, checkIfBanned } = require('../middlewares/verifyToken');
const applicationController = require('../controllers/applicationController');

const ADMIN = 3; 

// User applies to be an author
router.post('/apply', verifyToken, checkIfBanned, uploadDocs.single('document'), applicationController.submitApplication);

// Admin gets all pending applications
router.get('/pending', ...requireAdmin, applicationController.getPendingApplications);

router.get('/status', verifyToken, checkIfBanned, applicationController.getApplicationStatus);

// Admin approves or rejects the application
router.put('/:id/review', ...requireAdmin, applicationController.reviewApplication);

module.exports = router;