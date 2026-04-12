const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetector");
const { getOwnedBook } = require("../utils/BookOwnership");
const { pageChunking } = require("../utils/pageChunking");
const { checkEditAccess } = require("../utils/checkEditAccess");

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

const deletePage = async (pageId, currentUserId) => {
  const page = await prisma.pages.findUnique({
    where: { id: parseInt(pageId, 10) },
    select: {
      id: true,
      chapterId: true,
      pageNum: true,
      chapter: {
        select: {
          bookId: true,
        },
      }

    }
  });

  if (!page) {
    throw new NotFoundError("PAGE NOT FOUND");
  }
  const { book } = await getOwnedBook(page.chapter.bookId, currentUserId);
  await checkEditAccess(book);

  await prisma.pages.delete({
    where: { id: parseInt(pageId, 10) },
  });

  await prisma.pages.updateMany({  //might need to remove later since content is only in page 1
    where: {
      chapterId: page.chapterId,
      pageNum: { gt: page.pageNum }
    },
    data: {
      pageNum: { decrement: 1 }
    }
  });

  return true;
};


const upsertPrimaryPage = async (chapterId, text, currentUserId) => {
  const parsedChapterId = parseInt(chapterId, 10);

  const chapter = await prisma.chapters.findUnique({
    where: { id: parsedChapterId },
    select: { bookId: true }
  });

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  const { book } = await getOwnedBook(chapter.bookId, currentUserId);
  await checkEditAccess(book);

  // Find existing page (only one should exist)
  const existingPage = await prisma.pages.findFirst({
    where: { chapterId: parsedChapterId },
  });

  let targetPageId;

  if (!existingPage) {
    const newPage = await prisma.pages.create({
      data: {
        chapterId: parsedChapterId,
        text,
        pageNum: 1,
      },
    });
    targetPageId = newPage.id;

  } else {
    const updated = await prisma.pages.update({
      where: { id: existingPage.id },
      data: {
        text,
        pageNum: 1,
      },
    });
    targetPageId = updated.id;
  }

  await pageChunking(chapterId, text, currentUserId, targetPageId, chapter);

  return prisma.pages.findUnique({ where: { id: targetPageId } });
};

module.exports = {
  getPagesByChapter,
  getPagesForAuthor,
  upsertPrimaryPage,
  deletePage,
};
