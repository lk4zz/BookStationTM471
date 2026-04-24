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
        select: { chapters: true },
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
        select: { chapters: true },
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
        select: { chapters: true },
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
        select: { chapters: true },
      },
    },
  });

  if (books.length === 0)
    throw new NotFoundError("NO BOOKS FOUND FOR THIS AUTHOR");
  return books;
};

const getTrendingBooks = async (limit = 10) => {
  const books = await prisma.books.findMany({
    where: { NOT: { status: "DRAFT" } },
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

  const scored = books.map((book) => {
    const views = book._count.views;
    const ratingsCount = book._count.ratings;

    const avg =
      ratingsCount > 0
        ? book.ratings.reduce((sum, r) => sum + r.value, 0) / ratingsCount
        : 0;

    const score = views * 0.6 + avg * ratingsCount * 0.4;

    const { ratings, ...rest } = book;
    return { ...rest, ratingAverage: avg, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}



const booksByFollowedAuthors = async (currentUserId, limit) => {
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  // 1. Get followed author IDs
  const followedAuthors = await prisma.followers.findMany({
    where: {
      followerId: currentUserId,
    },
    select: {
      followingId: true,
    },
  });

  // Early exit if they don't follow anyone (saves database load!)
  if (followedAuthors.length === 0) {
    return [];
  }

  // 2. Fetch the books
  const books = await prisma.books.findMany({
    where: {
      userId: {
        in: followedAuthors.map(author => author.followingId),
      },
    },
    take: limit, // <-- Tells the database to only fetch 'limit' amount of books
    orderBy: {
       createdAt: 'desc', // <-- Sorts so the newest books show up first
    },
    include: {
      author: { select: { name: true } },
      bookGenres: {
        include: { bookGenre: true },
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
};
