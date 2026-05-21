const prisma = require("../../db");
const { blendTasteProfile } = require("./blendTasteProfile");

//this function blends the user taste when user adds a book to library
const addToLibraryTasteBlender = async (userId, bookId) => {
    //fetch the book embeddings (the book added to library by user)
    const bookData = await prisma.books.findUnique({
        where: { id: bookId },
        select: { embedding: true }
    });

    //if the book doesnt have embedding exist to prevent errors
    if (!bookData || !bookData.embedding) return;

    let bookVector;
    try {
        //parse the data (it is stored as string in db but used as int/number in js)
        bookVector = JSON.parse(bookData.embedding);
    } catch (error) {
        //log errors
        console.error(`[TasteBlender] Failed to parse embedding for book ${bookId}`);
        return;
    }

    //weight: the weight determines how much the action affects the user taste 
    const ADDTOLIBRARY_WEIGHT = 0.3;

    //gather the data and send it to the global reusable function to blend the user taste
    return blendTasteProfile(userId, bookVector, ADDTOLIBRARY_WEIGHT)
    //log errors
        .catch(error => console.error(`[TasteBlender] Background vector math failed for user ${userId}:`, error));
};

module.exports = { addToLibraryTasteBlender };