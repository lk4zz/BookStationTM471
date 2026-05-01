const prisma = require("../../db");
const { cosineSimilarity } = require("../../utils/AIUtils/vectorUtils/cosineSimilarity");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const {checkUserRole} = require("../../utils/checkUserRole");

const banUser = async (userId) => {
    const parsedUserId = parseInt(userId);

    await prisma.user.delete({
        where: {
            id: parsedUserId
        }
    });
};

const deleteBook = async (bookId) => {
    const parsedBookId = parseInt(bookId);

    await prisma.books.delete({
        where: {
            id: parsedBookId
        }
    });
};

const RADAR_BOOK_LIMIT = 500;

const generateUserRadar = async (userId) => {
    const tasteUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { tasteProfile: true },
    });

    if (!tasteUser || !tasteUser.tasteProfile) {
        return { isPersonalized: false, books: [] };
    }

    const targetVector = JSON.parse(tasteUser.tasteProfile);

    const library = await prisma.library.findUnique({
        where: { userId },
        select: { id: true },
    });

    const libraryBookRows = library
        ? await prisma.libraryBook.findMany({
            where: { libraryId: library.id },
            select: { bookId: true },
        })
        : [];
    const libraryBookIdSet = new Set(libraryBookRows.map((r) => r.bookId));

    const allBooks = await prisma.books.findMany({
        where: {
            embedding: { not: null },
            NOT: { status: "DRAFT" },
        },
        select: {
            id: true,
            name: true,
            coverImage: true,
            embedding: true,
        },
        orderBy: { id: "asc" },
        take: RADAR_BOOK_LIMIT,
    });

    const scoredBooks = allBooks.map((book) => {
        const bookVector = JSON.parse(book.embedding);
        const { embedding, ...safeBookData } = book;

        return {
            ...safeBookData,
            similarityScore: cosineSimilarity(targetVector, bookVector),
            inLibrary: libraryBookIdSet.has(safeBookData.id),
        };
    });

    scoredBooks.sort((a, b) => b.similarityScore - a.similarityScore);

    return {
        isPersonalized: true,
        books: scoredBooks,
    };
};

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        where: {
            roleId: { not: 3 }
        },
        select: {
            id: true,
            name: true,
            email: true,
            coinBalance: true,
            roleId: true,
        },
        orderBy: {
            id: 'desc'
        }
    });

    return users;
};


const changeUserRole = async (userId, roleId) => {
    const parsedUserId = parseInt(userId);
    const parsedRoleId = parseInt(roleId);
    if (isNaN(parsedRoleId) || parsedRoleId < 1 || parsedRoleId > 2) {
        throw new BadRequestError("Invalid role ID");
    }

    if (!parsedUserId || isNaN(parsedUserId)) {
        throw new BadRequestError("Invalid user ID");
    }
    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: {
            id: true,
            roleId: true,
        },
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }
    const userRole = checkUserRole(user.roleId);

    if (user.roleId === parsedRoleId) {
        throw new BadRequestError(`User already is ${userRole}`);
    }

    await prisma.user.update({
        where: { id: parsedUserId },
        data: {
            roleId: parsedRoleId,
        },
    })
}

module.exports = {
    generateUserRadar,
    banUser,
    deleteBook,
    getAllUsers,
    changeUserRole,
};