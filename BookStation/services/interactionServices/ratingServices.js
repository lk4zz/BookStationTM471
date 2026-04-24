const prisma = require("../../db");
const checkGuest = require("../../utils/checkGuest");
const BadRequestError = require("../../errors/BadRequestError");
const { addRatingTasteBlender } = require("../../utils/AlgorithmTasteBlenders/RatingTasteBlender")

const addOrUpdateRating = async (bookId, currentUserId, value) => {
  const checkIfGuest = await checkGuest.isGuest(currentUserId);
  const parsedUserId = parseInt(currentUserId);
  const parsedBookId = parseInt(bookId);
  const parsedValue = parseFloat(value);

  if (checkIfGuest.isGuest) {
    throw new BadRequestError("Guests cannot rate books");
  }

  if (parsedValue < 0.5 || parsedValue > 5) {
    throw new BadRequestError("Rating must be between 0.5 and 5");
  }

  const rating = await prisma.rating.upsert({
    where: {
      userId_bookId: {
        userId: parsedUserId,
        bookId: parsedBookId,
      },
    },
    update: { value: parsedValue },
    create: {
      userId: parsedUserId,
      bookId: parsedBookId,
      value: parsedValue,
    },
  });

  addRatingTasteBlender(parsedUserId, parsedBookId);

  return rating;
};

const getRatingStats = async (bookId) => {
  const parsedBookId = parseInt(bookId);

  const aggregate = await prisma.rating.aggregate({
    where: { bookId: parsedBookId },
    _avg: { value: true },
    _count: { value: true },
  });

  return {
    ratingAverage: aggregate._avg.value || 0,
    ratingCount: aggregate._count.value || 0,
  };
};

const getUserRating = async (bookId, userId) => {
  const parsedBookId = parseInt(bookId);

  const rating = await prisma.rating.findUnique({
    where: {
      userId_bookId: {
        userId: userId,
        bookId: parsedBookId,
      },
    },
  });

  return rating ? rating.value : null;
};

const deleteRating = async (bookId, currentUserId) => {
  const parsedBookId = parseInt(bookId);

  await prisma.rating.delete({
    where: {
      userId_bookId: {
        userId: currentUserId,
        bookId: parsedBookId,
      },
    },
  });

  return true;
};

module.exports = {
  addOrUpdateRating,
  getRatingStats,
  getUserRating,
  deleteRating,
};
