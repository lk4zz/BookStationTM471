const prisma = require("../../db");

/**
 * Universal function to shift a user's taste profile.
 * @param {number} userId - The user to update
 * @param {Array<number>} newVector - The vector of the book/search they just interacted with
 * @param {number} weight - How much this action matters (0.0 to 1.0). e.g., 0.2 = 20%
 */

const blendTasteProfile = async (userId, newVector, weight) => {
    const parsedUserId = parseInt(userId, 10);
    //fetch the user from db
    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { tasteProfile: true },
    });

    //early exit if user doesnt exist
    if (!user) return;

    //if user doesnt have taste profile we create one using the new vector and exit
    if (!user.tasteProfile) {
        const initial = JSON.stringify(newVector);
        await prisma.user.update({
            where: { id: parsedUserId },
            data: { tasteProfile: initial },
        });
        return;
    }

    //if there is a taste profile we parse it for javascript
    const currentTasteProfile = JSON.parse(user.tasteProfile);
    const updateProfile = [];

    //this is a loop that goes through all the 384 vectors
    // it updates each value by multiplying the old taste with 1 - weight
    // and the new taste by weight
    // and blend the value by combining the results
    for (let i = 0; i < currentTasteProfile.length; i++) {
        const oldTasteComponent = currentTasteProfile[i] * (1 - weight);
        const newTasteComponent = newVector[i] * weight;
        const blendValue = oldTasteComponent + newTasteComponent;

        //push the new values into a variable
        updateProfile.push(blendValue);
    }

    //stringify the new taste profile
    const blended = JSON.stringify(updateProfile);
    //update the user taste with the new vector
    await prisma.user.update({
        where: { id: parsedUserId },
        data: { tasteProfile: blended },
    });
};

module.exports = { blendTasteProfile };
