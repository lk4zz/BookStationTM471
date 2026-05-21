const prisma = require("../db");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const unauthroizedError = require("../errors/unauthorizedError");
const accessDetector = require("../utils/accessDetectors/chapterAccessDetector");
const { getOwnedBook } = require("../utils/BookOwnership");
const { pageChunking } = require("../utils/AIUtils/vectorUtils/pageChunking");
const { checkEditAccess, checkChapterEditAccess } = require("../utils/accessDetectors/checkEditAccess");

const getPagesByChapter = async (chapterId, currentUserId, currentUserRoleId = null) => {
  //check user access to the chapter before fetching pages
  const accessData = await accessDetector.checkAccess(chapterId, currentUserId, currentUserRoleId);

  //if user doesnt have access check the reason
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

  //fetch the pages if user has access
  const pagesByChapter = await prisma.pages.findMany({
    where: { chapterId: parseInt(chapterId, 10) },
    orderBy: { pageNum: "asc" },
  });

  //check if the chapter has pages 
  if (pagesByChapter.length === 0) {
    throw new NotFoundError("THIS CHAPTER HAS NO PAGES.");
  }

  return {
    pages: pagesByChapter,
    hasAccess: accessData.hasAccess,
  };
};

//same as get pages but allows author to see chapters with empty/no page for UI reasons
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
  const parsedChapterId = parseInt(chapterId, 10);

  //validate id
  if (isNaN(parsedChapterId)) {
    throw new Error("Invalid chapter ID provided.");
  }

  //logic check, exit early
const chapter = await prisma.chapters.findUnique({
  where: { id: parsedChapterId },
  select: {
    bookId: true,
    isPublished: true,
    title: true, // Grab the chapter title
    book: {
      select: {
        name: true, // Grab the book name
        author: {
          select: {
            name: true, // Grab the author name
          }
        }
      }
    }
  }
});

  if (!chapter) {
    throw new NotFoundError("CHAPTER NOT FOUND");
  }

  //ownership and edit access detectors
  const { book } = await getOwnedBook(chapter.bookId, currentUserId);
  await checkEditAccess(book);
  await checkChapterEditAccess(chapter);

  //check if page exists
  const existingPage = await prisma.pages.findFirst({
    where: { chapterId: parsedChapterId },
    select: { id: true }
  });

  let savedPage; // store the final result here


  //create if page 1 (holds all the content) doesnt exist then create
  if (!existingPage) {
    savedPage = await prisma.pages.create({
      data: {
        chapterId: parsedChapterId,
        text,
        pageNum: 1,
      },
    });
  } 
  // if it exists update
  // note: didnt use upsert here originally because multiple pages were supposed to be made 
  // however after sticking to one unique page for all the content this should be switched to upsert 
  else {
    savedPage = await prisma.pages.update({
      where: { id: existingPage.id },
      data: {
        text,
        pageNum: 1,
      },
    });
  }

  // chunk the pages using the chunking method to store in db and embed later
  void pageChunking(parsedChapterId, text, currentUserId, savedPage.id, chapter).catch((err) => {
   //log error for debuggins
    console.error("[pageChunking] background job failed:", err);
  });


  return savedPage;
};

module.exports = {
  getPagesByChapter,
  getPagesForAuthor,
  upsertPrimaryPage,
};
