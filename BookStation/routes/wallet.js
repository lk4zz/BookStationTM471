const express = require('express');
const router = express.Router();
const { verifyToken, checkIfBanned } = require('../middlewares/verifyToken');
const walletController = require('../controllers/transactionController/walletController');

router.use(verifyToken, checkIfBanned);

router.get('/', walletController.getCoinBalance);
router.get('/:userId', walletController.getCoinBalanceByUser); // might use this for admin

router.post('/buyCoins', walletController.buyCoins);

router.post('/buy-ai-pass', walletController.purchaseAIPass);

module.exports = router;
