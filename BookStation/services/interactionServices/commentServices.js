const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const NotFoundError = require("../../errors/NotFoundError");

const commentOnBook = async (bookId, currentUserId, comment) => {
  if (!comment || comment.trim().length === 0) {
    throw new BadRequestError("COMMENT CANNOT BE EMPTY STRING");
  }

  const newComment = await prisma.comments.create({
    data: {
      bookId: parseInt(bookId),
      userId: currentUserId,
      comment: comment,
    },
  });
  return newComment;
};

const getCommentsByBook = async (bookId) => {
  const comments = await prisma.comments.findMany({
    where: {
      bookId: parseInt(bookId),
    },
    include: {
      commenter: true,
    },
  });
  if (!comments) {
    throw new NotFoundError("THIS BOOK HAS NO COMMENTS.");
  }
  return comments;
};

const deleteComment = async (commentId, currentUserId) => {
  const comment = await prisma.comments.findUnique({
    where: {
      id: parseInt(commentId),
    },
  });
  if (!comment) {
    throw new NotFoundError("COMMENT NOT FOUND");
  }
  if (comment.userId !== currentUserId) {
    throw new ForbiddenError("YOU ARE NOT THE OWNER OF THIS COMMENT.");
  }
  await prisma.comments.delete({
    where: {
      id: parseInt(commentId),
    },
  });
  return true;
};

module.exports = {
  commentOnBook,
  getCommentsByBook,
  deleteComment,
};
