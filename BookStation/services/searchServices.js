const { BadRequestError } = require("openai/error.js");
const prisma = require("../db");
const EmbeddingService = require("../services/VectorEmbedServces/EmbeddingService");
const recommendationServices = require("../services/algorithmServices/recommendationServices");

const getSearch = async (searchQuery, limit) => {

    if (!searchQuery) {
        throw new BadRequestError("Search query is required");
    }

    const queryVector = await EmbeddingService.generateEmbedding(searchQuery);
    const searchResults = await recommendationServices.findRecommendations(queryVector, [], limit);

    return searchResults;
}

module.exports = { getSearch
}