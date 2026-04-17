const prisma = require("../db");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const { addToLibraryTasteBlender } = require("../utils/AlgorithmTasteBlenders/LibraryBookTasteBlender");

const addBookToLibrary = async (currentUserId, bookId) => {

  const parsedUserId = parseInt(currentUserId, 10);
  const parsedBookId = parseInt(bookId, 10);

  const book = await prisma.books.findUnique({
    where: { id: parsedBookId },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND");
  }

  let library = await prisma.library.findFirst({
    where: { userId: parsedUserId },
  });

  if (!library) {
    library = await prisma.library.create({
      data: {
        userId: parsedUserId,
      },
    });
  }

  try {
    savedBook = await prisma.libraryBook.create({
      data: {
        libraryId: library.id,
        bookId: parsedBookId,
      },
    });

    await addToLibraryTasteBlender(parsedUserId, parsedBookId);

    return savedBook;
  } catch (error) {
    if (error.code === "P2002") {
      //Prisma throws error code P2002 if a unique constraint is violated
      const duplicateError = new BadRequestError("BOOK IS ALREADY IN LIBRARY.");
      duplicateError.statusCode = 400;
      throw duplicateError;
    }
    throw error;
  }
};

const getLibraryBooks = async (currentUserId) => {
  const library = await prisma.library.findUnique({
    where: { userId: currentUserId },
  });
  if (!library) {
    return [];
  }

  return prisma.libraryBook.findMany({
    where: {
      libraryId: library.id,
    },
    include: {
      book: {
        include: {
          author: { select: { id: true, name: true } },
          bookGenres: { include: { bookGenre: true } },
          chapters: {
            select: { id: true, chapterNum: true },
            orderBy: { chapterNum: "asc" },
          },
        },
      },
    },
  });
};

const removeBookFromLibrary = async (currentUserId, bookId) => {
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId) },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND");
  }

  const library = await prisma.library.findFirst({
    where: { userId: currentUserId },
  });

  if (!library) {
    throw new NotFoundError("YOU DON'T HAVE A LIBRARY YET.");
  }

  if (library.userId !== currentUserId) {
    throw new ForbiddenError("YOU ARE NOT THE OWNER OF THIS LIBRARY.");
  }

  const libraryBook = await prisma.libraryBook.findFirst({
    where: {
      libraryId: library.id,
      bookId: parseInt(bookId),
    },
  });
  if (!libraryBook) {
    throw new NotFoundError("THIS BOOK IS NOT IN YOUR LIBRARY.");
  }



  await prisma.libraryBook.delete({
    where: {
      id: libraryBook.id,
    },
  });
  return true;
};

module.exports = {
  addBookToLibrary,
  getLibraryBooks,
  removeBookFromLibrary,
};
