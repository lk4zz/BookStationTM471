const { pipeline } = require("@xenova/transformers");

class EmbeddingService {
    static extractor = null;

    static async getExtractor() {
        if (!this.extractor) {
            // 'all-MiniLM-L6-v2', a highly efficient, standard model for semantic search
            this.extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        }
        return this.extractor;
    }

    /**
     * Generates a vector embedding for a given text string locally.
     * @param {string} text - The text chunk to embed.
     * @returns {Promise<Array<number>>} - The vector array.
     */
    static async generateEmbedding(text) {
        try {
            const extractor = await this.getExtractor();
            
            // Generate the vector (pooling: "mean" averages the tokens into a single vector)
            const result = await extractor(text, { pooling: "mean", normalize: true });
            
            // Convert the Float32Array into a standard JavaScript Array for Prisma
            return Array.from(result.data); 
        } catch (error) {
            console.error("Local Embedding Error:", error);
            throw new Error("Failed to generate local AI embedding");
        }
    }
}

module.exports = EmbeddingService;