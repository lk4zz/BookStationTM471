const ratingServices = require('../../services/interactionServices/ratingServices');
const catchAsync = require('../../middlewares/catchAsync');
const BadRequestError = require('../../errors/BadRequestError');

const addOrUpdateRating = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const { rating } = req.body;
  const currentUserId = req.user.userId;

  const newRating = await ratingServices.addOrUpdateRating(bookId, currentUserId, rating);

  res.status(200).json({
    success: true,
    message: "Rating saved successfully",
    data: newRating,
  });
});

const getRatingStats = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const stats = await ratingServices.getRatingStats(bookId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

const getUserRating = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const currentUserId = req.user.userId;

  const userRating = await ratingServices.getUserRating(bookId, currentUserId);

  res.status(200).json({
    success: true,
    data: { userRating },
  });
});

const deleteRating = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const currentUserId = req.user.userId;

  await ratingServices.deleteRating(bookId, currentUserId);

  res.status(200).json({
    success: true,
    message: "Rating removed successfully",
  });
});

const getBatchRatingStats = catchAsync(async (req, res) => {
  const ids = Array.isArray(req.body?.bookIds) ? req.body.bookIds : [];
  if (ids.length > 200) {
    throw new BadRequestError("TOO_MANY_BOOK_IDS");
  }
  const data = await ratingServices.getBatchRatingStats(ids);
  res.status(200).json({ success: true, data });
});

module.exports = {
  addOrUpdateRating,
  getRatingStats,
  getUserRating,
  deleteRating,
  getBatchRatingStats,
};
