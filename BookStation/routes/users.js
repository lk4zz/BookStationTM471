const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController/userController');
const { verifyToken, optionalAuthWithBanCheck, checkIfBanned } = require('../middlewares/verifyToken'); 
const upload = require('../middlewares/multerUploadCover');

router.get("/currentUser", verifyToken, checkIfBanned, userController.getCurrentUser);

router.get('/search', ...optionalAuthWithBanCheck, userController.searchUsers);

router.get('/', ...optionalAuthWithBanCheck, userController.getAllUsers);

router.get('/:id', ...optionalAuthWithBanCheck, userController.getUserProfileById);

router.post('/', verifyToken, checkIfBanned, upload.single('file'), userController.updateUserProfile);


module.exports = router;