const bookService = require("../services/bookServices"); //import service
const catchAsync = require('../middlewares/catchAsync');

const createBook = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  const authorId = req.user.userId;

  const newBook = await bookService.createBook(title, description, authorId);

  res.status(201).json({
    message: "Book published successfully!",
    book: newBook,
  });
});

const getAllBooksByGenre = catchAsync(async (req, res) => {
  const { genreId } = req.params;
  const books = await bookService.getBookByGenre(parseInt(genreId, 10));
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const getAllPublicBooks = catchAsync(async (req, res) => {
  const books = await bookService.getAllPublicBooks();

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const getBookById = catchAsync(async (req, res) => {
  const currentUserId = req.user?.userId;
  const book = await bookService.getBookById(req.params.bookId, currentUserId);

  res.status(200).json({
    success: true,
    data: book,
  });
});

const getBooksByAuthor = catchAsync(async (req, res) => {
  const currentUserId = req.user?.userId;
  const books = await bookService.getBooksByAuthor(req.params.authorId, currentUserId);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const updateBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const currentUserId = req.user.userId;
  const { title, description } = req.body;

  const updatedBook = await bookService.updateBook(
    bookId,
    currentUserId,
    title,
    description,
  );

  res.status(200).json({
    success: true,
    message: "Book successfully updated!",
    data: updatedBook,
  });
});

const deleteBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const currentUserId = req.user.userId;

  await bookService.deleteBook(bookId, currentUserId);

  res.status(200).json({
    success: true,
    message: "Book successfully deleted!",
  });
});

const updateBookStatus = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const currentUserId = req.user.userId;
  const { requestedStatus } = req.body;
  const updatedStatus = await bookService.updateBookStatus(
    bookId,
    currentUserId,
    requestedStatus,
  );

  res.status(200).json({
    success: true,
    message: `Book successfully updated to ${requestedStatus}!`,
    data: updatedStatus,
  });
});


const launchBook = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const currentUserId = req.user.userId;
  const { chapterPrices } = req.body;

  const launched = await bookService.launchBook(bookId, currentUserId, chapterPrices);

  res.status(200).json({
    success: true,
    message: "Book launched successfully!",
    data: launched,
  });
});

const updateBookCover = catchAsync(async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const coverImage = req.file.path;
  const currentUserId = parseInt(req.user.userId);
  const updatedBook = await bookService.updateBookCover(bookId, coverImage, currentUserId);
  res.status(200).json({
    success: true,
    message: "Book cover successfully updated!",
    data: updatedBook,
  });
});

const getTrendingBooks = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const books = await bookService.getTrendingBooks(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

module.exports = {
  createBook,
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  updateBook,
  deleteBook,
  getAllBooksByGenre,
  updateBookStatus,
  updateBookCover,
  getTrendingBooks,
  launchBook,
};
