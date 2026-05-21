const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const ForbiddenError = require("../../errors/ForbiddenError");
const { getOwnedBook } = require("../../utils/BookOwnership");
const { checkBookReceipts, checkChapterRreceipt } = require("../../utils/checkReceipt");
const { checkEditAccess, checkMetadataEditAccess } = require("../../utils/accessDetectors/checkEditAccess");
const { updateBookMasterEmbedding } = require("../../utils/AIUtils/vectorUtils/BookDataEmbedder");
const { validateChapterPricing } = require("../../utils/pricingHelper");


const createBook = async (title, description, authorId) => {
  normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, '');

  // grab all author books
  const books = await prisma.books.findMany({
    where: {
      userId: authorId
    },
    select: { id: true, name: true },
  });

  // Check if another book with the same name already exists
  // this can be changed later by doing the check directly through data base call for performance
  const existingBook = books.find(b => b.name.toLowerCase().replace(/\s+/g, '') === normalizedTitle);

  if (existingBook) {
    throw new BadRequestError("TITLE ALREADY EXISTS");
  }

  const newBook = await prisma.books.create({
    data: {
      name: title,
      description: description || "",
      userId: authorId,
    },
  });

  //external function to manage book embeddings
  updateBookMasterEmbedding(newBook.id).catch(console.error);

  return newBook;
};

const updateBook = async (bookId, currentUserId, title, description) => {

  //check ownership and grab book
  const { book } = await getOwnedBook(bookId, currentUserId);

  //check edit access helpers
  await checkEditAccess(book);
  await checkMetadataEditAccess(book);

  // Check if another book with the same userId and name already exists
  // can make a global function for this and use it in create books also
  if (title !== book.name) {
    const existingBook = await prisma.books.findFirst({
      where: {
        userId: currentUserId,
        name: title,
        id: { not: parseInt(bookId) },
      },
    });

    if (existingBook) {
      throw new BadRequestError("TITLE ALREADY EXISTS");
    }
  }

  const updatedBook = await prisma.books.update({
    where: { id: parseInt(bookId) },
    data: {
      name: title,
      description: description,
    },
  });

  //incase title or description change update the embeddings
  if (title || description) {
    updateBookMasterEmbedding(updatedBook.id).catch(console.error);
  }

  return updatedBook;
};

const deleteBook = async (bookId, currentUserId) => {

  //check ownership and grab book
  await getOwnedBook(bookId, currentUserId);
  //check if the books has bought chapters
  await checkBookReceipts(bookId);
  await prisma.books.delete({
    where: { id: parseInt(bookId) },
  });

  return true; // Just letting the controller know its done
};

const updateBookStatus = async (bookId, currentUserId, requestedStatus) => {

  //check ownership grab book
  const { book } = await getOwnedBook(bookId, currentUserId);

  //logical checks
  if (book.status === requestedStatus)
    throw new BadRequestError(`BOOK IS ALREADY ${requestedStatus}`);

  if (book.status === "DRAFT")
    throw new BadRequestError("Use Launch Book to publish your book for the first time.");

  if (requestedStatus === "DRAFT") {
    await checkChapterRreceipt(bookId);
  }

  if (requestedStatus === "COMPLETED") {
    const draftChapterCount = await prisma.chapters.count({
      where: { bookId: parseInt(bookId, 10), isPublished: false },
    });
    if (draftChapterCount > 0)
      throw new BadRequestError("All chapters must be published before marking the book as completed.");
  }

  //check edit access
  await checkEditAccess(book);

  //update req to db
  const updatedStatus = await prisma.books.update({
    where: { id: parseInt(bookId, 10) },
    data: { status: requestedStatus },
  });
  return updatedStatus;
};

const updateBookCover = async (bookId, coverImage, currentUserId) => {
  //ownership
  const { book } = await getOwnedBook(bookId, currentUserId);
  //edit access
  await checkEditAccess(book);
  //meta data edit access
  await checkMetadataEditAccess(book);

  const normalizedPath = coverImage.replace(/\\/g, '/');

  //update cover db request
  const updatedBook = await prisma.books.update({
    where: { id: bookId },
    data: {
      coverImage: normalizedPath,
    }
  });
  return updatedBook;
}


