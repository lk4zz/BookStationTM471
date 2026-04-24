const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

const addRatingTasteBlender = async (userId, bookId) => {
    //promis.all to send all queries at once
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

    if (!bookData || !bookData.embedding || !userRating) return;

    const { value } = userRating;

    if (value < 2.5) return; // Ignore low ratings entirely

    let RATING_WEIGHT = 0.3; 
    
    if (value > 4) {
        RATING_WEIGHT = 0.7;
    } else if (value > 3.5) {
        RATING_WEIGHT = 0.5;
    }

    let bookVector;
    try {
        bookVector = JSON.parse(bookData.embedding);
    } catch (error) {
        console.error(`[TasteBlender] Failed to parse embedding for book ${bookId}`);
        return;
    }

    blendTasteProfile(userId, bookVector, RATING_WEIGHT)
        .catch(error => {
            console.error(`[TasteBlender] Background vector math failed for user ${userId}:`, error);
        });
};

module.exports = { addRatingTasteBlender };