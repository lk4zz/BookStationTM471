const prisma = require('../db');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

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

module.exports = {
    buyCoins,
    getCoinBalance,
    getCoinBalanceByUser
};