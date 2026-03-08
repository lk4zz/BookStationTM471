const prisma = require('../db');

const createBook = async (title, description, price, authorId) => {

    const existingBook = await prisma.books.findFirst({
        where: { 
            userId: authorId,
            name: title
        }
    });

    if (existingBook) {
        throw new Error("A book with this title already exists. Please choose a different title.");
    }

    const newBook = await prisma.books.create({
        data: {
            name: title,
            description: description || "",
            price: price ?? 0,
            userId: authorId,
            views: 0,
            ratingAverage: 0,
            ratingCount: 0
        }
    });

    return newBook;
};

const getAllBooks = async () => {
    const books = await prisma.books.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return books;
};

const getBookById = async (id) => {
    const book = await prisma.books.findUnique({
        where: { id: parseInt(id) }
    });

    if (!book) throw new Error("Book not found");
    return book;
};

const getBooksByAuthor = async (authorId) => {
    const books = await prisma.books.findMany({
        where: { userId: parseInt(authorId) }
    });
    return books;
};

const updateBook = async (id, currentUserId, title, description, price) => {
    const book = await prisma.books.findUnique({
        where: { id: parseInt(id) }
    });

    if (!book) throw new Error("Book not found");
    
    if (book.userId !== currentUserId) {
        throw new Error("You are not the owner of this book.");
    }

    // Check if another book with the same userId and name already exists (excluding current book)
    if (title !== book.name) {
        const existingBook = await prisma.books.findFirst({
            where: {
                userId: currentUserId,
                name: title,
                id: { not: parseInt(id) }
            }
        });

        if (existingBook) {
            throw new Error("A book with this title already exists. Please choose a different title.");
        }
    }

    const updatedBook = await prisma.books.update({
        where: { id: parseInt(id) },
        data: {
            name: title,
            description: description,
            price: price
        }
    });

    return updatedBook;
};

const deleteBook = async (id, currentUserId) => {
    const book = await prisma.books.findUnique({
        where: { id: parseInt(id) }
    });

    if (!book) throw new Error("Book not found");
    if (book.userId !== currentUserId) throw new Error("You are not the owner of this book.");

    await prisma.books.delete({
        where: { id: parseInt(id) }
    });

    return true; // Just letting the controller know it's done
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    getBooksByAuthor,
    updateBook,
    deleteBook,
};