const followingServices = require("../services/followingServices");
const catchAsync = require("../middlewares/catchAsync");

const follow = catchAsync(async (req, res) => {
  const { authorId } = req.params;
  const currentUserId = req.user.userId;
  const {authorName} = await followingServices.follow(currentUserId, authorId);

  res.status(200).json({
    success: true,
    message: `You are now following ${authorName}`,
  });
});

const unfollow = catchAsync(async (req, res) => {
  const followerId = req.user.userId;
  const { followedId } = req.params;
  const {authorName} = await followingServices.unfollow(followerId, followedId);
  res.status(200).json({
    success: true,
    message: `You are no longer following ${authorName}`,
  });
});

module.exports = {
  follow,
  unfollow,
};
