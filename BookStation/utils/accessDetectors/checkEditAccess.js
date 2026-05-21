const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");

// This function checks if the book is under review and await author action 
// in such case the author is free to edit anything in the book per admin request 
// this returns true or null 
const hasAuthorModerationAction = async (bookId) => {
    const row = await prisma.moderationLog.findFirst({
        where: { bookId: parseInt(bookId, 10), status: "AWAITING_AUTHOR" },
    });
    return !!row;
};

//helper function to check if the book is published wether compelted or ongoing
const isPublishedBook = (book) =>
    book?.status === "ONGOING" || book?.status === "COMPLETED";

/**
 *   Book-level edit gate (adding chapters, publish, status etc..).
 * - Blocks all edits while the book is actively under admin review.
 * - Blocks edits on COMPLETED books unless there is an AWAITING_AUTHOR case.
 */
const checkEditAccess = async (book) => {
    if (book.isUnderReview) {
        throw new BadRequestError("This book is currently under admin review and cannot be edited.");
    }
    if (book.status === "COMPLETED") {
        const canEdit = await hasAuthorModerationAction(book.id);
        if (!canEdit) {
            throw new BadRequestError("Published Books cannot be edited.");
        }
    }
};

/**
 * Metadata-only gate (title, description, cover, genres of the book).
 * Authors may not change these on published (ONGOING/COMPLETED) books unless there is
 * an AWAITING_AUTHOR moderation
 * Also blocks while the book is under admin review.
 */
const checkMetadataEditAccess = async (book) => {
    if (book.isUnderReview) {
        throw new BadRequestError("This book is currently under admin review and cannot be edited.");
    }
    //if the book is published
    if (isPublishedBook(book)) {
        //check for awaiting author case
        const canEditMeta = await hasAuthorModerationAction(book.id);
        //if there is no case and book is published then block edits
        if (!canEditMeta) {
            throw new BadRequestError(
                "Published books cannot have their title, description, cover, or genres changed.",
            );
        }
    }
};

/**
 * Chapter-level edit gate — hard unconditional guard for all published chapter edits.
 * Blocks title, body, and price changes on published chapters unless an AWAITING_AUTHOR
 * moderation case is open for the book.
 */
// NOTE: this interferes with the logic of public chapters can only be set to free so might need to edit
// the chapter edit service probably remove the price change completely 
// and I must add warnings to the front end level
const checkChapterEditAccess = async (chapter) => {
    if (chapter.isPublished) {
        const canEdit = await hasAuthorModerationAction(chapter.bookId);
        if (!canEdit) {
            throw new BadRequestError("Published chapters cannot be edited.");
        }
    }
};

module.exports = {
    hasAuthorModerationAction,
    isPublishedBook,
    checkEditAccess,
    checkMetadataEditAccess,
    checkChapterEditAccess,
};
