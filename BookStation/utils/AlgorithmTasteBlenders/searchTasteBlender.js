const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

const searchTasteBlender = async (userId, queryVector) => {

    if (!queryVector) return;

    const SEARCHQUERY_WEIGHT = 0.08;

    blendTasteProfile(userId, queryVector, SEARCHQUERY_WEIGHT)
        .catch(error => console.error(`[TasteBlender] Background vector math failed for user ${userId}:`, error));
};

module.exports = { searchTasteBlender };