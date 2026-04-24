const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");

const follow = async (currentUserId, authorId) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const author = await prisma.user.findUnique({
    where: { id: parsedAuthorId },
  });

  if (!author) {
    throw new NotFoundError("AUTHOR NOT FOUND.");
  }

  if (currentUserId === authorId) {
    throw new ForbiddenError("YOU CANNOT FOLLOW YOURSELF.");
  }

  const existingFollow = await prisma.followers.findFirst({
    where: {
      followerId: currentUserId,
      followingId: parsedAuthorId,
    },
  });

  if (existingFollow) {
    throw new ForbiddenError(`YOU ALREADY FOLLOW ${author.name}`);
  }

  await prisma.followers.create({
    data: {
      followerId: currentUserId,
      followingId: parsedAuthorId,
    },
  });
  return {authorName: author.name};
};

const unfollow = async (currentUserId, authorId) => {
  //followerId is currentUserId
  const author = await prisma.user.findUnique({
    where: {
      id: parseInt(authorId),
    },
  });

  if (!author) {
    throw new NotFoundError("AUTHOR NOT FOUND.");
  }

  const existingFollow = await prisma.followers.findFirst({
    where: {
      followerId: currentUserId,
      followingId: parseInt(authorId),
    },
  });

  if (!existingFollow) {
    throw new BadRequestError(`YOU ALREADY DONT FOLLOW ${author.name}}.`);
  }

  await prisma.followers.delete({
    where: {
      followerId_followingId: {
        followerId: parseInt(currentUserId),
        followingId: parseInt(authorId),
      },
    },
  });
  return {authorName: author.name};
};


const followStatus = async (currentUserId, authorId) => {
  const parsedAuthorId = parseInt(authorId, 10);
  const parsedCurrentUserId = parseInt(currentUserId, 10);

  const following = await prisma.followers.findFirst({
    where: {
      followerId: parsedCurrentUserId,
      followingId: parsedAuthorId,
    },
  });

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
