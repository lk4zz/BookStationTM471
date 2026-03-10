const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tagBookWithGenres = async (bookId, genreIds, currentUserId) => {

    const book = await prisma.books.findUnique({
        where: { id: parseInt(bookId) }
    });

    if (!book) {
        throw new Error("Book not found");
    }

    if (book.userId !== currentUserId) {
        throw new Error("Forbidden: You can only tag your own books.");
    }

    //Clear off any old genres before adding the new ones
    await prisma.bookGenre.deleteMany({
        where: { bookId: parseInt(bookId) }
    });

    // genre array
    const stickyNotes = genreIds.map((genreId) => ({
        bookId: parseInt(bookId),
        genreId: parseInt(genreId)
    }));

    // createMany inserts the whole array at once
    const newTags = await prisma.bookGenre.createMany({
        data: stickyNotes
    });

    return newTags;
};

module.exports = {
    tagBookWithGenres
};