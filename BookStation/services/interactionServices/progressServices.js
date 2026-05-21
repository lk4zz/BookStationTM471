const prisma = require("../../db");

//note: this progress service is basic and limited to chapters and not page scrolling
const upsertProgress = async (userId, bookId, chapterId) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedBookId = parseInt(bookId, 10);
  const parsedChapterId = parseInt(chapterId, 10);

  // upsert (update or insert) progress
  const progress = await prisma.readingProgress.upsert({
    where: {
      userId_bookId: { 
        userId: parsedUserId,
        bookId: parsedBookId,
      }
    },
    update: {
      lastChapterId: parsedChapterId,
    },
    create: {
      userId: parsedUserId,
      bookId: parsedBookId,
      lastChapterId: parsedChapterId,
    }
  });

  return progress;
};

const getProgressByBook = async (userId, bookId) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedBookId = parseInt(bookId, 10);

  //fetch the progress if existed
  const progress = await prisma.readingProgress.findUnique({
    where: {
      userId_bookId: {
        userId: parsedUserId,
        bookId: parsedBookId,
      }
    }
  });
  
  return progress; // return null if user havent started reading
};

module.exports = {
  upsertProgress,
  getProgressByBook
};