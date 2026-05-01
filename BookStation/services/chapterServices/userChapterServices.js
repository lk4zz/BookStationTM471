const prisma = require("../../db");
const { validateChapterPricing } = require("../../utils/pricingHelper");
const accessDetector = require("../../utils/accessDetector");
const { getOwnedBook } = require("../../utils/BookOwnership");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const PaymentRequiredError = require("../../errors/PaymentRequiredError");
const { checkChapterRreceipt } = require("../../utils/checkReceipt");
const { checkEditAccess, checkChapterEditAccess } = require("../../utils/checkEditAccess");
const { updateBookMasterEmbedding } = require("../../utils/AIUtils/vectorUtils/BookDataEmbedder");



const getChaptersByBook = async (bookId, currentUserId) => {
    //fetch book
    const book = await prisma.books.findUnique({
        where: { id: parseInt(bookId, 10) },
    });

    if (!book) throw new NotFoundError("Book not found");
    if (book.status === "DRAFT") {
        if (!currentUserId) throw new NotFoundError("This book is not public.");
        try {
            await getOwnedBook(bookId, currentUserId);
        } catch {
            throw new NotFoundError("This book is not public.");
        }
    }

    // fetch all published chapters for this book
    const chapters = await prisma.chapters.findMany({
        where: {
            bookId: parseInt(bookId, 10),
        },
        orderBy: { chapterNum: "asc" },
    });

    if (chapters.length === 0)
        throw new NotFoundError("No published chapters found for this book.");

    if (book.status === "DRAFT") {
        return chapters.map((chapter) => ({
            ...chapter,
            hasAccess: true,
        }));
    }

    // promise.all allows javaScript to send all the queries at the same time to the DB this way you save a lot of time instead of waiting for each check sequentially
    const decoratedChapters = await Promise.all(
        chapters.map(async (chapter) => {
            // send each chapter to the function at the same time
            const accessData = await accessDetector.checkAccess(
                chapter.id,
                currentUserId,
            );

            // return each chapter with access state
            return {
                ...chapter,
                hasAccess: accessData.hasAccess,
            };
        }),
    );

    return decoratedChapters;
};

const getChapterById = async (chapterId, userId) => {
    // fetch the chapter through access function
    const accessData = await accessDetector.checkAccess(
        parseInt(chapterId, 10),
        userId,
    );

    if (!accessData || !accessData.chapter) {
        throw new NotFoundError("Chapter not found or not published.");
    }

    const chapter = accessData.chapter;

    return {
        chapter,
        hasAccess: accessData.hasAccess,
    };
};



const unlockChapter = async (userId, chapterId) => {
    const parsedChapterId = parseInt(chapterId, 10);
    const parsedUserId = parseInt(userId, 10);

    // access function and fetch chapters
    const accessData = await accessDetector.checkAccess(
        parsedChapterId,
        parsedUserId,
    );

    if (accessData.hasAccess) {
        throw new BadRequestError("You already have access to this chapter.");
    }

    // fetch user to check wallet
    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
    });

    if (!user) throw new NotFoundError("User not found, please log in.");

    // check wallet
    if (user.coinBalance < accessData.chapter.price) {
        throw new PaymentRequiredError(
            "You do not have enough coins to unlock this chapter.",
        );
    }

    // transaction function does the two functions simultaneously to make sure no mistakes happen if the server crashes
    const [updatedUserWallet, receipt] = await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { coinBalance: { decrement: accessData.chapter.price } },
        }),
        prisma.chapterUnlocks.create({
            data: { userId: user.id, chapterId: accessData.chapter.id },
        }),
        prisma.user.update({
            where: { id: accessData.chapter.book.userId },
            data: { coinBalance: { increment: accessData.chapter.price }}
        }),  
    ]);

    return { updatedUserWallet, receipt };
};


module.exports = {
    getChaptersByBook,
    getChapterById,
    unlockChapter,
};
