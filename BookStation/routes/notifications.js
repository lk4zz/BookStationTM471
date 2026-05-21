const express = require('express');
const notificationsController = require('../controllers/notificationsController');
const { verifyToken, checkIfBanned }  = require('../middlewares/verifyToken');

const router = express.Router();

router.use(verifyToken, checkIfBanned); 

router.get('/', notificationsController.getUserNotifications);
router.patch('/:id/read', notificationsController.markNotificationAsRead);

module.exports = router;