const prisma = require("../../db");
const { cosineSimilarity } = require("../../utils/AIUtils/vectorUtils/cosineSimilarity");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const { ROLE } = require("../../utils/checkers/checkUserRole");
const notificationsServices = require("../../services/notificationsServices");
const notificationHelper = require("../../utils/adminUtils/notificationsHelper");

// ─── History Helpers ──────────────────────────────────────────────────────────

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

// ─── User Management ──────────────────────────────────────────────────────────

const banUser = async (targetUserId) => {
    const parsedTargetId = parseInt(targetUserId, 10);

    const target = await prisma.user.findUnique({
        where: { id: parsedTargetId },
        select: { isBanned: true },
    });

    // Toggle ban status (opposite of their current state)
    const nextBannedState = !target.isBanned;
    
    await prisma.user.update({
        where: { id: parsedTargetId },
        data: { isBanned: nextBannedState },
    });

    const { title, message } = notificationHelper.getBanNotification(nextBannedState);
    await notificationsServices.createNotification(parsedTargetId, title, message);

    return { isBanned: nextBannedState };
};

const changeUserRole = async (userId, newRoleId) => {
    const parsedUserId = parseInt(userId, 10);
    const parsedRoleId = parseInt(newRoleId, 10);

    const allowedRoles = [ROLE.READER, ROLE.AUTHOR, ROLE.ADMIN];
    if (!allowedRoles.includes(parsedRoleId)) {
        throw new BadRequestError("Invalid role ID");
    }

    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { roleId: true },
    });

    if (user.roleId === parsedRoleId) {
        throw new BadRequestError("User already has this role.");
    }

    await prisma.user.update({
        where: { id: parsedUserId },
        data: { roleId: parsedRoleId },
    });

    const { title, message } = notificationHelper.getRoleUpdateNotification(user.roleId, parsedRoleId);
    await notificationsServices.createNotification(parsedUserId, title, message);
};

const getAllUsers = async (actor) => {
    // Restrict visibility based on admin tier
    const whereCondition = actor.roleId === ROLE.SUPER_ADMIN
        ? { roleId: { not: ROLE.SUPER_ADMIN } }
        : { roleId: { notIn: [ROLE.ADMIN, ROLE.SUPER_ADMIN] } };

    return await prisma.user.findMany({
        where: whereCondition,
        select: {
            id: true, name: true, email: true, 
            coinBalance: true, roleId: true, isBanned: true,
        },
        orderBy: { id: "desc" },
    });
};

const generateUserRadar = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tasteProfile: true },
    });

    if (!user?.tasteProfile) return { isPersonalized: false, books: [] };

    const targetVector = JSON.parse(user.tasteProfile);

    // Fetch user's library to flag books they already own
    const library = await prisma.library.findUnique({
        where: { userId },
        select: { id: true },
    });

    const libraryBooks = library 
        ? await prisma.libraryBook.findMany({ where: { libraryId: library.id }, select: { bookId: true } })
        : [];
    const ownedBookIds = new Set(libraryBooks.map((r) => r.bookId));

    const allBooks = await prisma.books.findMany({
        where: {
            embedding: { not: null },
            status: { not: "DRAFT" },
            isFlagged: false,
        },
        select: { id: true, name: true, coverImage: true, embedding: true },
        take: 500, // RADAR_BOOK_LIMIT
    });

    const scoredBooks = allBooks.map((book) => {
        const bookVector = JSON.parse(book.embedding);
        const { embedding, ...safeBookData } = book;

        return {
            ...safeBookData,
            similarityScore: cosineSimilarity(targetVector, bookVector),
            inLibrary: ownedBookIds.has(safeBookData.id),
        };
    });

    scoredBooks.sort((a, b) => b.similarityScore - a.similarityScore);

    return { isPersonalized: true, books: scoredBooks };
};

// ─── Book Management & Moderation ─────────────────────────────────────────────

const deleteBook = async (bookId) => {
    await prisma.books.delete({ where: { id: parseInt(bookId, 10) } });
};

