const { PrismaClient } = require("@prisma/client");
const ChunkingService = require("../services/VectorEmbedServces/ChunkingService");
const EmbeddingService = require("../services/VectorEmbedServces/EmbeddingService");
const { calculateAverageVector } = require("../utils/vectorMath");

const prisma = new PrismaClient();

async function seedEmbeddings() {
  const books = await prisma.books.findMany({
    include: {
      chapters: {
        include: { pages: true },
      },
    },
  });

  console.log(`Found ${books.length} books to process.\n`);

  let success = 0;
  let failed = 0;

  for (const book of books) {
    try {
      await prisma.pageChunk.deleteMany({ where: { bookId: book.id } });

      let totalChunks = 0;

      for (const chapter of book.chapters) {
        for (const page of chapter.pages) {
          const chunks = ChunkingService.chunkTipTapContent(page.text);
          if (chunks.length === 0) continue;

          const embeddings = await Promise.all(
            chunks.map((chunk) => EmbeddingService.generateEmbedding(chunk))
          );

          const chunkData = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
            pageNumber: page.pageNum,
            pageId: page.id,
            chapterId: chapter.id,
            bookId: book.id,
            userId: book.userId,
          }));

          await prisma.pageChunk.createMany({ data: chunkData });
          totalChunks += chunks.length;
        }
      }

      const textToEmbed = `${book.name}. ${book.description || ""}`.trim();

      if (textToEmbed.length <= 3) {
        console.log(`[SKIP] Book ${book.id} ("${book.name}") — text too short`);
        failed++;
        continue;
      }

      const metadataVector = await EmbeddingService.generateEmbedding(textToEmbed);

      let masterVector;

      if (totalChunks > 0) {
        const chunkRows = await prisma.pageChunk.findMany({
          where: { bookId: book.id },
          select: { embedding: true },
        });

        const chunkVectors = chunkRows.map((row) =>
          typeof row.embedding === "string"
            ? JSON.parse(row.embedding)
            : row.embedding
        );

        const contentVector = calculateAverageVector(chunkVectors);
        masterVector = calculateAverageVector([contentVector, metadataVector]);
      } else {
        masterVector = metadataVector;
      }

      await prisma.books.update({
        where: { id: book.id },
        data: { embedding: JSON.stringify(masterVector) },
      });

      success++;
      console.log(
        `[OK]   Book ${book.id} ("${book.name}") — ${totalChunks} chunks, master embedding updated`
      );
    } catch (err) {
      failed++;
      console.error(`[FAIL] Book ${book.id} ("${book.name}") — ${err.message}`);
    }
  }

  console.log(
    `\nSeed complete: ${success} succeeded, ${failed} failed out of ${books.length} total.`
  );
}

seedEmbeddings()
  .catch((err) => {
    console.error("Seed embeddings script crashed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
