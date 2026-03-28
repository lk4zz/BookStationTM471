const walletServices = require('../services/walletServices');
const catchAsync = require('../middlewares/catchAsync');

const buyCoins = catchAsync(async (req, res) => {
    const currentUserId = req.user.userId;
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({
            success: false,
            message: "Please provide an amount of coins to buy."
        });
    }

    const updatedWallet = await walletServices.buyCoins(currentUserId, amount);
    res.status(200).json({
        success: true,
        message: `Successfully added ${amount} coins to your wallet.`,
        data: updatedWallet
    });

});


const getCoinBalance = catchAsync(async (req, res) => {
    const currentUserId = req.user? req.user.userId : null;
    const walletBalance = await walletServices.getCoinBalance(currentUserId);
    res.status(200).json({
        success: true,
        data: walletBalance
    })
}) 


const getCoinBalanceByUser = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const walletBalance = await walletServices.getCoinBalanceByUser(userId);
    res.status(200).json({
        success: true,
        data: walletBalance
    })
})

module.exports = {
    buyCoins,
    getCoinBalance,
    getCoinBalanceByUser,
};