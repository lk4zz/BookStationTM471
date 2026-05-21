const prisma = require("../../../db");
const ChunkingService = require("../../../services/AIServices/VectorServices/PageChunkingService");
const EmbeddingService = require("../../../services/AIServices/VectorServices/EmbeddingService");

const pageChunking = async (chapterId, text, currentUserId, targetPageId, chapter) => {
    try {
        const parsedChapterId = parseInt(chapterId, 10);

        // Delete all old chunks (in case user deleted words)
        // Also prevents small chunks if the user rewrote the text
        await prisma.pageChunk.deleteMany({
            where: { pageId: targetPageId }
        });

        // Safely generate metadata. Fallbacks used in case a relation isn't fetched.
        let metadata = null; 
        try {
            const bookName = chapter?.book?.name || "Unknown Book";
            const chapterTitle = chapter?.title || "Unknown Chapter";
            const authorName = chapter?.book?.author?.name || "Unknown Author";
            
            metadata = `Book name: ${bookName}, chapter title: ${chapterTitle}, author name: ${authorName}`;
        } catch (metaError) {
            console.error("[pageChunking] Metadata parsing failed, proceeding without it.", metaError);
        }

        // Chunk the tiptap content
        const chunks = ChunkingService.chunkTipTapContent(text);

        // Embed if there are words
        if (chunks.length > 0) {
            const embeddings = await Promise.all(
                chunks.map(chunk => EmbeddingService.generateEmbedding(chunk))
            );

            // Note: 'metadata' is lowercase to strictly match your Prisma schema
            const chunkData = chunks.map((chunk, index) => ({
                content: chunk,
                embedding: embeddings[index],
                metadata: metadata, 
                pageId: targetPageId,
                chapterId: parsedChapterId,
                bookId: chapter.bookId,
                userId: currentUserId
            }));

            await prisma.pageChunk.createMany({
                data: chunkData
            });
        }
    } catch (error) {
        // Log for server debugging, but do not throw so the user experience isn't interrupted
        console.error("[pageChunking] Background job failed:", error);
    }
}

module.exports = { pageChunking };