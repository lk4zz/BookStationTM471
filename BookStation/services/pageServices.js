const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetector");
const { getOwnedBook } = require("../utils/BookOwnership");

const createPage = async (chapterId, text, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true },
  });

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  await getOwnedBook(chapter.book.id, currentUserId);

  const lastPage = await prisma.pages.findFirst({
    where: { chapterId: parseInt(chapterId, 10) },
    orderBy: { pageNum: "desc" },
  });

  const pageNumber = lastPage ? lastPage.pageNum + 1 : 1;

  const newPage = await prisma.pages.create({
    data: {
      chapterId: parseInt(chapterId, 10),
      text: text,
      pageNum: pageNumber,
    },
  });

  return newPage;
};

const updatePage = async (text, currentUserId, pageId) => {
  const page = await prisma.pages.findUnique({
    where: { id: parseInt(pageId, 10) },
    include: { chapter: { include: { book: true } } },
  });

  if (!page) {
    throw new NotFoundError("PAGE NOT FOUND");
  }

  await getOwnedBook(page.chapter.book.id, currentUserId);

  const updatedPage = await prisma.pages.update({
    where: { id: parseInt(pageId, 10) },
    data: {
      text: text,
    },
  });

  return updatedPage;
};

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

/** One chapter = one page (pageNum = 1). Creates or updates primary page and removes extras. */
const upsertPrimaryPage = async (chapterId, text, currentUserId) => {
  const chapter = await prisma.chapters.findUnique({
    where: { id: parseInt(chapterId, 10) },
    include: { book: true },
  });

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  await getOwnedBook(chapter.book.id, currentUserId);

  const existing = await prisma.pages.findMany({
    where: { chapterId: parseInt(chapterId, 10) },
    orderBy: { pageNum: "asc" },
  });

  if (existing.length === 0) {
    return prisma.pages.create({
      data: {
        chapterId: parseInt(chapterId, 10),
        text,
        pageNum: 1,
      },
    });
  }

  const primary = existing.find((p) => p.pageNum === 1) ?? existing[0];
  const updated = await prisma.pages.update({
    where: { id: primary.id },
    data: { text, pageNum: 1 },
  });

  const extras = existing.filter((p) => p.id !== primary.id);
  if (extras.length > 0) {
    await prisma.pages.deleteMany({
      where: { id: { in: extras.map((p) => p.id) } },
    });
  }

  return updated;
};

const deletePage = async (pageId, currentUserId) => {
  const page = await prisma.pages.findUnique({
    where: { id: parseInt(pageId, 10) },
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
  await getOwnedBook(page.chapter.book.id, currentUserId);

  await prisma.pages.delete({
    where: { id: parseInt(pageId, 10) },
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
  getPagesForAuthor,
  upsertPrimaryPage,
  updatePage,
  deletePage,
};
