const prisma = require('../../db');
const ForbiddenError = require('../../errors/ForbiddenError');
const NotFoundError = require('../../errors/NotFoundError');
const BadRequestError = require('../../errors/BadRequestError');

const VALID_COIN_BUNDLES = [100, 500, 1200, 2500, 5000];

const buyCoins = async (userId, amount) => {
    const parsedAmount = parseInt(amount);

    if (!VALID_COIN_BUNDLES.includes(parsedAmount)) {
        throw new ForbiddenError(`Invalid bundle. You can only buy coins in bundles of: ${VALID_COIN_BUNDLES.join(', ')}`);
    };

    const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
            coinBalance: {
                increment: parsedAmount // Prisma does the math
            }
        },
        select: {
            id: true,
            name: true,
            coinBalance: true // return safe data (no passwords)
        }
    });

    return updatedUser;
}

const getCoinBalance = async (currentUserId) => {
    if (!currentUserId) return null;
    const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { coinBalance: true }
    })
    const balance = user.coinBalance? user.coinBalance : 0;
    return balance;

}

const getCoinBalanceByUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coinBalance: true }
    })
    if (!user) throw new NotFoundError(message = "USER NOT FOUND");
    const balance = user.coinBalance? user.coinBalance : 0;
    return balance;
}

const purchaseAIPass = async (userId) => {
    const AI_PASS_COST = 100;
    const parsedId = parseInt(userId);

    const user = await prisma.user.findUnique({
        where: { id: parsedId },
        select: { coinBalance: true, aiAccessExpires: true }
    });

    if (!user) throw new NotFoundError("USER NOT FOUND");
    
    const now = new Date();

    if (user.aiAccessExpires && user.aiAccessExpires > now) {
        throw new BadRequestError("Active subscription already exists.");
    }

    if (user.coinBalance < AI_PASS_COST) {
        throw new ForbiddenError("Not enough coins to unlock AI.");
    }

    const newExpiration = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const [paymentResult, accessResult] = await prisma.$transaction([
        prisma.user.update({
            where: { id: parsedId },
            data: { coinBalance: { decrement: AI_PASS_COST } }
        }),
        prisma.user.update({
            where: { id: parsedId },
            data: { aiAccessExpires: newExpiration },
            select: {
                id: true,
                coinBalance: true,
                aiAccessExpires: true
            }
        })
    ]);

    return accessResult;
};

module.exports = {
    buyCoins,
    getCoinBalance,
    getCoinBalanceByUser,
    purchaseAIPass,
};