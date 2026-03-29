const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyTokenOptional, verifyToken } = require('../middlewares/verifyToken'); 
const upload = require('../middlewares/multerUploadCover');


router.get('/:id', verifyTokenOptional, userController.getUserProfileById);

router.post('/', verifyToken, upload.single('file'), userController.updateUserProfile);

module.exports = router;