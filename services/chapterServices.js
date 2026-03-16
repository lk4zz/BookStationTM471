const prisma = require("../db");
const { validateChapterPricing } = require("../utils/pricingHelper");
const accessDetector = require("../utils/accessDetector");
const { BookOwnership } = require("../utils/BookOwnership");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const PaymentRequiredError = require("../errors/PaymentRequiredError");

const createChapter = async (bookId, title, currentUserId) => {
  BookOwnership(bookId, currentUserId);

  const lastChapter = await prisma.chapters.findFirst({
    where: { bookId: parseInt(bookId, 10) },
    orderBy: { chapterNum: "desc" },
  });

  const chapterNumber = lastChapter ? lastChapter.chapterNum + 1 : 1;

  const newChapter = await prisma.chapters.create({
    data: {
      bookId: parseInt(bookId, 10),
      title: title,
      chapterNum: chapterNumber,
    },
  });

  return newChapter;
};

const getChaptersByBook = async (bookId, currentUserId) => {
  //fetch book
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId, 10) },
  });

  if (!book) throw new NotFoundError("Book not found");
  if (book.status === "DRAFT")
    throw new NotFoundError("This book is not public.");

  // fetch all published chapters for this book
  const chapters = await prisma.chapters.findMany({
    where: {
      bookId: parseInt(bookId, 10),
      isPublished: true,
    },
    orderBy: { chapterNum: "asc" },
    include: {
      book: true,
    },
  });

  if (chapters.length === 0)
    throw new NotFoundError("No published chapters found for this book.");

  // promise.all allows javaScript to send all the queries at the same time to the DB this way you save a lot of time instead of waiting for each check sequentially
  const decoratedChapters = await Promise.all(
    chapters.map(async (chapter) => {
      // send each chapter to the function at the same time
      const accessData = await accessDetector.checkAccess(
        chapter.id,
        currentUserId,
      );

      // return each chapter with access state
      return {
        ...chapter,
        hasAccess: accessData.hasAccess,
      };
    }),
  );

  return decoratedChapters;
};

const getChapterById = async (chapterId, userId) => {
  // fetch the chapter through access function
  const accessData = await accessDetector.checkAccess(
    parseInt(chapterId, 10),
    userId,
  );

  if (!accessData || !accessData.chapter) {
    throw new NotFoundError("Chapter not found or not published.");
  }

  const chapter = accessData.chapter;

  return {
    chapter,
    hasAccess: accessData.hasAccess,
  };
};

const updateChapter = async (
  chapterId,
  title,
  currentUserId,
  requestedPrice,
) => {
  // fetch the chapter include book (for ownership), include pages (for the function to calculate)
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true, pages: true },
  });

  if (!chapter) throw new NotFoundError("Chapter not found");
  BookOwnership(chapter.book.id, currentUserId);

  // default values in case they only want to update the title
  let finalPrice = chapter.price;
  let finalIsLocked = chapter.isLocked;
  let finalWordCount = chapter.wordCount;

  if (requestedPrice !== undefined) {
    if (chapter.isPublished) {
      // check for price constraints
      const pricingData = validateChapterPricing(
        chapter.pages,
        requestedPrice,
        chapter.chapterNum,
      );
      finalPrice = pricingData.finalPrice;
      finalIsLocked = pricingData.isLocked;
      finalWordCount = pricingData.wordCount; // update word count just incase user edits texts
    } else {
      // It's a draft. Just save the intended price for now, it will be validated on publish.
      finalPrice = parseInt(requestedPrice, 10);
      if (chapter.chapterNum === 1) finalPrice = 0;
      finalIsLocked = finalPrice > 0;
    }
  }

  const updatedChapter = await prisma.chapters.update({
    where: { id: parseInt(chapterId, 10) },
    data: {
      title: title !== undefined ? title : chapter.title, // keep old title if not provided
      price: finalPrice,
      isLocked: finalIsLocked,
      wordCount: finalWordCount,
    },
  });

  return updatedChapter;
};

const publishChapter = async (chapterId, currentUserId, requestedPrice) => {
  // fetch chapter, book, and pages
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true, pages: true },
  });

  if (!chapter) throw new NotFoundError("Chapter not found");
  if (chapter.isPublished)
    throw new BadRequestError("Chapter is already published");

  BookOwnership(chapter.book.id, currentUserId);

  // if no price is requested, fall back to drafted price
  const priceToValidate = requestedPrice ?? chapter.price;

  // 2. Run the Health Inspector Check!
  const { finalPrice, isLocked, wordCount } = validateChapterPricing(
    chapter.pages,
    priceToValidate,
    chapter.chapterNum,
  );

  const publishedChapter = await prisma.chapters.update({
    where: { id: parseInt(chapterId, 10) },
    data: {
      isPublished: true,
      price: finalPrice,
      isLocked: isLocked,
      wordCount: wordCount,
    },
  });

  return publishedChapter;
};

const unlockChapter = async (userId, chapterId) => {
  const parsedChapterId = parseInt(chapterId, 10);
  const parsedUserId = parseInt(userId, 10);

  // access function and fetch chapters
  const accessData = await accessDetector.checkAccess(
    parsedChapterId,
    parsedUserId,
  );

  if (accessData.hasAccess) {
    throw new BadRequestError("You already have access to this chapter.");
  }

  // fetch user to check wallet
  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
  });

  if (!user) throw new NotFoundError("User not found, please log in.");

  // check wallet
  if (user.coinBalance < accessData.chapter.price) {
    throw new PaymentRequiredError(
      "You do not have enough coins to unlock this chapter.",
    );
  }

  // transaction function does the two functions simultaneously to make sure no mistakes happen if the server crashes
  const [updatedUserWallet, receipt] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { coinBalance: { decrement: accessData.chapter.price } },
    }),
    prisma.chapterUnlocks.create({
      data: { userId: user.id, chapterId: accessData.chapter.id },
    }),
  ]);

  return { updatedUserWallet, receipt };
};

const deleteChapter = async (chapterId, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true },
  });
  if (!chapter) throw new NotFoundError("Chapter not found");
  BookOwnership(chapter.book.id, currentUserId);

  await prisma.chapters.delete({
    where: { id: parseInt(chapterId, 10) },
  });

  const remainingChapters = await prisma.chapters.findMany({
    where: { bookId: chapter.bookId },
    orderBy: { chapterNum: "asc" },
  });

  const updates = remainingChapters.map((ch, index) => {
    return prisma.chapters.update({
      where: { id: ch.id },
      data: { chapterNum: index + 1 },
    });
  });

  await prisma.$transaction(updates);

  return true;
};

module.exports = {
  createChapter,
  getChaptersByBook,
  getChapterById,
  updateChapter,
  publishChapter,
  deleteChapter,
  unlockChapter,
};
