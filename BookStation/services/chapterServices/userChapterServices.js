const prisma = require("../../db");
const accessDetector = require("../../utils/accessDetectors/chapterAccessDetector");
const { getOwnedBook } = require("../../utils/BookOwnership");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const PaymentRequiredError = require("../../errors/PaymentRequiredError");

const getChaptersByBook = async (bookId, currentUserId, currentUserRoleId = null) => {
    // Fetch book
    const book = await prisma.books.findUnique({
        where: { id: parseInt(bookId, 10) },
    });

    if (!book) throw new NotFoundError("Book not found");

    // Determine if the requester is the author
    const isAuthor = currentUserId && book.userId === parseInt(currentUserId, 10);

    // if it is the author they have access even if it the book is drafted
    if (book.status === "DRAFT" && !isAuthor) {
        throw new NotFoundError("This book is not public.");
    }

    // fetch chapters conditionally
    const chapters = await prisma.chapters.findMany({
        where: {
            bookId: parseInt(bookId, 10),
            // If the user is the author, apply no filter (fetch all).
            // If they are a standard reader, restrict to published only.
            ...(isAuthor ? {} : { isPublished: true })
        },
        orderBy: { chapterNum: "asc" },
    });

    //should not show in UI because published books cant have less than 3 chapters (backend security)
    if (chapters.length === 0) {
        if (!isAuthor) {
            throw new NotFoundError(
                isAuthor ? "No chapters found for this book." : "No published chapters found for this book."
            );
        }
        else{
            return [];
        }

    }

    // Authors implicitly have access to all chapters skip the accessDetector entirely.
    if (isAuthor) {
        return chapters.map((chapter) => ({
            ...chapter,
            hasAccess: true,
        }));
    }

    // evaluate Access for Readers
    const decoratedChapters = await Promise.all(
        chapters.map(async (chapter) => {
            const accessData = await accessDetector.checkAccess(
                chapter.id,
                currentUserId,
                currentUserRoleId,
            );

            return {
                ...chapter,
                hasAccess: accessData.hasAccess,
            };
        }),
    );

    return decoratedChapters;
};

const getChapterById = async (chapterId, userId, currentUserRoleId) => {

    // fetch the chapter through access function
    const accessData = await accessDetector.checkAccess(
        parseInt(chapterId, 10),
        userId,
        currentUserRoleId,
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

    // check wallet balance
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
            data: { coinBalance: { increment: accessData.chapter.price } }
        }),
    ]);

    return { updatedUserWallet, receipt };
};


module.exports = {
    getChaptersByBook,
    getChapterById,
    unlockChapter,
};
