const followingServices = require("../../services/interactionServices/followingServices");
const catchAsync = require("../../middlewares/catchAsync");

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
  const { authorId } = req.params;
  const {authorName} = await followingServices.unfollow(followerId, authorId);
  res.status(200).json({
    success: true,
    message: `You are no longer following ${authorName}`,
  });
});

const followStatus = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const { authorId } = req.params;
  const isFollowing = await followingServices.followStatus(currentUserId, authorId);
  res.status(200).json({
    success: true,
    isFollowing,
  });
})

module.exports = {
  follow,
  unfollow,
  followStatus,
};
