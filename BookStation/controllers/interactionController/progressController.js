const progressServices = require('../../services/interactionServices/progressServices');
const catchAsync = require('../../middlewares/catchAsync');

const updateProgress = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const { bookId, chapterId } = req.params;

  const progress = await progressServices.upsertProgress(currentUserId, bookId, chapterId);

  res.status(200).json({
    success: true,
    message: "Reading progress saved.",
    data: progress
  });
});

const getProgress = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const { bookId } = req.params;

  const progress = await progressServices.getProgressByBook(currentUserId, bookId);

  res.status(200).json({
    success: true,
    data: progress 
  });
});

module.exports = {
  updateProgress,
  getProgress
};