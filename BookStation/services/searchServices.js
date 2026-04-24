const { BadRequestError } = require("openai/error.js");
const prisma = require("../db");
const EmbeddingService = require("./AIServices/VectorServices/EmbeddingService");
const recommendationServices = require("./algorithmServices/recommendationServices");
const {searchTasteBlender} = require("../utils/AlgorithmTasteBlenders/searchTasteBlender")

const getSearch = async (searchQuery, limit, currentUserId) => {
    const parsedUserId = parseInt(currentUserId);
    if (!searchQuery) {
        throw new BadRequestError("Search query is required");
    }

    const queryVector = await EmbeddingService.generateEmbedding(searchQuery);
    const searchResults = await recommendationServices.findRecommendations(queryVector, [], limit);
    searchTasteBlender (parsedUserId, queryVector);

    return searchResults;
}

module.exports = { getSearch
}