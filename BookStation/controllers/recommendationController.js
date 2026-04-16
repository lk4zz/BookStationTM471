const recommendationService = require("../services/algorithmServices/recommendationServices");
const catchAsync = require("../middlewares/catchAsync"); 
const prisma = require("../db");
const {getTrendingBooks} = require("../services/bookServices");
const libraryServices = require("../services/libraryServices");

const getForYouRecommendations = catchAsync(async (req, res) => {
    
    const userId = req.user?.userId; 
    
    const limit = 10;

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

    // fetch the user's library books to exclude them from the recommendations
    const libraryBooks = await libraryServices.getLibraryBooks( userId );
    const libraryBookIds = libraryBooks.map((lb) => lb.bookId);


    //  pass the library book ids to exclude them from the recommendations
    const personalizedBooks = await recommendationService.findRecommendations(userTasteVector, libraryBookIds, limit);

    res.status(200).json({
        success: true,
        isPersonalized: true, // flag indicating the AI generated this list (basically is personalized)
        count: personalizedBooks.length,
        data: personalizedBooks,
    });
});

module.exports = { getForYouRecommendations };