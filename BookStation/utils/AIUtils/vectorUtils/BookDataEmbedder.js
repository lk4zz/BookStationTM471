const prisma = require("../../../db");
const { calculateAverageVector } = require("./calculateAverageVector");
const EmbeddingService = require("../../../services/AIServices/VectorServices/EmbeddingService");

const updateBookMasterEmbedding = async (bookId) => {
  try {
    const parsedBookId = parseInt(bookId, 10);

    const bookDetails = await prisma.books.findUnique({
      where: { id: parsedBookId },
      select: {
        name: true,
        description: true,
        pageChunks: { select: { embedding: true } }
      }
    });

    if (!bookDetails) return;

    const textToEmbed = `${bookDetails.name}. ${bookDetails.description || ""}`.trim();

    if (textToEmbed.length <= 3) return;

    const metadataVector = await EmbeddingService.generateEmbedding(textToEmbed);

    // No chunks yet — save metadata-only vector (covers book creation & detail updates)
    if (!bookDetails.pageChunks || bookDetails.pageChunks.length === 0) {
      await prisma.books.update({
        where: { id: parsedBookId },
        data: { embedding: JSON.stringify(metadataVector) }
      });
      console.log(`[AI Engine] Initialized metadata embedding for empty Book ID: ${parsedBookId}`);
      return;
    }

    // Chunks exist — blend content vectors with metadata vector
    const chunkVectors = bookDetails.pageChunks.map(chunk => {
      return typeof chunk.embedding === 'string' ? JSON.parse(chunk.embedding) : chunk.embedding;
    });

    const contentVector = calculateAverageVector(chunkVectors);
    const masterBookVector = calculateAverageVector([contentVector, metadataVector]);

    await prisma.books.update({
      where: { id: parsedBookId },
      data: { embedding: JSON.stringify(masterBookVector) }
    });

    console.log(`[AI Engine] Successfully blended and updated master embedding for Book ID: ${parsedBookId}`);
  } catch (err) {
    console.error(`[AI Engine Error] Failed to update master embedding for Book ${bookId}:`, err);
  }
};

module.exports = { updateBookMasterEmbedding };
