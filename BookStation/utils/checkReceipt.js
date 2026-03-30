const prisma = require("../db");
const ForbiddenError = require("../errors/ForbiddenError");

const checkBookReceipts = async (bookId) => {
  const chapters = await prisma.chapters.findMany({
    where: { bookId: parseInt(bookId) },
  });

  const chapterIds = chapters.map((chapters) => chapters.id);

  const receipt = await prisma.chapterUnlocks.findFirst({
    where: {
      chapterId: { in: chapterIds },
    },
  });
  if (receipt) {
  throw new ForbiddenError("THIS BOOK HAS BOUGHT CHAPTERS ALREADY CANNOT DRAFT NOR DELETE");
  }
};

const checkChapterRreceipt = async (chapterId) => {

    const receipt = await prisma.chapterUnlocks.findFirst({
        where: {chapterId: parseInt(chapterId)}
    })
    if (receipt) {
        return next(new ForbiddenError("THIS CHAPTER HAS PAYMENT RECEIPTS CANNOT DELETE"));
    }
}

module.exports = {
    checkBookReceipts,
    checkChapterRreceipt
}