const prisma = require("../db");
const { cosineSimilarity } = require("../utils/cosineSimilarity");
const catchAsync = require("../middlewares/catchAsync");

/** Cap scored books returned (and DB fetch) for browser/SVG performance. */
const RADAR_BOOK_LIMIT = 500;

const getUserRadar = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }

  // No auth / ownership check — testing & demos only; lock down before production.

  const tasteUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { tasteProfile: true },
  });

  if (!tasteUser || !tasteUser.tasteProfile) {
    return res.json({ isPersonalized: false, books: [] });
  }

  const targetVector = JSON.parse(tasteUser.tasteProfile);

  const library = await prisma.library.findUnique({
    where: { userId },
    select: { id: true },
  });
  const libraryBookRows = library
    ? await prisma.libraryBook.findMany({
        where: { libraryId: library.id },
        select: { bookId: true },
      })
    : [];
  const libraryBookIdSet = new Set(libraryBookRows.map((r) => r.bookId));

  const allBooks = await prisma.books.findMany({
    where: {
      embedding: { not: null },
      NOT: { status: "DRAFT" },
    },
    select: {
      id: true,
      name: true,
      coverImage: true,
      embedding: true,
    },
    orderBy: { id: "asc" },
    take: RADAR_BOOK_LIMIT,
  });

  const scoredBooks = allBooks.map((book) => {
    const bookVector = JSON.parse(book.embedding);
    const { embedding, ...safeBookData } = book;

    return {
      ...safeBookData,
      similarityScore: cosineSimilarity(targetVector, bookVector),
      inLibrary: libraryBookIdSet.has(safeBookData.id),
    };
  });

  scoredBooks.sort((a, b) => b.similarityScore - a.similarityScore);

  return res.json({
    isPersonalized: true,
    books: scoredBooks,
  });
});

module.exports = { getUserRadar };
