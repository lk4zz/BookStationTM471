const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const walletController = require('../controllers/transactionController/walletController');

router.get('/', verifyToken, walletController.getCoinBalance);
router.get('/:userId', verifyToken, walletController.getCoinBalanceByUser); // might use this for admin

// The Strict Bouncer stands here. You MUST be logged in to use the ATM
router.post('/buyCoins', verifyToken, walletController.buyCoins);

module.exports = router;