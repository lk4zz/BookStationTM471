const prisma = require("../../db");

// Step 3 (taste map): do not write a snapshot more than once per interval (reduces DB noise).
const SNAPSHOT_MIN_INTERVAL_MS = 0;

/**
 * After tasteProfile is updated, optionally append a row to UserTasteSnapshot (throttled).
 * @param {number} userId
 * @param {string} tasteProfileJson - same JSON string stored on User.tasteProfile
 */
const maybeRecordTasteSnapshot = async (userId, tasteProfileJson) => {
    const last = await prisma.userTasteSnapshot.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
    });
    const now = Date.now();
    if (
        last &&
        now - last.createdAt.getTime() < SNAPSHOT_MIN_INTERVAL_MS
    ) {
        return;
    }
    await prisma.userTasteSnapshot.create({
        data: {
            userId,
            tasteProfile: tasteProfileJson,
        },
    });
};

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
        await maybeRecordTasteSnapshot(parsedUserId, initial);
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
    await maybeRecordTasteSnapshot(parsedUserId, blended);
};

module.exports = { blendTasteProfile };
