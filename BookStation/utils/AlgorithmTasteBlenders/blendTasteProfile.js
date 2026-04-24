const prisma = require("../../db");

/**
 * Universal function to shift a user's taste profile.
 * @param {number} userId - The user to update
 * @param {Array<number>} newVector - The vector of the book/search they just interacted with
 * @param {number} weight - How much this action matters (0.0 to 1.0). e.g., 0.2 = 20%
 */

const blendTasteProfile = async (userId, newVector, weight) => {
    const parsedUserId = parseInt(userId, 10);
    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { tasteProfile: true },
    });

    if (!user.tasteProfile) {
        const initial = JSON.stringify(newVector);
        await prisma.user.update({
            where: { id: parsedUserId },
            data: { tasteProfile: initial },
        });
        return;
    }

    const currentTasteProfile = JSON.parse(user.tasteProfile);
    const updateProfile = [];

    for (let i = 0; i < currentTasteProfile.length; i++) {
        const oldTasteComponent = currentTasteProfile[i] * (1 - weight);
        const newTasteComponent = newVector[i] * weight;
        const blendValue = oldTasteComponent + newTasteComponent;

        updateProfile.push(blendValue);
    }

    const blended = JSON.stringify(updateProfile);
    await prisma.user.update({
        where: { id: parsedUserId },
        data: { tasteProfile: blended },
    });
};

module.exports = { blendTasteProfile };
