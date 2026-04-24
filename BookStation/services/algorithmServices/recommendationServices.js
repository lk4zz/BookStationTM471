const prisma = require("../../db");
const { cosineSimilarity } = require("../../utils/AIUtils/vectorUtils/cosineSimilarity");
const NotFoundError = require("../../errors/NotFoundError");

//layer A pure math calculation give it vector it gives back related content 
const findRecommendations = async (targetVector, excludeBookIds = [], limit) => {

    const bookCandidates = await prisma.books.findMany({
        where: {
            id: { notIn: excludeBookIds },
            NOT: { status: "DRAFT" },
            embedding: { not: null },
        },
        select: {
            id: true,
            embedding: true,
            name: true,
            coverImage: true,
            author: {
                select: { name: true }
            },
        },
    });

    const scoredBooks = bookCandidates.map(book => {
        const bookVector = JSON.parse(book.embedding);
        const { embedding, ...booksDataForFrontend } = book; //destructure
        return {
            ...booksDataForFrontend,
            similarityScore: cosineSimilarity(targetVector, bookVector),
        };
    });
    return scoredBooks.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, limit);
};

// check if needed later keep commented for now
// const getRecommendationsByBookId = async (bookId, limit = 5) => {
//     const currentBook = await prisma.books.findUnique({ where: { id: bookId } });
//     if (!currentBook?.embedding) return [];

//     const targetVector = JSON.parse(currentBook.embedding);
//     // Pass the vector to the core engine, excluding the book we are currently looking at
//     return await findRecommendations(targetVector, [bookId], limit);
// };


module.exports = { findRecommendations };