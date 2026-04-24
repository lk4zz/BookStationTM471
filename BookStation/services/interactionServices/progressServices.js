const prisma = require("../../db");

const upsertProgress = async (userId, bookId, chapterId) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedBookId = parseInt(bookId, 10);
  const parsedChapterId = parseInt(chapterId, 10);

  // Upsert: Update if exists, Create if it doesn't.
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

  const progress = await prisma.readingProgress.findUnique({
    where: {
      userId_bookId: {
        userId: parsedUserId,
        bookId: parsedBookId,
      }
    }
  });
  
  return progress; // return null if they haven't started reading
};

module.exports = {
  upsertProgress,
  getProgressByBook
};