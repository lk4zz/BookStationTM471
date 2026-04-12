const recommendationService = require("../services/algorithmServices/recommendationServices");
const catchAsync = require("../middlewares/catchAsync"); 
const prisma = require("../db");
const {getTrendingBooks} = require("../services/bookServices");


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

    //  pass empty array [] for excludeBookIds to search the whole catalog
    const personalizedBooks = await recommendationService.findRecommendations(userTasteVector, [], limit);

    res.status(200).json({
        success: true,
        isPersonalized: true, // flag indicating the AI generated this list (basically is personalized)
        count: personalizedBooks.length,
        data: personalizedBooks,
    });
});

module.exports = { getForYouRecommendations };