const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const walletController = require('../controllers/walletController');

// The Strict Bouncer stands here. You MUST be logged in to use the ATM
router.post('/buyCoins', verifyToken, walletController.buyCoins);

module.exports = router;