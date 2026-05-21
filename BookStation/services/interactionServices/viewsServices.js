const { setSourceMapsSupport } = require("module");
const prisma = require("../../db");
const checkGuest = require("../../utils/checkGuest");
const unauthorizedError = require("../../errors/unauthorizedError");

const addView = async (bookId, currentUserId) => {
  const checkIfGuest = await checkGuest.isGuest(currentUserId);
  const parsedBookId = parseInt(bookId);
  try {
    //check if the current user is a guest
    if (checkIfGuest.isGuest) {
      return false;
    }
    //check if a view row already exists for this user and book
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
      return true;
    }

  } catch (err) {
    console.error("Error in addView service:", err);
    throw err;
  }
};


const getViews = async (bookId) => { //this is for one book
  try {
    //count the rows where bookId to find view count
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


//this service is no longer being used can be removed
const getMostViewedBook = async () => {
  try {
    const book = await prisma.books.findFirst({
      orderBy: {
        views: {
          _count: "desc",
        },
      },
      select: { id: true },
    });
    return book ? book.id : null;
  } catch (err) {
    console.error("Error fetching most viewed book:", err);
  }

}

module.exports = {
  addView,
  getViews,
  getMostViewedBook,
};
