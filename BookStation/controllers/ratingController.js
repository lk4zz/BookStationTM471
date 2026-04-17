const ratingServices = require('../services/ratingServices');
const catchAsync = require('../middlewares/catchAsync');

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

module.exports = {
  addOrUpdateRating,
  getRatingStats,
  getUserRating,
  deleteRating,
};
