const prisma = require("../db");

const BANNED_MESSAGE =
    "Your account was banned for violating our terms and services.";

/**
 * Run after verifyToken / verifyTokenOptional when req.user is set.
 * Guests (no token / invalid token path sets req.user null) pass through.
 */
const checkIfBanned = async (req, res, next) => {
    try {
        if (!req.user) {
            return next();
        }

        const userId = parseInt(req.user.userId || req.user.id, 10);
        if (isNaN(userId)) {
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isBanned: true },
        });

        if (user && user.isBanned) {
            return res.status(403).json({
                success: false,
                banned: true,
                message: BANNED_MESSAGE,
            });
        }

        next();
    } catch (error) {
        console.error("Ban check error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error during account verification.",
        });
    }
};

module.exports = { checkIfBanned, BANNED_MESSAGE };
