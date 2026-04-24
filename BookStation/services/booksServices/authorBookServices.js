const prisma = require("../../db");
const BadRequestError = require("../../errors/BadRequestError");
const { getOwnedBook } = require("../../utils/BookOwnership");
const { checkBookReceipts, checkChapterRreceipt } = require("../../utils/checkReceipt");
const { checkEditAccess } = require("../../utils/checkEditAccess");
const { updateBookMasterEmbedding } = require("../../utils/AIUtils/vectorUtils/BookDataEmbedder");
const { validateChapterPricing } = require("../../utils/pricingHelper");


const createBook = async (title, description, authorId) => {
  normalizedTitle = title.trim().toLowerCase().replace(/\s+/g, '');
  const books = await prisma.books.findMany({
    where: {
      userId: authorId
    },
    select: { id: true, name: true },
  });

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

  updateBookMasterEmbedding(newBook.id).catch(console.error);

  return newBook;
};

const updateBook = async (bookId, currentUserId, title, description) => {
  // Extract the book object directly from the functions return value
  const { book } = await getOwnedBook(bookId, currentUserId);

  await checkEditAccess(book);

  // Check if another book with the same userId and name already exists
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

  if (title || description) {
    updateBookMasterEmbedding(updatedBook.id).catch(console.error);
  }

  return updatedBook;
};

const deleteBook = async (bookId, currentUserId) => {
  await getOwnedBook(bookId, currentUserId);
  await checkBookReceipts(bookId);
  await prisma.books.delete({
    where: { id: parseInt(bookId) },
  });

  return true; // Just letting the controller know it's done
};

const updateBookStatus = async (bookId, currentUserId, requestedStatus) => {
  const { book } = await getOwnedBook(bookId, currentUserId);

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

  await checkEditAccess(book);

  const updatedStatus = await prisma.books.update({
    where: { id: parseInt(bookId, 10) },
    data: { status: requestedStatus },
  });
  return updatedStatus;
};

const updateBookCover = async (bookId, coverImage, currentUserId) => {
  await getOwnedBook(bookId, currentUserId);
  const normalizedPath = coverImage.replace(/\\/g, '/');
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
  const { book } = await getOwnedBook(parsedBookId, currentUserId);

  if (book.status !== "DRAFT")
    throw new BadRequestError("Only DRAFT books can be launched.");

  const chapters = await prisma.chapters.findMany({
    where: { bookId: parsedBookId },
    orderBy: { chapterNum: "asc" },
    include: { pages: true },
  });

  if (chapters.length < 3)
    throw new BadRequestError("A book must have at least 3 chapters to launch.");

  if (!book.coverImage) {
    throw new BadRequestError("Book must have a cover photo to publish.")
  }

  const first3 = chapters.slice(0, 3);

  const updates = first3.map((ch) => {
    const requestedPrice = ch.chapterNum === 1
      ? 0
      : chapterPrices.find((p) => p.chapterId === ch.id)?.price ?? ch.price;

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

  const results = await prisma.$transaction([...updates, statusUpdate]);

  updateBookMasterEmbedding(parsedBookId).catch(console.error);

  return results[results.length - 1];
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  updateBookStatus,
  updateBookCover,
  launchBook,
};
