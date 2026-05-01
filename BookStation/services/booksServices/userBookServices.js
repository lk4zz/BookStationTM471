const prisma = require("../../db");
const NotFoundError = require("../../errors/NotFoundError");
const { getOwnedBook } = require("../../utils/BookOwnership");


const getAllPublicBooks = async () => {
  const books = await prisma.books.findMany({
    where: {
      NOT: { status: "DRAFT" },
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
      NOT: { status: "DRAFT" },
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

const getBookById = async (id, currentUserId) => {
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
  if (book.status !== "DRAFT") return book;

  if (!currentUserId) throw new NotFoundError("BOOK NOT FOUND");
  try {
    await getOwnedBook(parsedBookId, currentUserId);
  } catch {
    throw new NotFoundError("BOOK NOT FOUND");
  }
  return book;
};

const getBooksByAuthor = async (authorId, currentUserId) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const parsedCurrentUserId = parseInt(currentUserId, 10);
  const isOwner = Number.isFinite(parsedCurrentUserId) && parsedCurrentUserId === parsedAuthorId;

  const user = await prisma.user.findUnique({
    where: { id: parsedAuthorId },
  });

  if (!user) throw new NotFoundError("AUTHOR NOT FOUND");

  const books = await prisma.books.findMany({
    where: {
      userId: parsedAuthorId,
      ...(isOwner ? {} : { NOT: { status: "DRAFT" } }),
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
    where: { NOT: { status: "DRAFT" } },
    take: limit, 
    orderBy: [
      { views: { _count: 'desc' } },   
      { ratings: { _count: 'desc' } }  
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
      ratings: {
        select: { value: true },
      },
    },
  });

  return books.map((book) => {
    const views = book._count.views || 0;
    const ratingsCount = book._count.ratings || 0;

    const avg =
      ratingsCount > 0
        ? book.ratings.reduce((sum, r) => sum + r.value, 0) / ratingsCount
        : 0;

    const score = views * 0.6 + avg * ratingsCount * 0.4;

    const { ratings, ...rest } = book;
    return { ...rest, ratingAverage: avg, score };
  });
};

const getHighEngagementBooks = async (limit = 25) => {
  const books = await prisma.books.findMany({
    where: { NOT: { status: "DRAFT" } },
    take: limit,
    orderBy: [
      { comments: { _count: 'desc' } }, 
      { ratings: { _count: 'desc' } }   
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
      ratings: {
        select: { value: true },
      },
    },
  });

  return books.map((book) => {
    const commentsCount = book._count.comments || 0;
    const ratingsCount = book._count.ratings || 0;
    
    const score = commentsCount + ratingsCount;

    const avg =
      ratingsCount > 0
        ? book.ratings.reduce((sum, r) => sum + r.value, 0) / ratingsCount
        : 0;

    const { ratings, ...rest } = book;
    return { ...rest, ratingAverage: avg, score };
  });
};

const booksByFollowedAuthors = async (currentUserId, limit) => {
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  const followedAuthors = await prisma.followers.findMany({
    where: {
      followerId: currentUserId,
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
      NOT: { status: "DRAFT" },
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

module.exports = {
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  getBookByGenre,
  getTrendingBooks,
  booksByFollowedAuthors,
  getHighEngagementBooks,
};
