const prisma = require("../../../db")
const EmbeddingService = require("../../../services/AIServices/VectorServices/EmbeddingService")
const { calculateAverageVector, calculateWeightedBlend } = require("./calculateAverageVector")

const updateBookMasterEmbedding = async (bookId) => {
  try {
    const parsedBookId = parseInt(bookId, 10)

    const bookDetails = await prisma.books.findUnique({
      where: { id: parsedBookId },
      select: {
        name: true,
        description: true,
        pageChunks: { 
          select: { 
            embedding: true,
            chapterId: true 
          } 
        }
      }
    })

    if (!bookDetails) return

    const textToEmbed = `${bookDetails.name}. ${bookDetails.description || ""}`.trim()
    if (textToEmbed.length <= 3) return
    
    // api call latency bottleneck
    const metadataVector = await EmbeddingService.generateEmbedding(textToEmbed)

    // db write O(1)
    if (!bookDetails.pageChunks || bookDetails.pageChunks.length === 0) {
      await prisma.books.update({
        where: { id: parsedBookId },
        data: { embedding: JSON.stringify(metadataVector) }
      })
      return
    }

    // group chunks by chapter id
    // time complexity O(n) where n is total chunks
    // space complexity O(n) to store the grouped arrays in memory
    const chaptersMap = {}
    for (const chunk of bookDetails.pageChunks) {
      // json parse is O(d) where d is vector dimensions 384 so O(1) because it is constant
      const vector = typeof chunk.embedding === 'string' ? JSON.parse(chunk.embedding) : chunk.embedding
      if (!chaptersMap[chunk.chapterId]) {
        chaptersMap[chunk.chapterId] = []
      }
      chaptersMap[chunk.chapterId].push(vector)
    }

    // calculate chapter averages then book average
    // time complexity O(n * d) iterating all chunks across 384 dimensions
    // space complexity O(k * d) where k is number of chapters
    const chapterVectors = Object.values(chaptersMap).map(chunks => calculateAverageVector(chunks))
    const finalContentVector = calculateAverageVector(chapterVectors)

    // blend vectors time complexity O(d) iterating 384 dimensions once
    const masterBookVector = calculateWeightedBlend(finalContentVector, 0.70, metadataVector, 0.30)

    // final db write O(1)
    await prisma.books.update({
      where: { id: parsedBookId },
      data: { embedding: JSON.stringify(masterBookVector) }
    })

    console.log(`[AI Engine] Successfully updated master embedding for Book ${bookId}`)

  } catch (err) {
    console.error(`[AI Engine Error] Failed to update master embedding for Book ${bookId}:`, err)
  }
}

module.exports = { updateBookMasterEmbedding }