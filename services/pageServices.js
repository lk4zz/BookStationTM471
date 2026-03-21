const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetector");
const { BookOwnership } = require("../utils/BookOwnership");

const createPage = async (chapterId, text, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId) },
    include: { book: true },
  });
  BookOwnership(chapter.book.id, currentUserId);
  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  const lastPage = await prisma.pages.findFirst({
    where: { chapterId: parseInt(chapterId) },
    orderBy: { pageNum: "desc" },
  });

  const pageNumber = lastPage ? lastPage.pageNum + 1 : 1;

  const newPage = await prisma.pages.create({
    data: {
      chapterId: parseInt(chapterId),
      text: text,
      pageNum: pageNumber,
    },
  });

  return newPage;
};

const updatePage = async (text, currentUserId, pageId) => {
  const page = await prisma.pages.findUnique({
    where: { id: parseInt(pageId) },
    include: { chapter: { include: { book: true } } },
  });
  BookOwnership(page.chapter.book.id, currentUserId);
  if (!page.chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }
  if (!page) {
    throw new NotFoundError("PAGE NOT FOUND");
  }

  const updatedPage = await prisma.pages.update({
    where: { id: parseInt(pageId) },
    data: {
      chapterId: parseInt(chapterId),
      text: text,
    },
  });

  return updatedPage;
};

const getPagesByChapter = async (chapterId, currentUserId) => {
  //use access function to fetch chapter and access state
  const accessData = await accessDetector.checkAccess(chapterId, currentUserId);
  //check access
  if (!accessData.hasAccess) {
    switch (accessData.reason) {
      case "not_found":
        throw new NotFoundError("CHAPTER NOT FOUND");
      case "not_published":
        throw new ForbiddenError("CHAPTER IS NOT PUBLISHED YET");
      case "Login_required":
        throw new unauthroizedError("LOGIN REQUIRED");
      case "forbidden":
        throw new ForbiddenError("CHAPTER LOCKED");
      default:
        throw new Error("UNKNOWN ACCESS ERROR");
    }
  }
  //fetch pages
  const pagesByChapter = await prisma.pages.findMany({
    where: { chapterId: parseInt(chapterId) },
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

const deletePage = async (pageId, currentUserId) => {
  const page = await prisma.pages.findUnique({
    where: { id: parseInt(pageId) },
    include: {
      chapter: {
        include: {
          book: true,
        },
      },
    },
  });
  if (!page) {
    throw new NotFoundError("PAGE NOT FOUND");
  }
  BookOwnership(page.chapter.book.id, currentUserId);

  await prisma.pages.delete({
    where: { id: parseInt(pageId) },
  });
  const remainingPages = await prisma.pages.findMany({
    where: { chapterId: page.chapterId },
    orderBy: { pageNum: "asc" },
  });

  for (let i = 0; i < remainingPages.length; i++) {
    const correctPageNum = i + 1;

    await prisma.pages.update({
      where: {
        id: remainingPages[i].id,
      },
      data: {
        pageNum: correctPageNum,
      },
    });
  }
  return true;
};

module.exports = {
  createPage,
  getPagesByChapter,
  updatePage,
  deletePage,
};
