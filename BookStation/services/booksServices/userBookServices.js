const prisma = require("../../db");
const NotFoundError = require("../../errors/NotFoundError");
const { getOwnedBook } = require("../../utils/BookOwnership");
const { hasAuthorModerationAction } = require("../../utils/accessDetectors/checkEditAccess");
const { isAdminRole } = require("../../utils/checkers/checkUserRole");


const getAllPublicBooks = async () => {
  const books = await prisma.books.findMany({
    where: {
      status: { not: "DRAFT" },
      isFlagged: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true }, },
      bookGenres: { include: { bookGenre: true }, },
      _count: {
        select: {
          views: true,
        },
      },
    },
  });


  if (books.length === 0) throw new NotFoundError("NO PUBLIC BOOKS FOUND");
  return books;
};

const getBookByGenre = async (genreId) => {
  const books = await prisma.books.findMany({
    where: {
      status: { not: "DRAFT" },
      isFlagged: false,
      bookGenres: {
        some: { genreId: parseInt(genreId, 10) },
      },
    },
    include: {
      author: { select: { name: true } },
      bookGenres: {
        include: { bookGenre: true },
      },
      _count: {
        select: {
          chapters: true,
          views: true,
        },
      },
    },
  });

  if (books.length === 0)
    throw new NotFoundError("NO BOOKS FOUND FOR THIS GENRE");
  return books;
};

const getBookById = async (id, currentUserId, currentUserRoleId = null) => {
  const parsedBookId = parseInt(id, 10);
  const book = await prisma.books.findUnique({
    where: {
      id: parsedBookId,
    },
    include: {
      author: { select: { name: true } },
      bookGenres: {
        include: { bookGenre: true },
      },
      _count: {
        select: {
          chapters: true,
          views: true,
        },
      },
    },
  });

  if (!book) throw new NotFoundError("BOOK NOT FOUND");
  console.log(currentUserRoleId)

  const parsedCurrentUserId = parseInt(currentUserId, 10);
  const isOwner = Number.isFinite(parsedCurrentUserId) && parsedCurrentUserId === book.userId;
  const isAdmin = isAdminRole(currentUserRoleId);

  if (book.status !== "DRAFT" && !book.isFlagged) {
    if (isOwner) {
      const allowsEditing = await hasAuthorModerationAction(parsedBookId);
      return { ...book, authorModerationAllowsEditing: allowsEditing };
    }
    return book;
  }

  // Admins/Super Admins may view flagged (but not DRAFT) books through normal routes
  // so they can moderate without owning the book.
  if (book.isFlagged && book.status !== "DRAFT" && isAdmin) {
    return book;
  }

  if (!currentUserId) throw new NotFoundError("BOOK NOT FOUND");
  try {
    await getOwnedBook(parsedBookId, currentUserId);
  } catch {
    throw new NotFoundError("BOOK NOT FOUND");
  }

  if (isOwner) {
    const allowsEditing = await hasAuthorModerationAction(parsedBookId);
    return { ...book, authorModerationAllowsEditing: allowsEditing };
  }
  return book;
};

const getBooksByAuthor = async (authorId, currentUserId, currentUserRoleId = null) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const parsedCurrentUserId = parseInt(currentUserId, 10);
  const isOwner = Number.isFinite(parsedCurrentUserId) && parsedCurrentUserId === parsedAuthorId;
  const isAdmin = isAdminRole(currentUserRoleId);

  const user = await prisma.user.findUnique({
    where: { id: parsedAuthorId },
  });

  if (!user) throw new NotFoundError("AUTHOR NOT FOUND");

  // Owners see everything (incl. drafts/flagged); admins see published+flagged but never drafts;
  // everyone else only sees public, non-flagged books.
  let visibilityFilter = {};
  if (isOwner) {
    visibilityFilter = {};
  } else if (isAdmin) {
    visibilityFilter = { status: { not: "DRAFT" } };
  } else {
    visibilityFilter = { status: { not: "DRAFT" }, isFlagged: false };
  }

  const books = await prisma.books.findMany({
    where: {
      userId: parsedAuthorId,
      ...visibilityFilter,
    },
    include: {
      bookGenres: {
        include: { bookGenre: true },
      },
      _count: {
        select: {
          chapters: true,
          views: true,
        },
      },
    },
  });

  return books;
};

