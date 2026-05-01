const bookService = require("../../services/booksServices/userBookServices"); //import service
const catchAsync = require('../../middlewares/catchAsync');


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


const getTrendingBooks = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12; 
  
  const books = await bookService.getTrendingBooks(limit);
  
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const getHighEngagementBooks = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 25;
  
  const books = await bookService.getHighEngagementBooks(limit);
  
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

const getFollowedAuthorsBooks = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const limit = 25;
  
  const books = await bookService.booksByFollowedAuthors(currentUserId, limit);

  res.status(200).json({
    success: true,
    books,
  });
});

module.exports = {
  getAllPublicBooks,
  getBookById,
  getBooksByAuthor,
  getAllBooksByGenre,
  getTrendingBooks,
  getFollowedAuthorsBooks,
  getHighEngagementBooks,
};
