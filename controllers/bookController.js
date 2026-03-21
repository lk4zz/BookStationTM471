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

const getDraftedPrivateBooks = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const books = await bookService.getDraftedPrivateBooks(currentUserId);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const getBookById = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);

  res.status(200).json({
    success: true,
    data: book,
  });
});

const getBooksByAuthor = catchAsync(async (req, res) => {
  const books = await bookService.getBooksByAuthor(req.params.authorId);

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


module.exports = {
  createBook,
  getDraftedPrivateBooks,
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  updateBook,
  deleteBook,
  getAllBooksByGenre,
  updateBookStatus,
  updateBookCover,
};
