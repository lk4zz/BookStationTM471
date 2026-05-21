const prisma = require("../db");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const { addToLibraryTasteBlender } = require("../utils/AlgorithmTasteBlenders/LibraryBookTasteBlender");

const addBookToLibrary = async (currentUserId, bookId) => {

  const parsedUserId = parseInt(currentUserId, 10);
  const parsedBookId = parseInt(bookId, 10);

  //fetch book
  const book = await prisma.books.findUnique({
    where: { id: parsedBookId },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND");
  }

  //check if a library row exists for user if no create one
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
    //create a row to save the book (book-->library-->user(owner of library))
    savedBook = await prisma.libraryBook.create({
      data: {
        libraryId: library.id,
        bookId: parsedBookId,
      },
    });

    //blend the user taste 
    //no await incase blending failed the add to library function doesnt fail to user
    addToLibraryTasteBlender(parsedUserId, parsedBookId);

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

  //fetch the library
  const library = await prisma.library.findUnique({
    where: { userId: currentUserId },
  });
  if (!library) {
    return [];
  }

  //fetch the books in the library
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
  //fetch the book
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId) },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND");
  }

  //fetch the library
  const library = await prisma.library.findFirst({
    where: { userId: currentUserId },
  });

  if (!library) {
    throw new NotFoundError("YOU DON'T HAVE A LIBRARY YET.");
  }

  if (library.userId !== currentUserId) {
    throw new ForbiddenError("YOU ARE NOT THE OWNER OF THIS LIBRARY.");
  }

  //check if the book is in the library
  const libraryBook = await prisma.libraryBook.findFirst({
    where: {
      libraryId: library.id,
      bookId: parseInt(bookId),
    },
  });
  if (!libraryBook) {
    throw new NotFoundError("THIS BOOK IS NOT IN YOUR LIBRARY.");
  }

  //delete the row
  await prisma.libraryBook.delete({
    where: {
      id: libraryBook.id,
    },
  });
  return true;
};

//this function is not relevant for the user
//this function is used by the radar in admin dashboard to flag the books a user has in library
//the radar shows the user taste and all the books near his taste 'space'
//the whole purpose of this function is to map out the ids of books in a users library
const getLibraryBookIds = async (currentUserId) => {
  const userId = parseInt(currentUserId, 10);
  if (!Number.isFinite(userId)) return [];
  const library = await prisma.library.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!library) return [];
  const rows = await prisma.libraryBook.findMany({
    where: { libraryId: library.id },
    select: { bookId: true },
  });
  return rows.map((r) => r.bookId);
};

module.exports = {
  addBookToLibrary,
  getLibraryBooks,
  removeBookFromLibrary,
  getLibraryBookIds,
};
