const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

const addRatingTasteBlender = async (userId, bookId) => {
    //promis.all to send all queries at once
    // fetch back the user rating to get the value and grab the book data (embeddings)
    const [bookData, userRating] = await Promise.all([
        prisma.books.findUnique({
            where: { id: bookId },
            select: { embedding: true }
        }),
        prisma.rating.findUnique({
            where: {
                userId_bookId: { bookId, userId }
            },
            select: { value: true }
        })
    ]);

    //early exit incase of errors
    if (!bookData || !bookData.embedding || !userRating) return;

    //grab the vakue of the rating
    const { value } = userRating;

    // the reason to ignore rating is because mathmatically you cant make the taste go away by deduction
    // you can only pull the user taste not push it away
    if (value < 2.5) return; // Ignore low ratings entirely

    //weight (how bugg the effect is)
    let RATING_WEIGHT = 0.3; 
    
    //decide the weight depending on the rating value
    if (value > 4) {
        RATING_WEIGHT = 0.7;
    } else if (value > 3.5) {
        RATING_WEIGHT = 0.5;
    }

    let bookVector;
    try {
        //parse the book vector
        bookVector = JSON.parse(bookData.embedding);
    } catch (error) {
        //log errors
        console.error(`[TasteBlender] Failed to parse embedding for book ${bookId}`);
        return;
    }

    //use the global function feed it the fetches and decided values to blend the user taste
    blendTasteProfile(userId, bookVector, RATING_WEIGHT)
        .catch(error => {
            //log errors
            console.error(`[TasteBlender] Background vector math failed for user ${userId}:`, error);
        });
};

module.exports = { addRatingTasteBlender };