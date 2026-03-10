const prisma = require('../db');

const createPage = async (chapterId, text, currentUserId) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId) },
        include: { book: true }
    });

    if (!chapter) {
        throw new Error("Chapter not found");
    }
    if (chapter.book.userId !== currentUserId) {
        throw new Error("You are not the author of this book.");
    }

    const lastPage = await prisma.pages.findFirst({
        where: { chapterId: parseInt(chapterId) },
        orderBy: { pageNum: 'desc' },
    });

    const pageNumber = lastPage ? lastPage.pageNum + 1 : 1;

    const newPage = await prisma.pages.create({
        data: {
            chapterId: parseInt(chapterId),
            text: text,
            pageNum: pageNumber
        }
        });

    return newPage;
    };


    const updatePage = async (chapterId, text, currentUserId, pageId) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId) },
        include: { book: true }
    });

    if (!chapter) {
        throw new Error("Chapter not found");
    }
    if (chapter.book.userId !== currentUserId) {
        throw new Error("You are not the author of this book.");
    }


    const updatedPage = await prisma.pages.update({
        where: { id: parseInt(pageId)},
        data: {
            chapterId: parseInt(chapterId),
            text: text,
        }
        });

    return updatedPage;
    };

    const getPagesByChapter = async (chapterId) => {
        const chapter = await prisma.chapters.findUnique({
            where: {id: parseInt(chapterId)},
            include: {book: true}
        })
        const pagesByChapter = await prisma.pages.findMany({
            where: {chapterId : parseInt(chapterId)},
            orderBy: {pageNum: 'asc'},
            include : {chapter: true}
        });
        if (!chapter) {
            throw new Error("Chapter not found");
        }
        if (pagesByChapter.length === 0) {
            throw new Error("This chapter has no pages.");
        }

        return pagesByChapter;
    };

const deletePage = async (pageId, currentUserId) => {
    const page = await prisma.pages.findUnique({
        where: { id: parseInt(pageId)},
        include: {
            chapter: {
                include: { 
                    book: true 
                }
            }
        }
    });
    if (!page) {
        throw new Error("Page not found");
    }
    if (page.chapter.book.userId !== currentUserId) {
        throw new Error("You are not the author of this book.");
    }
    await prisma.pages.delete({
        where: { id: parseInt(pageId)},
    })
    const remainingPages = await prisma.pages.findMany({
        where: { chapterId: page.chapterId },
        orderBy: { pageNum: 'asc' }
    });

    for (let i = 0; i < remainingPages.length; i++) {
        const correctPageNum = i + 1;

        await prisma.pages.update({
            where: { 
                id: remainingPages[i].id 
            },
            data: { 
                pageNum: correctPageNum 
            }
        });
}
    return true;
}
    

module.exports = {
    createPage,
    getPagesByChapter,
    updatePage,
    deletePage,

};