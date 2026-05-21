const searchServices = require("../services/searchServices");
const catchAsync = require("../middlewares/catchAsync");

const getSearch = catchAsync(async (req, res) => {
    const searchQuery = req.query.q;
    const currentUserId = req.user?.userId;
    const limit = parseInt(req.query.limit) || 10;

    const searchResults = await searchServices.getSearch(searchQuery, limit, currentUserId);

    res.status(200).json({
        success: true,
        count: searchResults.length,
        data: searchResults,
    });
});

module.exports = { getSearch };