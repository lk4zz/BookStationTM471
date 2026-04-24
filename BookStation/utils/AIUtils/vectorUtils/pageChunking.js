const prisma = require("../../../db");
const ChunkingService = require("../../../services/AIServices/VectorServices/PageChunkingService");
const EmbeddingService = require("../../../services/AIServices/VectorServices/EmbeddingService");

const pageChunking = async (chapterId, text, currentUserId, targetPageId, chapter) => {

    const parsedChapterId = parseInt(chapterId, 10);

    // mahhe kel el old chunks (barke el user deleted words)
    //also prevents small chunks eza el user reji3 katab bt3id el chunking depending on size
    await prisma.pageChunk.deleteMany({
        where: { pageId: targetPageId }
    });

    //chunk the tiptap content
    const chunks = ChunkingService.chunkTipTapContent(text);

    //embed if there was any words
    if (chunks.length > 0) {
        const embeddings = await Promise.all(
            chunks.map(chunk => EmbeddingService.generateEmbedding(chunk))
        );

        const chunkData = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
            pageNumber: 1,
            pageId: targetPageId,
            chapterId: parsedChapterId,
            bookId: chapter.bookId,
            userId: currentUserId
        }));

        await prisma.pageChunk.createMany({
            data: chunkData
        });
    }

}

module.exports = { pageChunking };