const prisma = require("../db");
const searchServices = require("../services/searchServices");



const getSearch = async (req, res) => {

    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit) || 10;

    const searchResults = await searchServices.getSearch(searchQuery, limit);

    res.status(200).json({
        success: true,
        count: searchResults.length,
        data: searchResults,
    });

}

module.exports = { getSearch };