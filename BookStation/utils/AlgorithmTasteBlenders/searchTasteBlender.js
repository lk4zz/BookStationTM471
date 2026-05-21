const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

const searchTasteBlender = async (userId, queryVector) => {
    const parsedUserId = parseInt(userId, 10);
    // early exit
    if (!queryVector || !Number.isFinite(parsedUserId)) return;

    // weight (low for search)
    const SEARCHQUERY_WEIGHT = 0.08;

    // global function with weight query vector and the user to blend their profile
    blendTasteProfile(parsedUserId, queryVector, SEARCHQUERY_WEIGHT)
        .catch(error => console.error(`[TasteBlender] Background vector math failed for user ${parsedUserId}:`, error));
};

module.exports = { searchTasteBlender };