const getTrendingBooks = async (limit = 25) => {
  const books = await prisma.books.findMany({
    where: {
      status: { not: "DRAFT" },
      isFlagged: false,
    },
    take: limit,
    orderBy: [
      { views: { _count: "desc" } },
      { ratings: { _count: "desc" } },
    ],
    select: {
      id: true,
      name: true,
      coverImage: true,
      author: { select: { name: true } },
      _count: {
        select: {
          views: true,
          ratings: true,
        },
      },
    },
  });

  if (books.length === 0) return [];

  const ids = books.map((b) => b.id);
  const aggs = await prisma.rating.groupBy({
    by: ["bookId"],
    where: { bookId: { in: ids } },
    _avg: { value: true },
    _count: { value: true },
  });
  const aggByBook = Object.fromEntries(
    aggs.map((a) => [a.bookId, { ratingAverage: a._avg.value || 0, ratingCount: a._count.value || 0 }])
  );

  return books.map((book) => {
    const views = book._count.views || 0;
    const { ratingAverage = 0, ratingCount = 0 } = aggByBook[book.id] ?? {};
    const score = views * 0.6 + ratingAverage * ratingCount * 0.4;
    return { ...book, ratingAverage, score };
  });
};

const getHighEngagementBooks = async (limit = 25) => {
  const books = await prisma.books.findMany({
    where: {
      status: { not: "DRAFT" },
      isFlagged: false,
    },
    take: limit,
    orderBy: [
      { comments: { _count: "desc" } },
      { ratings: { _count: "desc" } },
    ],
    select: {
      id: true,
      name: true,
      coverImage: true,
      author: { select: { name: true } },
      _count: {
        select: {
          comments: true,
          ratings: true,
          views: true,
        },
      },
    },
  });

  if (books.length === 0) return [];

  const ids = books.map((b) => b.id);
  const aggs = await prisma.rating.groupBy({
    by: ["bookId"],
    where: { bookId: { in: ids } },
    _avg: { value: true },
    _count: { value: true },
  });
  const aggByBook = Object.fromEntries(
    aggs.map((a) => [a.bookId, { ratingAverage: a._avg.value || 0, ratingCount: a._count.value || 0 }])
  );

  return books.map((book) => {
    const commentsCount = book._count.comments || 0;
    const ratingsCount = book._count.ratings || 0;
    const { ratingAverage = 0 } = aggByBook[book.id] ?? {};
    const score = commentsCount + ratingsCount;
    return { ...book, ratingAverage, score };
  });
};

const booksByFollowedAuthors = async (currentUserId, limit) => {
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  const followedAuthors = await prisma.followers.findMany({
    where: {
      followerId: parsedCurrentUserId,
    },
    select: {
      followingId: true,
    },
  });

  if (followedAuthors.length === 0) {
    return [];
  }

  const books = await prisma.books.findMany({
    where: {
      userId: {
        in: followedAuthors.map(author => author.followingId),
      },
      status: { not: "DRAFT" },
      isFlagged: false,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: { select: { name: true } },
      bookGenres: {
        include: { bookGenre: true },
      },
      _count: {
        select: {
          views: true,
        },
      },
    }
  });

  return books;
};


const getDiscoverBooks = async ({ limit = 24, cursor } = {}) => {
  const take = Math.max(1, Math.min(parseInt(limit, 10) || 24, 50));
  return prisma.books.findMany({
    where: { status: { not: "DRAFT" }, isFlagged: false},
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      coverImage: true,
      status: true,
      author: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });
};

const getCompletedBooks = async ({ limit = 20 } = {}) => {
  const take = Math.max(1, Math.min(parseInt(limit, 10) || 20, 50));
  return prisma.books.findMany({
    where: { status: "COMPLETED", isFlagged: false },
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      coverImage: true,
      status: true,
      author: { select: { name: true } },
      _count: { select: { views: true } },
    },
  });
};

module.exports = {
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  getBookByGenre,
  getTrendingBooks,
  booksByFollowedAuthors,
  getHighEngagementBooks,
  getDiscoverBooks,
  getCompletedBooks,
};
