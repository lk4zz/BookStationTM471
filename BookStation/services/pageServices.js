const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetector");
const { getOwnedBook } = require("../utils/BookOwnership");
const { pageChunking } = require("../utils/AIUtils/vectorUtils/pageChunking");
const { checkEditAccess, checkChapterEditAccess } = require("../utils/checkEditAccess");

const getPagesByChapter = async (chapterId, currentUserId) => {
  const accessData = await accessDetector.checkAccess(chapterId, currentUserId);
  if (!accessData.hasAccess) {
    switch (accessData.reason) {
      case "not_found":
        throw new NotFoundError("CHAPTER NOT FOUND");
      case "not_published":
        throw new ForbiddenError("CHAPTER IS NOT PUBLISHED YET");
      case "Login_required":
        throw new unauthroizedError("LOGIN REQUIRED");
      case "forbidden":
      case "payment_required":
        throw new ForbiddenError("CHAPTER LOCKED");
      default:
        throw new ForbiddenError("CHAPTER LOCKED");
    }
  }
  const pagesByChapter = await prisma.pages.findMany({
    where: { chapterId: parseInt(chapterId, 10) },
    orderBy: { pageNum: "asc" },
  });

  if (pagesByChapter.length === 0) {
    throw new NotFoundError("THIS CHAPTER HAS NO PAGES.");
  }

  return {
    pages: pagesByChapter,
    hasAccess: accessData.hasAccess,
  };
};

/** Author-only: same as reader access for owners, but allows empty pages for the writing UI. */
const getPagesForAuthor = async (chapterId, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true },
  });

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  await getOwnedBook(chapter.book.id, currentUserId);

  const pagesByChapter = await prisma.pages.findMany({
    where: { chapterId: parseInt(chapterId, 10) },
    orderBy: { pageNum: "asc" },
  });

  return {
    pages: pagesByChapter,
    hasAccess: true,
  };
};

const upsertPrimaryPage = async (chapterId, text, currentUserId) => {
  // 1. The Bouncer: Validate the ID immediately
  const parsedChapterId = parseInt(chapterId, 10);
  if (isNaN(parsedChapterId)) {
    throw new Error("Invalid chapter ID provided.");
  }

  // 2. Fast-fail validation
  const chapter = await prisma.chapters.findUnique({
    where: { id: parsedChapterId },
    select: {
      bookId: true,
      isPublished: true,
    }
  });

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  const { book } = await getOwnedBook(chapter.bookId, currentUserId);
  await checkChapterEditAccess(chapter);

  const existingPage = await prisma.pages.findFirst({
    where: { chapterId: parsedChapterId },
    select: { id: true }
  });

  let savedPage; // We will store the final result here

  if (!existingPage) {
    savedPage = await prisma.pages.create({
      data: {
        chapterId: parsedChapterId,
        text,
        pageNum: 1,
      },
    });
  } else {
    savedPage = await prisma.pages.update({
      where: { id: existingPage.id },
      data: {
        text,
        pageNum: 1,
      },
    });
  }

  void pageChunking(parsedChapterId, text, currentUserId, savedPage.id, chapter).catch((err) => {
    console.error("[pageChunking] background job failed:", err);
  });


  return savedPage;
};

module.exports = {
  getPagesByChapter,
  getPagesForAuthor,
  upsertPrimaryPage,
};
