const recommendationService = require("../../services/booksServices/recommendationServices");
const catchAsync = require("../../middlewares/catchAsync"); 
const prisma = require("../../db");
const {getTrendingBooks} = require("../../services/booksServices/userBookServices");
const libraryServices = require("../../services/libraryServices");

//get recommendations using user taste profile
const getForYouRecommendations = catchAsync(async (req, res) => {
    
    const userId = req.user?.userId; 
    const limit = 25;

    // fetch the user specific taste profile from the database
    const user = userId
        ? await prisma.user.findUnique({
            where: { id: userId },
            select: { tasteProfile: true }
          })
        : null;

    //  handle cold start problem (The user has no taste profile yet)
    if (!user || !user.tasteProfile) {
        
        // fallback to trending books if guest or user doesnt have taste profile
        const fallbackBooks = await getTrendingBooks(limit);

        return res.status(200).json({
            success: true,
            isPersonalized: false, // flag for the frontend to know this is generic
            count: fallbackBooks.length,
            data: fallbackBooks,
        });
    }
    // when user has profiletaste:
    const userTasteVector = JSON.parse(user.tasteProfile);

    const libraryBookIds = await libraryServices.getLibraryBookIds(userId);
    const personalizedBooks = await recommendationService.findRecommendations(
        userTasteVector,
        libraryBookIds,
        limit
    );

    res.status(200).json({
        success: true,
        isPersonalized: true,
        count: personalizedBooks.length,
        data: personalizedBooks,
    });
});

// this is not being used in front end only in testing
// can be added to book details page to show recommendations based on the currently viewed book
const getRecommendationsByBookId = catchAsync(async (req, res) => {
    const { bookId } = req.params;
    const recommendations = await recommendationService.getRecommendationsByBookId(bookId);
    res.status(200).json({
        success: true,
        data: recommendations,
    });
});

module.exports = { getForYouRecommendations, getRecommendationsByBookId };