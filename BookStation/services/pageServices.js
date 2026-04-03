const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetector");
const { getOwnedBook } = require("../utils/BookOwnership");
const ChunkingService = require("./ChunkingService");
const EmbeddingService = require("./EmbeddingService");

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

  let targetPageId;

  if (existing.length === 0) {
    const newPage = await prisma.pages.create({
      data: {
        chapterId: parseInt(chapterId, 10),
        text,
        pageNum: 1,
      },
    });
    targetPageId = newPage.id;
  } else {
    const primary = existing.find((p) => p.pageNum === 1) ?? existing[0];
    const updated = await prisma.pages.update({
      where: { id: primary.id },
      data: { text, pageNum: 1 },
    });
    targetPageId = updated.id;

    const extras = existing.filter((p) => p.id !== primary.id);
    if (extras.length > 0) {
      await prisma.pages.deleteMany({
        where: { id: { in: extras.map((p) => p.id) } },
      });
    }
  }

  // RAG INTEGRATION CHUNK AND EMBED ---
  
  // 1 vlear out the old chunks for this specific page
  await prisma.pageChunk.deleteMany({
      where: { pageId: targetPageId }
  });

  // 2 turn the raw HTML into clean, overlapping text chunks
  const chunks = ChunkingService.chunkTipTapContent(text);

  // 3 if there is text, embed it locally and save to the database
  if (chunks.length > 0) {
      const chunkData = [];
      
      // generate embeddings for each chunk
      for (const chunk of chunks) {
          const vector = await EmbeddingService.generateEmbedding(chunk);
          chunkData.push({
              content: chunk,
              embedding: vector,
              pageNumber: 1, // because this is the only page fiya text
              pageId: targetPageId,
              chapterId: parseInt(chapterId, 10),
              bookId: chapter.book.id,
              userId: currentUserId
          });
      }

      // Bulk insert the new chunks into MySQL
      await prisma.pageChunk.createMany({
          data: chunkData
      });
  }

  return prisma.pages.findUnique({ where: { id: targetPageId }});
};

module.exports = {
  createPage,
  getPagesByChapter,
  getPagesForAuthor,
  upsertPrimaryPage,
  updatePage,
  deletePage,
};