const getAdminBooks = async () => {
    return await prisma.books.findMany({
        where: { status: { not: "DRAFT" } },
        select: {
            id: true, userId: true, name: true, isFlagged: true, createdAt: true,
            author: { select: { name: true } },
            _count: { select: { views: true, ratings: true, chapters: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const adminFlagBookAndNotify = async (bookId, reasonMessage, adminId) => {
    const parsedBookId = parseInt(bookId, 10);
    const book = await prisma.books.findUnique({ where: { id: parsedBookId } });

    if (!book) throw new NotFoundError("Book not found");

    // Force book back to author for corrections
    await prisma.books.update({
        where: { id: parsedBookId },
        data: { isFlagged: true, isUnderReview: false }
    });

    const activeCase = await prisma.moderationLog.findFirst({
        where: { bookId: parsedBookId, status: { not: "CLOSED" } },
    });

    const historyEvent = {
        actorType: "ADMIN",
        actorId: parseInt(adminId, 10),
        note: reasonMessage,
        fromStatus: activeCase?.status || null,
        toStatus: "AWAITING_AUTHOR",
    };

    if (activeCase) {
        await prisma.moderationLog.update({
            where: { id: activeCase.id },
            data: {
                reason: reasonMessage,
                source: "ADMIN",
                adminId: parseInt(adminId, 10),
                status: "AWAITING_AUTHOR",
                history: appendHistoryEvent(activeCase.history, historyEvent),
            },
        });
    } else {
        await prisma.moderationLog.create({
            data: {
                bookId: parsedBookId,
                reason: reasonMessage,
                source: "ADMIN",
                status: "AWAITING_AUTHOR",
                adminId: parseInt(adminId, 10),
                history: JSON.stringify([{ ...historyEvent, createdAt: new Date().toISOString() }]),
            },
        });
    }

    const { title, message } = notificationHelper.getModerationNotification("FLAGGED", reasonMessage);
    await notificationsServices.createNotification(book.userId, title, message);
};

const adminSendFeedbackAgain = async (bookId, feedbackMessage, adminId) => {
    const parsedBookId = parseInt(bookId, 10);
    const book = await prisma.books.findUnique({ where: { id: parsedBookId } });

    if (!book) throw new NotFoundError("Book not found");

    const activeCase = await prisma.moderationLog.findFirst({
        where: { bookId: parsedBookId, status: "UNDER_REVIEW" },
        orderBy: { createdAt: "desc" },
    });

    if (!activeCase) throw new BadRequestError("No active review found for this book.");

    const historyEvent = {
        actorType: "ADMIN",
        actorId: parseInt(adminId, 10),
        note: feedbackMessage,
        fromStatus: "UNDER_REVIEW",
        toStatus: "AWAITING_AUTHOR",
    };

    await prisma.moderationLog.update({
        where: { id: activeCase.id },
        data: {
            status: "AWAITING_AUTHOR",
            authorSubmissionNote: null,
            history: appendHistoryEvent(activeCase.history, historyEvent),
        },
    });

    await prisma.books.update({
        where: { id: parsedBookId },
        data: { isUnderReview: false },
    });

    const { title, message } = notificationHelper.getModerationNotification("FEEDBACK", feedbackMessage);
    await notificationsServices.createNotification(book.userId, title, message);
};

const getReviewQueue = async () => {
    const cases = await prisma.moderationLog.findMany({
        where: { status: "UNDER_REVIEW" },
        orderBy: { createdAt: "desc" },
        include: {
            book: {
                include: { author: { select: { name: true, email: true } } },
            },
        },
    });

    return cases.map((c) => ({
        ...c,
        history: parseHistory(c.history),
    }));
};

const adminUnflagBook = async (bookId, resolutionMessage, adminId) => {
    const parsedBookId = parseInt(bookId, 10);
    const parsedAdminId = parseInt(adminId, 10);
    const book = await prisma.books.findUnique({ where: { id: parsedBookId } });

    if (!book) throw new NotFoundError("Book not found");

    await prisma.books.update({
        where: { id: parsedBookId },
        data: { isFlagged: false, isUnderReview: false }
    });

    await prisma.reports.deleteMany({ where: { bookId: parsedBookId } });

    const activeCases = await prisma.moderationLog.findMany({
        where: { bookId: parsedBookId, status: { not: "CLOSED" } },
    });

    for (const activeCase of activeCases) {
        const historyEvent = {
            actorType: "ADMIN",
            actorId: parsedAdminId,
            note: resolutionMessage,
            fromStatus: activeCase.status,
            toStatus: "CLOSED",
        };

        await prisma.moderationLog.update({
            where: { id: activeCase.id },
            data: {
                status: "CLOSED",
                resolvedByAdminId: parsedAdminId,
                resolvedAt: new Date(),
                history: appendHistoryEvent(activeCase.history, historyEvent),
            },
        });
    }

    const { title, message } = notificationHelper.getModerationNotification("RESTORED", resolutionMessage);
    await notificationsServices.createNotification(book.userId, title, message);
};

module.exports = {
    generateUserRadar,
    banUser,
    deleteBook,
    getAllUsers,
    getAdminBooks,
    changeUserRole,
    adminFlagBookAndNotify,
    adminSendFeedbackAgain,
    getReviewQueue,
    adminUnflagBook,
};