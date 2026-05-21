const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

// this util function checks the ownership validity (if user is author of this book)
// and it fetches the book from db and returns it to the function that is using it
const getOwnedBook = async (bookId, userId) => {
  // fetch the book to check ownership
  // note: I can optimize this by selecting the id to check ownership first then fetch the book if needed
  // this approach allows for early exit thus improving the performance
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId, 10) },
  });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.userId !== parseInt(userId, 10)) {
    throw new ForbiddenError("You are not the owner of this book.");
  }

  return { isAuthor: true, book };
};

module.exports = {
  getOwnedBook,
};
