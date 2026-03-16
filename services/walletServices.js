const prisma = require('../db');
const ForbiddenError = require('../errors/ForbiddenError');

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
                increment: parsedAmount // Prisma does the math for us!
            }
        },
        select: {
            id: true,
            name: true,
            coinBalance: true // We only return safe data (no passwords!)
        }
    });

    return updatedUser;

}

module.exports = {
    buyCoins
};