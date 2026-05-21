const { BadRequestError } = require("openai/error.js");
const prisma = require("../db");
const EmbeddingService = require("./AIServices/VectorServices/EmbeddingService");
const recommendationServices = require("./booksServices/recommendationServices");
const {searchTasteBlender} = require("../utils/AlgorithmTasteBlenders/searchTasteBlender")

const getSearch = async (searchQuery, limit, currentUserId) => {
    const parsedUserId = parseInt(currentUserId);
    //if search is empty dont generate results
    if (!searchQuery) {
        throw new BadRequestError("Search query is required");
    }

    // embed the search query using the embedding service
    const queryVector = await EmbeddingService.generateEmbedding(searchQuery);
    // use the vectorized/embedded query to find search results using the find recommendation service
    const searchResults = await recommendationServices.findRecommendations(queryVector, [], limit);
    // update the user taste a bit with the query vector
    searchTasteBlender (parsedUserId, queryVector);

    return searchResults;
}

module.exports = { getSearch
}