const launchBook = async (bookId, currentUserId, chapterPrices = []) => {
  const parsedBookId = parseInt(bookId, 10);

  // Check ownership
  const { book } = await getOwnedBook(parsedBookId, currentUserId);

  if (book.status !== "DRAFT") {
    throw new BadRequestError("Only DRAFT books can be launched.");
  }
  if (!book.coverImage) {
    throw new BadRequestError("Book must have a cover photo to publish.");
  }

  //  Grab ONLY the first 3 chapters and their pages
  const chaptersToLaunch = await prisma.chapters.findMany({
    where: { bookId: parsedBookId },
    orderBy: { chapterNum: "asc" },
    include: { pages: true },
    take: 3, //  Only pull exactly 3 chapters for performance
  });

  // Logic check
  if (chaptersToLaunch.length < 3) {
    throw new BadRequestError("A book must have at least 3 chapters to launch.");
  }

  //Map the updates 
  const updates = chaptersToLaunch.map((ch) => {
    const requestedPrice = ch.chapterNum === 1
      ? 0
      : chapterPrices.find((p) => p.chapterId === ch.id)?.price ?? ch.price;

    //validate the prices using validate util function
    const { finalPrice, isLocked, wordCount } = validateChapterPricing(
      ch.pages,
      requestedPrice,
      ch.chapterNum,
    );

    return prisma.chapters.update({
      where: { id: ch.id },
      data: { isPublished: true, price: finalPrice, isLocked, wordCount },
    });
  });

  const statusUpdate = prisma.books.update({
    where: { id: parsedBookId },
    data: { status: "ONGOING" },
  });

  // Execute transaction
  const results = await prisma.$transaction([...updates, statusUpdate]);

  //update embeddings by adding the page chunks of the chapters
  updateBookMasterEmbedding(parsedBookId).catch(console.error);

  return results[results.length - 1];
};

const submitBookForReview = async (userId, bookId, authorSubmissionNote) => {
  const parsedBookId = parseInt(bookId, 10);
  const parsedUserId = parseInt(userId, 10);
  const parsedSubmissionNote = typeof authorSubmissionNote === "string" ? authorSubmissionNote.trim() : "";
  const book = await prisma.books.findUnique({
    where: { id: parsedBookId }
  });

  //logic checkers
  if (!book) {
    throw new NotFoundError("Book not found");
  }

  if (book.userId !== parsedUserId) {
    throw new ForbiddenError("You do not own this book");
  }

  if (!book.isFlagged) {
    throw new BadRequestError("This book is not currently flagged");
  }

  if (book.isUnderReview) {
    throw new BadRequestError("This book is already under admin review");
  }

  if (!parsedSubmissionNote) {
    throw new BadRequestError("A submission note is required before requesting review");
  }

  // Look for a case awaiting author action
  const awaitingCase = await prisma.moderationLog.findFirst({
    where: {
      bookId: parsedBookId,
      status: "AWAITING_AUTHOR",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!awaitingCase) {
    throw new BadRequestError("No active moderation case awaiting your action was found for this book");
  }

  // Ensure the book meets the minimum chapter requirement before re-submitting to admins.
  const publishedCount = await prisma.chapters.count({
    where: { bookId: parsedBookId, isPublished: true },
  });
  if (publishedCount < 3) {
    throw new BadRequestError(
      "Your book must have at least 3 published chapters before submitting for review.",
    );
  }

  //grab info to update history of the case
  const historyEvent = {
    actorType: "AUTHOR",
    actorId: parsedUserId,
    note: parsedSubmissionNote,
    fromStatus: "AWAITING_AUTHOR",
    toStatus: "UNDER_REVIEW",
  };

  const history = awaitingCase.history ? JSON.parse(awaitingCase.history) : [];
  history.push({ ...historyEvent, createdAt: new Date().toISOString() });

  //update case history in db
  await prisma.moderationLog.update({
    where: { id: awaitingCase.id },
    data: {
      status: "UNDER_REVIEW",
      authorSubmissionNote: parsedSubmissionNote,
      history: JSON.stringify(history),
    },
  });

  //put the book back to under review 
  await prisma.books.update({
    where: { id: parsedBookId },
    data: { isUnderReview: true },
  });
};

const tagBookWithGenres = async (bookId, genreIds, currentUserId) => {
  const book = await prisma.books.findUnique({
    where: { id: parseInt(bookId) },
  });

  if (!book) {
    throw new NotFoundError("BOOK NOT FOUND.");
  }

  if (book.userId !== currentUserId) {
    throw new ForbiddenError("YOU CAN ONLY TAG YOUR BOOKS.");
  }

  await checkMetadataEditAccess(book);

  //Clear off any old genres before adding the new ones
  await prisma.bookGenre.deleteMany({
    where: { bookId: parseInt(bookId) },
  });

  // genre array
  const stickyNotes = genreIds.map((genreId) => ({
    bookId: parseInt(bookId),
    genreId: parseInt(genreId),
  }));

  // createMany inserts the whole array at once
  const newTags = await prisma.bookGenre.createMany({
    data: stickyNotes,
  });

  return newTags;
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  updateBookCover,
  launchBook,
  submitBookForReview,
  tagBookWithGenres,
};
