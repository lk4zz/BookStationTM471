const express = require('express');
const router = express.Router();
const uploadDocs = require('../middlewares/multerUploadCover'); // Your new multer config
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');
const applicationController = require('../controllers/applicationController');

const ADMIN = 3; 

// User applies to be an author
router.post('/apply', verifyToken, uploadDocs.single('document'), applicationController.submitApplication);

// Admin gets all pending applications
router.get('/pending', verifyToken, verifyAdmin, applicationController.getPendingApplications);

router.get('/status', verifyToken, applicationController.getApplicationStatus);

// Admin approves or rejects the application
router.put('/:id/review', verifyToken, verifyAdmin, applicationController.reviewApplication);

module.exports = router;