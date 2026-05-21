const BadRequestError = require("../../errors/BadRequestError");
const prisma = require("../../db");
const NotFoundError = require("../../errors/NotFoundError");
const notificationsServices = require("../../services/notificationsServices");

const VALID_REPORT_REASONS = new Set(["SPAM", "OFFENSIVE", "COPYRIGHT", "OTHER"]);

// history operation for review system
const parseHistory = (historyStr) => {
    try {
        return historyStr ? JSON.parse(historyStr) : [];
    } catch {
        return [];
    }
};

const appendHistoryEvent = (existingHistoryStr, event) => {
    const history = parseHistory(existingHistoryStr);
    history.push({ ...event, createdAt: new Date().toISOString() });
    return JSON.stringify(history);
};


//create a new report
const createReport = async (currentUserId, bookId, reason, comment) => {
    const parsedcurrentUserId = parseInt(currentUserId, 10);
    const parsedBookId = parseInt(bookId, 10);
    const normalizedReason = typeof reason === "string" ? reason.trim().toUpperCase() : "";

    //logic checks
    if (!normalizedReason) {
        throw new BadRequestError("REASON CANNOT BE EMPTY");
    }

    if (!VALID_REPORT_REASONS.has(normalizedReason)) {
        throw new BadRequestError("INVALID REPORT REASON");
    }

    const book = await prisma.books.findUnique({
        where: { id: parsedBookId },
    });

    if (!book) {
        throw new NotFoundError("BOOK NOT FOUND");
    }

    const existingReport = await prisma.reports.findFirst({
        where: {
            userId: parsedcurrentUserId,
            bookId: parsedBookId,
        },
    });

    if (existingReport) {
        throw new BadRequestError("YOU HAVE ALREADY REPORTED THIS BOOK.");
    }

    //create report query
    const newReport = await prisma.reports.create({
        data: {
            userId: parsedcurrentUserId,
            bookId: parsedBookId,
            reason: normalizedReason,
            comment: comment
        }
    });

    const reportCount = await prisma.reports.count({
        where: { bookId: parsedBookId }
    });

    if (reportCount >= 3) {
        // Only create a moderation case if there isn't already an active one
        const activeModerationCase = await prisma.moderationLog.findFirst({
            where: {
                bookId: parsedBookId,
                status: { not: "CLOSED" },
            },
        });

        // System auto-flag: isUnderReview=true, visible to admins immediately
        await prisma.books.update({
            where: { id: parsedBookId },
            data: { isFlagged: true, isUnderReview: true }
        });

        if (!activeModerationCase) {
            const initialReason = `Auto-flagged after reaching ${reportCount} reports. Latest reason: ${normalizedReason}.`;
            const initialHistory = JSON.stringify([{
                actorType: "SYSTEM",
                actorId: null,
                note: initialReason,
                fromStatus: null,
                toStatus: "UNDER_REVIEW",
                createdAt: new Date().toISOString(),
            }]);

            await prisma.moderationLog.create({
                data: {
                    bookId: parsedBookId,
                    adminId: null,
                    source: "SYSTEM",
                    status: "UNDER_REVIEW",
                    reason: initialReason,
                    history: initialHistory,
                },
            });
        }

        const title = "Flagged Book";
        const message = `Your book "${book.name}" has been flagged due to multiple reports and is under review by the admins. You may submit it for review after the admins send their feedback.`;
        await notificationsServices.createNotification(book.userId, title, message);
    }

    return newReport;
};

//get report summary for admins incase the book is flagged
const getAdminReportSummary = async (bookId) => {
    const groupedReasons = await prisma.reports.groupBy({
        by: ['reason'],
        where: { bookId: bookId },
        _count: {
            reason: true,
        },
    });

    //reason summary for recent report and report messages
    const reasonSummary = {};
    for (let i = 0; i < groupedReasons.length; i++) {
        const group = groupedReasons[i];
        reasonSummary[group.reason] = group._count.reason;
    }

    //sample comments on book
    const sampleComments = await prisma.reports.findMany({
        where: {
            bookId: bookId,
            comment: { not: null }
        },
        select: {
            reason: true,
            comment: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    return {
        totalReports: await prisma.reports.count({ where: { bookId } }),
        reasonSummary,
        samples: sampleComments
    };
};

module.exports = {
    createReport,
    getAdminReportSummary,
    parseHistory,
    appendHistoryEvent,
};
