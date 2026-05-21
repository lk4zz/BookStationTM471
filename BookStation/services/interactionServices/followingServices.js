const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");
const notificationsServices = require("../notificationsServices");

// NOTE: follow and unfollow can be combined into one service by checking
// for exisitng follow and doing the deletion or the creation based on the result
// do it later save time for now

const follow = async (currentUserId, authorId) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  //fetch the author to follow
  const author = await prisma.user.findUnique({
    where: { id: parsedAuthorId },
  });

  if (!author) {
    throw new NotFoundError("AUTHOR NOT FOUND.");
  }

  if (parsedCurrentUserId === authorId) {
    throw new ForbiddenError("YOU CANNOT FOLLOW YOURSELF.");
  }

  //fetch existing follow row if already exists
  const existingFollow = await prisma.followers.findFirst({
    where: {
      followerId: parsedCurrentUserId,
      followingId: parsedAuthorId,
    },
  });

  // check if exisiting follow row exists (unfollow deletes it)
  if (existingFollow) {
    throw new ForbiddenError(`YOU ALREADY FOLLOW ${author.name}`);
  }

  //fetch the follower (current user trying to follow)
  const follower = await prisma.user.findUnique({
    where: { id: parsedCurrentUserId },
    select: { name: true },
  });

  //create follow row
  await prisma.followers.create({
    data: {
      followerId: parsedCurrentUserId,
      followingId: parsedAuthorId,
    },
  });

  //create a notificaiton for the author being followed
  const title = "New follower"
  const message = `${follower.name} has just followed you.`
  await notificationsServices.createNotification(parsedAuthorId, title, message)
  return { authorName: author.name };
};

const unfollow = async (currentUserId, authorId) => {
  //fetch the author
  const author = await prisma.user.findUnique({
    where: {
      id: parseInt(authorId),
    },
  });

  if (!author) {
    throw new NotFoundError("AUTHOR NOT FOUND.");
  }

  //check of exisiting follow
  const existingFollow = await prisma.followers.findFirst({
    where: {
      followerId: currentUserId,
      followingId: parseInt(authorId),
    },
  });

  if (!existingFollow) {
    throw new BadRequestError(`YOU ALREADY DONT FOLLOW ${author.name}}.`);
  }

  //delete follow rate
  await prisma.followers.delete({
    where: {
      followerId_followingId: {
        followerId: parseInt(currentUserId),
        followingId: parseInt(authorId),
      },
    },
  });
  return { authorName: author.name };
};


const followStatus = async (currentUserId, authorId) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  //fetch the follow row if exists
  const following = await prisma.followers.findFirst({
    where: {
      followerId: parsedCurrentUserId,
      followingId: parsedAuthorId,
    },
  });

  //check the status (existing row means true there is a follow and the opposite means no follow)
  if (following) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  follow,
  unfollow,
  followStatus,
};
