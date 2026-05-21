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

  //upsert rating
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

  //change user taste depending on rating value
  addRatingTasteBlender(parsedUserId, parsedBookId);

  return rating;
};

const getRatingStats = async (bookId) => {
  const parsedBookId = parseInt(bookId);

  //using aggregate to grab rate counts and average of rating values
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

  //grab the user specific rating for UI
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
  const parsedUserId = parseInt(currentUserId);

  //delete the rating
  //this checks the ownership through the unique constraint
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

// this function grabs ratings for explore and landing pages to prevent multiple db requests
// and thus improve performance
const getBatchRatingStats = async (bookIds = []) => {

  //sanitize ids
  //remove duplicates
  //remove invalid numbers
  const ids = Array.isArray(bookIds)
    ? [...new Set(bookIds.map((v) => parseInt(v, 10)).filter(Number.isFinite))]
    : [];

  //return empty object if no valid ids exist
  if (ids.length === 0) return {};

  //group ratings by book id
  //grab average and total ratings for each book
  const grouped = await prisma.rating.groupBy({
    by: ["bookId"],
    where: { bookId: { in: ids } },
    _avg: { value: true },
    _count: { value: true },
  });

  const map = {};

  //default values for books with no ratings
  for (const id of ids) {
    map[id] = { ratingAverage: 0, ratingCount: 0 };
  }

  //replace defaults with real aggregated values
  for (const row of grouped) {
    map[row.bookId] = {
      ratingAverage: row._avg.value || 0,
      ratingCount: row._count.value || 0,
    };
  }

  return map;
};


module.exports = {
  addOrUpdateRating,
  getRatingStats,
  getUserRating,
  deleteRating,
  getBatchRatingStats,
};
