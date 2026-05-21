const prisma = require("../../db");
const { validateChapterPricing } = require("../../utils/pricingHelper");
const { getOwnedBook } = require("../../utils/BookOwnership");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const { checkChapterRreceipt } = require("../../utils/checkReceipt");
const {
    checkEditAccess,
    checkChapterEditAccess,
    isPublishedBook,
} = require("../../utils/accessDetectors/checkEditAccess");
const { updateBookMasterEmbedding } = require("../../utils/AIUtils/vectorUtils/BookDataEmbedder");


const createChapter = async (bookId, title, currentUserId) => {

    //check ownership and fetch book
    const { book } = await getOwnedBook(bookId, currentUserId);

    //check edit access of book if adding chapters is allowed
    await checkEditAccess(book);

    //fetch last chapter from db 
    const lastChapter = await prisma.chapters.findFirst({
        where: { bookId: parseInt(bookId, 10) },
        orderBy: { chapterNum: "desc" },
    });

    //make sure the chapter numbering is correct
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

    //fetch the chapter to update
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

    //check book edit access
    await checkEditAccess(book);

    //check chapter edit access
    await checkChapterEditAccess(chapter);

    //initiliaze data incase something wasnt update fall back to original value
    let finalIsLocked = chapter.isLocked;
    let finalWordCount = chapter.wordCount;
    let finalPrice = chapter.price;

    if (chapter.isPublished) {
        
        // published chapters can only be set to free 
        if (requestedPrice !== undefined && requestedPrice !== chapter.price) {
            if (requestedPrice !== 0) {
                throw new BadRequestError("PUBLISHED CHAPTERS CAN ONLY BE SET TO FREE.");
            }
        }
        try {
            //validate the new price (word count to coin price ratio)
            const pricingData = validateChapterPricing(
                chapter.pages,
                requestedPrice,
                chapter.chapterNum,
            );
            finalPrice = pricingData.finalPrice;
            finalIsLocked = pricingData.isLocked;
            finalWordCount = pricingData.wordCount;
        } catch (err) {
            if (err.code === "INVALID_PRICING_TO_WORDCOUNT_RATIO") {
                throw new BadRequestError(
                    "Word Count Must remain within the same limit for price set.",
                );
            }
            throw err;
        }
        // Title updates are allowed during AWAITING_AUTHOR )review cases).
        title = title !== undefined ? title : chapter.title;
    } else {
        // Draft chapter save any price. validation happens on publish.
        finalPrice = parseInt(requestedPrice, 10);
        title = title !== undefined ? title : chapter.title;
        if (chapter.chapterNum === 1) finalPrice = 0;
        finalIsLocked = finalPrice > 0;
    }

    //apply the update in db
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
    //fetch the chapter to publish
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId, 10) },
        include: {
            pages: true,
            book: { select: { id: true, status: true, isUnderReview: true } },
        },
    });

    if (!chapter) throw new NotFoundError("Chapter not found");

    //check book ownership
    await getOwnedBook(chapter.bookId, currentUserId);

    // check book edit access
    await checkEditAccess(chapter.book);

    //logic checkers
    if (chapter.isPublished)
        throw new BadRequestError("Chapter is already published");
    if (chapter.book.status === "DRAFT")
        throw new BadRequestError("Chapters cannot be published while the book is in DRAFT. Use Launch Book.");

    const priceToValidate = requestedPrice ?? chapter.price;

    let finalPrice, isLocked, wordCount;
    try {
        //validate pricing 
        const result =  await validateChapterPricing(
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
        throw err;
    }

    //publish query request to db
    const publishedChapter = await prisma.chapters.update({
        where: { id: parseInt(chapterId, 10) },
        data: {
            isPublished: true,
            price: finalPrice,
            isLocked: isLocked,
            wordCount: wordCount,
        },
    });

    //update the book embeddings using the new published chapter page chunks
    updateBookMasterEmbedding(chapter.bookId).catch(console.error);

    return publishedChapter;
};


const deleteChapter = async (chapterId, currentUserId) => {
    //fetch the chapter to delete
    const chapter = await prisma.chapters.findUnique({
        where: { id: parseInt(chapterId, 10) },
    });
    if (!chapter) throw new NotFoundError("CHAPTER NOT FOUND");

    //check book ownership
    const { book } = await getOwnedBook(chapter.bookId, currentUserId);

    //check the number of chapters to ensure a minimum of 3 chapters for published books
    const chapterCount = await prisma.chapters.count({
        where: { bookId: chapter.bookId },
    });

    //check for minimum chapter count here..
    if (isPublishedBook(book) && chapterCount <= 3) {
        throw new BadRequestError(
            "Published books must keep at least 3 chapters. You cannot delete a chapter while the book only has three.",
        );
    }

    // Regardless of moderation state, chapters with purchase receipts cannot be deleted.
    await checkChapterRreceipt(chapterId);

    //apply the deletion query
    await prisma.chapters.delete({
        where: { id: parseInt(chapterId, 10) },
    });

    //fetch the remaining chapters
    const remainingChapters = await prisma.chapters.findMany({
        where: { bookId: chapter.bookId },
        orderBy: { chapterNum: "asc" },
    });

    //update the chapters numbering
    const updates = remainingChapters.map((ch, index) =>
        prisma.chapters.update({
            where: { id: ch.id },
            data: { chapterNum: index + 1 },
        }),
    );

    //transaction to make sure all chapters update (if one fails all fail)
    await prisma.$transaction(updates);

    return true;
};


module.exports = {
    createChapter,
    updateChapter,
    publishChapter,
    deleteChapter,
};
