const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const walletController = require('../controllers/transactionController/walletController');

router.get('/', verifyToken, walletController.getCoinBalance);
router.get('/:userId', verifyToken, walletController.getCoinBalanceByUser); // might use this for admin

router.post('/buyCoins', verifyToken, walletController.buyCoins);

router.post('/buy-ai-pass', verifyToken, walletController.purchaseAIPass);

module.exports = router;