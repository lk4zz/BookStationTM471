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


const createChapter = async (bookId, title, currentUserId) => {
    const { book } = await getOwnedBook(bookId, currentUserId);
    await checkEditAccess(book);

    const lastChapter = await prisma.chapters.findFirst({
        where: { bookId: parseInt(bookId, 10) },
        orderBy: { chapterNum: "desc" },
    });

    const chapterNumber = lastChapter ? lastChapter.chapterNum + 1 : 1;

    const newChapter = await prisma.chapters.create({
        data: {
            bookId: parseInt(bookId, 10),
            title: title,
            chapterNum: chapterNumber,
        },
    });

    return newChapter;
};

const updateChapter = async (
    chapterId,
    title,
    currentUserId,
    requestedPrice,
) => {

    // fetch the chapter include book (for ownership), include pages (for the function to calculate)
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId, 10) },
        select: {
            bookId: true,
            title: true,
            pages: true,
            price: true,
            isLocked: true,
            isPublished: true,
            wordCount: true,
            chapterNum: true,
        },
    });

    if (!chapter) throw new NotFoundError("CHAPTER NOT FOUND");
    const { book } = await getOwnedBook(chapter.bookId, currentUserId);

    // default values in case they only want to update the title
    let finalIsLocked = chapter.isLocked;
    let finalWordCount = chapter.wordCount;
    let finalPrice = chapter.price;

    if (chapter.isPublished) {
        // if user is trying to change price
        if (requestedPrice !== undefined && requestedPrice !== chapter.price) {
            if (requestedPrice !== 0) {
                throw new BadRequestError(
                    "PUBLISHED CHAPTERS CAN ONLY BE SET TO FREE.",
                );

            }
        }
        try {
            const pricingData = validateChapterPricing(
                chapter.pages,
                requestedPrice,
                chapter.chapterNum,
            );
            finalPrice = pricingData.finalPrice;
            finalIsLocked = pricingData.isLocked;
            finalWordCount = pricingData.wordCount; // update word count just incase user edits texts
            if (title) {
                throw new BadRequestError(
                    "PUBLISHED CHAPTERS CAN ONLY BE SET TO FREE.",
                );
            }
        } catch (err) {
            if (err.code === "INVALID_PRICING_TO_WORDCOUNT_RATIO") {
                throw new BadRequestError(
                    "Word Count Must remain within the same limit for price set.",
                );
            }
            throw err;
        }
    } else {
        // It's a draft. Just save the intended price for now, it will be validated on publish.
        finalPrice = parseInt(requestedPrice, 10);
        title = title !== undefined ? title : chapter.title;
        if (chapter.chapterNum === 1) finalPrice = 0;
        finalIsLocked = finalPrice > 0;
    }

    const updatedChapter = await prisma.chapters.update({
        where: { id: parseInt(chapterId, 10) },
        data: {
            title: title,
            price: finalPrice,
            isLocked: finalIsLocked,
            wordCount: finalWordCount,
        },
    });

    return updatedChapter;
};

const publishChapter = async (chapterId, currentUserId, requestedPrice) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId, 10) },
        include: { pages: true, book: { select: { status: true } } },
    });

    if (!chapter) throw new NotFoundError("Chapter not found");

    await getOwnedBook(chapter.bookId, currentUserId);

    if (chapter.isPublished)
        throw new BadRequestError("Chapter is already published");
    if (chapter.book.status === "DRAFT")
        throw new BadRequestError("Chapters cannot be published while the book is in DRAFT. Use Launch Book.");

    

    // if no price is requested, fall back to drafted price
    const priceToValidate = requestedPrice ?? chapter.price;

    // check
    let finalPrice, isLocked, wordCount;
    try {
        const result = validateChapterPricing(
            chapter.pages,
            priceToValidate,
            chapter.chapterNum,
        );
        finalPrice = result.finalPrice;
        isLocked = result.isLocked;
        wordCount = result.wordCount;
    } catch (err) {
        if (err.code === "INVALID_PRICING_TO_WORDCOUNT_RATIO") {
            throw new BadRequestError(
                `Your chapter is ${err.wordCount} word(s), maximum price is ${err.maxAllowedPrice}`,
            );
        }
        throw err; // Throws the negative price error or any other errors
    }

    const publishedChapter = await prisma.chapters.update({
        where: { id: parseInt(chapterId, 10) },
        data: {
            isPublished: true,
            price: finalPrice,
            isLocked: isLocked,
            wordCount: wordCount,
        },
    });

    updateBookMasterEmbedding(chapter.bookId).catch(console.error);

    return publishedChapter;
};

const deleteChapter = async (chapterId, currentUserId) => {
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId, 10) },
    });
    if (!chapter) throw new NotFoundError("CHAPTER NOT FOUND");
    const { book } = await getOwnedBook(chapter.bookId, currentUserId);
    // await checkEditAccess(book);
    await checkChapterRreceipt(chapterId);

    await prisma.chapters.delete({
        where: { id: parseInt(chapterId, 10) },
    });

    const remainingChapters = await prisma.chapters.findMany({
        where: { bookId: chapter.bookId },
        orderBy: { chapterNum: "asc" },
    });

    const updates = remainingChapters.map((ch, index) => {
        return prisma.chapters.update({
            where: { id: ch.id },
            data: { chapterNum: index + 1 },
        });
    });

    await prisma.$transaction(updates);

    return true;
};


module.exports = {
    createChapter,
    updateChapter,
    publishChapter,
    deleteChapter,
}