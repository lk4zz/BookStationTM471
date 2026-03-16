const walletServices = require('../services/walletServices');
const catchAsync = require('../middlewares/catchAsync');

const buyCoins = catchAsync(async (req, res) => {
    try{
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


    } catch(error){
        console.error("Error in buyCoins controller:", error);
        
        if (error.message.includes("Invalid bundle.")) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ 
            success: false, 
            message: "Something went wrong at the ATM." 
        });
    }
  });

  module.exports = {
    buyCoins
};