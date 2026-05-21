const prisma = require("../../db");
const { cosineSimilarity } = require("../../utils/AIUtils/vectorUtils/cosineSimilarity");

const CANDIDATE_HARD_CAP = 300;

const findRecommendations = async (targetVector, excludeBookIds = [], limit = 10) => {
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 50));

    const bookCandidates = await prisma.books.findMany({
        where: {
            id: { notIn: excludeBookIds },
            status: { not: "DRAFT" },
            isFlagged: false,
            embedding: { not: null },
        },
        take: CANDIDATE_HARD_CAP,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            embedding: true,
            name: true,
            coverImage: true,
            author: { select: { name: true } },
            _count: { select: { views: true } },
        },
    });

    const topBooks = [];

    for (const book of bookCandidates) {
        // Safe-check: allows you to drop JSON.parse later without breaking this function
        const bookVector = typeof book.embedding === "string" 
            ? JSON.parse(book.embedding) 
            : book.embedding;

        // O(1) calculation for 384 dimensions
        const similarityScore = cosineSimilarity(targetVector, bookVector);

        if (similarityScore < 0.30) continue;

        // Only process if we have room, OR if this book beats the worst book currently in our top list
        if (topBooks.length < safeLimit || similarityScore > topBooks[topBooks.length - 1].similarityScore) {
            const { embedding, ...rest } = book;
            const scoredBook = { ...rest, similarityScore };

            // Find exactly where this belongs to maintain a sorted array without calling .sort()
            const insertIndex = topBooks.findIndex(b => b.similarityScore < similarityScore);
            
            if (insertIndex === -1) {
                topBooks.push(scoredBook);
            } else {
                topBooks.splice(insertIndex, 0, scoredBook);
            }

            // Eject the lowest-scoring book if we exceed the limit
            if (topBooks.length > safeLimit) {
                topBooks.pop();
            }
        }
    }

    return topBooks;
};

const getRecommendationsByBookId = async (bookId, limit = 5) => {
    const parsedBookId = parseInt(bookId, 10);
    
    // Optimization: Only select the embedding. You don't need the rest of the book data here.
    const currentBook = await prisma.books.findUnique({ 
        where: { id: parsedBookId },
        select: { embedding: true }
    });
    
    if (!currentBook?.embedding) return [];

    const targetVector = typeof currentBook.embedding === "string"
        ? JSON.parse(currentBook.embedding)
        : currentBook.embedding;

    return await findRecommendations(targetVector, [parsedBookId], limit);
};

module.exports = { findRecommendations, getRecommendationsByBookId };