const { setSourceMapsSupport } = require("module");
const prisma = require("../db");
const checkGuest = require("../utils/checkGuest");
const unauthorizedError = require("../errors/unauthorizedError");

const addView = async (bookId, currentUserId) => {
  const checkIfGuest = await checkGuest.isGuest(currentUserId);
  const parsedBookId = parseInt(bookId);
  try {
    if (checkIfGuest.isGuest) {
      console.log(`guest views dont count`);
      return false;
    }
    const existingView = await prisma.bookViews.findFirst({
      where: {
        userId: currentUserId,
        bookId: parsedBookId,
      },
    });
    if (!existingView) {
      await prisma.bookViews.create({
        data: {
          userId: currentUserId,
          bookId: parsedBookId,
        },
      });
      console.log(
        `View successfully created for user ${currentUserId} on book ${parsedBookId}`,
      );
      return true;
    }

  } catch (err) {
    console.error("Error in addView service:", err);
    throw err;
  }
};


const getViews = async (bookId) => {
  try {
    const viewCount = await prisma.bookViews.count({
      where: {
        bookId: parseInt(bookId),
      },
    });

    return viewCount;
  } catch (error) {
    console.error("Error fetching views:", error);
    return 0;
  }
};

module.exports = {
  addView,
  getViews,
};
