const prisma = require("../db");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const { getOwnedBook } = require("../utils/BookOwnership");
const { checkBookReceipts, checkChapterRreceipt } = require("../utils/checkReceipt");


const createBook = async (title, description, authorId) => {
  normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, '');
  const books = await prisma.books.findMany({
    where: {
      userId: authorId },
      select: { id: true , name: true},
  });

  const existingBook = books.find(b => b.name.toLowerCase().replace(/\s+/g, '') === normalizedTitle);

  if (existingBook) {
    throw new BadRequestError("TITLE ALREADY EXISTS");
  }

  const newBook = await prisma.books.create({
    data: {
      name: title,
      description: description || "",
      userId: authorId,
      views: 0,
      ratingAverage: 0,
      ratingCount: 0,
    },
  });

  return newBook;
};

const getAllPublicBooks = async () => {
  const books = await prisma.books.findMany({
    where: {
      NOT: { status: "DRAFT" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true}, },
      bookGenres: { include: { bookGenre: true }, },
      _count: {
        select: { chapters: true }, },
    },
  });

  
  if (books.length === 0) throw new NotFoundError("NO PUBLIC BOOKS FOUND");
  return books;
};

const getDraftedPrivateBooks = async (currentUserId) => {
  const books = await prisma.books.findMany({
    where: {
      userId: currentUserId,
      status: "DRAFT",
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

  if (books.length === 0) throw new NotFoundError("NO DRAFT BOOKS FOUND");
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

const getBookById = async (id) => {
  const book = await prisma.books.findFirst({
    where: {
      id: parseInt(id, 10),
      NOT: { status: "DRAFT" },
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
  return book;
};

const getBooksByAuthor = async (authorId) => {
  const parsedAuthorId = parseInt(authorId, 10);

  const user = await prisma.user.findUnique({
    where: { id: parsedAuthorId },
  });

  if (!user) throw new NotFoundError("AUTHOR NOT FOUND");

  const books = await prisma.books.findMany({
    where: {
      userId: parsedAuthorId,
      NOT: { status: "DRAFT" },
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

const updateBook = async (bookId, currentUserId, title, description) => {
  // Extract the book object directly from the functions return value
  const { book } = await getOwnedBook(bookId, currentUserId);

  // Check if another book with the same userId and name already exists
  if (title !== book.name) {
    const existingBook = await prisma.books.findFirst({
      where: {
        userId: currentUserId,
        name: title,
        id: { not: parseInt(bookId) },
      },
    });

    if (existingBook) {
      throw new BadRequestError("TITLE ALREADY EXISTS");
    }
  }

  const updatedBook = await prisma.books.update({
    where: { id: parseInt(bookId) },
    data: {
      name: title,
      description: description,
    },
  });

  return updatedBook;
};

const deleteBook = async (bookId, currentUserId) => {
  await getOwnedBook(bookId, currentUserId);
  await checkBookReceipts(bookId);
  await prisma.books.delete({
    where: { id: parseInt(bookId) },
  });

  return true; // Just letting the controller know it's done
};

const updateBookStatus = async (bookId, currentUserId, requestedStatus) => {
  const { book } = await getOwnedBook(bookId, currentUserId);

  if (book.status === requestedStatus)
    throw new BadRequestError(`BOOK IS ALREADY ${requestedStatus}`);
  if (requestedStatus === "DRAFT") {
    await checkChapterRreceipt(bookId);
  }
  const updatedStatus = await prisma.books.update({
    where: { id: bookId },
    data: { status: requestedStatus },
  });
  return updatedStatus;
};

const updateBookCover = async (bookId, coverImage, currentUserId) => {
  await getOwnedBook(bookId, currentUserId);
  const normalizedPath = coverImage.replace(/\\/g, '/');
  const updatedBook = await prisma.books.update({
    where: { id: bookId},
    data: {
      coverImage: normalizedPath,
    }
  });
  return updatedBook;
}


module.exports = {
  createBook,
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  updateBook,
  deleteBook,
  getBookByGenre,
  getDraftedPrivateBooks,
  updateBookStatus,
  updateBookCover,
};
