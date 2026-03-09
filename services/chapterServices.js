const prisma = require('../db');

const createChapter = async (bookId, title, currentUserId, price) => {
    const book = await prisma.books.findUnique({
        where: { id: parseInt(bookId) }
    });

    if (!book) throw new Error('Book not Found');
    if (book.userId !== currentUserId) throw new Error("You are not the author of this book.");

    const chapterPrice = price ?? 0
    let calculatedIsLocked = false;
    if (chapterPrice > 0) {
        calculatedIsLocked = true;
    }
    const lastChapter = await prisma.chapters.findFirst({
        where: { bookId: parseInt(bookId) },
        orderBy: { chapterNum: 'desc' },
    });

    const chapterNumber = lastChapter ? lastChapter.chapterNum + 1 : 1;

    const newChapter = await prisma.chapters.create({
        data: {
            bookId: parseInt(bookId),
            title: title,
            chapterNum: chapterNumber,
            price: chapterPrice,
            isLocked: calculatedIsLocked,
        }
    });

    return newChapter;
};

const getChaptersByBook = async (bookId) => {
    const chaptersByBook = await prisma.chapters.findMany({
        where: { bookId: parseInt(bookId) },
        orderBy: { chapterNum: 'asc' }
    });

    if (chaptersByBook.length === 0) throw new Error("This book has no chapters.");
    
    return chaptersByBook;
};

const getChapterById = async (id) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(id) },
        include: {
            pages: {
                orderBy: { pageNum: 'asc' }
            }
        }
    });

    if (!chapter) throw new Error("Chapter not found");
    return chapter;
};

const updateChapter = async (chapterId, title, currentUserId, price) => {
    const chapter = await prisma.chapters.findUnique({ where: { id: parseInt(chapterId) } });
    if (!chapter) throw new Error("Chapter not found");

    const book = await prisma.books.findUnique({ where: { id: chapter.bookId } });
    if (book.userId !== currentUserId) throw new Error("You are not the author of this book.");

    const finalPrice = price !== undefined ? parseInt(price) : chapter.price;

    const finalIsLocked = finalPrice > 0;

    const updatedChapter = await prisma.chapters.update({
        where: { id: parseInt(chapterId) },
        data: { 
            title: title, 
            isLocked: finalIsLocked,
            price: finalPrice,
        }
    });

    return updatedChapter;
};

const deleteChapter = async (chapterId, currentUserId) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId) }
    });
    if (!chapter) throw new Error("Chapter not found");

    const book = await prisma.books.findUnique({ 
        where: { id: chapter.bookId }   
    });
    if (book.userId !== currentUserId) throw new Error("You are not the author of this book.");

    await prisma.chapters.delete({
        where: { id: parseInt(chapterId) }
    });
    const remainingChapters = await prisma.chapters.findMany({
        where: { bookId: chapter.bookId },
        orderBy: { chapterNum: 'asc' }
    });

    for (let i = 0; i < remainingChapters.length; i++) {
        const correctChapterNum = i + 1;
    

    await prisma.chapters.update({
            where: { 
                id: remainingChapters[i].id 
            },
            data: { 
                chapterNum: correctChapterNum 
            }
        });
}

    return true;
};

module.exports = {
    createChapter,
    getChaptersByBook,
    getChapterById,
    updateChapter,
    deleteChapter
};