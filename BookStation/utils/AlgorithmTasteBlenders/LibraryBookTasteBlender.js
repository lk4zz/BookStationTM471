const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

const addToLibraryTasteBlender = async (userId, bookId) => {
    const bookData = await prisma.books.findUnique({
        where: { id: bookId },
        select: { embedding: true }
    });

    if (!bookData || !bookData.embedding) return;

    let bookVector;
    try {
        bookVector = JSON.parse(bookData.embedding);
    } catch (error) {
        console.error(`[TasteBlender] Failed to parse embedding for book ${bookId}`);
        return;
    }

    const ADDTOLIBRARY_WEIGHT = 0.3;

    blendTasteProfile(userId, bookVector, ADDTOLIBRARY_WEIGHT)
        .catch(error => console.error(`[TasteBlender] Background vector math failed for user ${userId}:`, error));
};

module.exports = { addToLibraryTasteBlender };