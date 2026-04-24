const { PrismaClient } = require("@prisma/client");
const NotFoundError = require("../../errors/NotFoundError");
const ForbiddenError = require("../../errors/ForbiddenError");
const prisma = new PrismaClient();

const tagBookWithGenres = async (bookId, genreIds, currentUserId) => {
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId) },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND.");
  }

  if (book.userId !== currentUserId) {
    throw new ForbiddenError("YOU CAN ONLY TAG YOUR BOOKS.");
  }

  //Clear off any old genres before adding the new ones
  await prisma.bookGenre.deleteMany({
    where: { bookId: parseInt(bookId) },
  });

  // genre array
  const stickyNotes = genreIds.map((genreId) => ({
    bookId: parseInt(bookId),
    genreId: parseInt(genreId),
  }));

  // createMany inserts the whole array at once
  const newTags = await prisma.bookGenre.createMany({
    data: stickyNotes,
  });

  return newTags;
};

module.exports = {
  tagBookWithGenres,
};
