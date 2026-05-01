// middlewares/checkAIAccess.js
const prisma = require('../db');
const ForbiddenError = require('../errors/ForbiddenError');
const catchAsync = require('./catchAsync'); 

const checkAIAccess = catchAsync(async (req, res, next) => {
    const userId = req.user.userId; 

    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { aiAccessExpires: true }
    });

    if (!user || !user.aiAccessExpires) {
        throw new ForbiddenError("AI access not purchased.");
    }

    const now = new Date();
    if (user.aiAccessExpires < now) {
        throw new ForbiddenError("Your 24-hour AI pass has expired.");
    }

    next();
});

module.exports = checkAIAccess;