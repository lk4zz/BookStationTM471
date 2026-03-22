const prisma = require('../db');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getOwnedBook = async (bookId, userId) => {
    const book = await prisma.books.findUnique({
        where: { id: parseInt(bookId, 10) }
    });
    
    if (!book) {
        throw new NotFoundError("Book not found");
    }
    
    if (book.userId !== parseInt(userId, 10)) {
        throw new ForbiddenError("You are not the owner of this book.");
    }
    
    return { isAuthor: true, book };
};


module.exports = {
    getOwnedBook
};