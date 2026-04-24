const OpenAI = require("openai");
const prisma = require("../../db");
const EmbeddingService = require("./VectorServices/EmbeddingService"); // Our local Hugging Face service
const BadRequestError = require("../../errors/BadRequestError");
const AppError = require("../../errors/AppError");
const { buildSystemPrompt } = require("../../utils/AIUtils/RAGPrompt"); // ✅ Correct import
const { cosineSimilarity } = require("../../utils/AIUtils/vectorUtils/cosineSimilarity");

const API_KEY = process.env.GROQ_API_KEY;

const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const PromptAI = async (input) => {
    try {
        let messages = Array.isArray(input?.messages) ? input.messages : [];
        const chapterId = input?.chapterId;

        if (!messages.length) {
            throw new BadRequestError("Please provide valid messages for the AI.");
        }

        // Sanitize user messages
        const sanitizedMessages = messages.filter(
            (m) => typeof m?.content === "string" && m.content.trim().length > 0
        );

        // --- RAG RETRIEVAL PIPELINE ---
        let systemPromptContext = "";

        if (chapterId) {
            const userQuestion = sanitizedMessages[sanitizedMessages.length - 1].content;

            const queryVector = await EmbeddingService.generateEmbedding(userQuestion);

            const chunks = await prisma.pageChunk.findMany({
                where: {
                    chapterId: parseInt(chapterId, 10),
                }
            });

            if (chunks.length > 0) {
                // Score chunks by similarity
                const scoredChunks = chunks.map(chunk => {
                    const chunkEmbeddingArray = typeof chunk.embedding === 'string'
                        ? JSON.parse(chunk.embedding)
                        : chunk.embedding;

                    return {
                        ...chunk,
                        score: cosineSimilarity(queryVector, chunkEmbeddingArray)
                    };
                });

                scoredChunks.sort((a, b) => b.score - a.score);
                const topChunks = scoredChunks.slice(0, 5);

                // ✅ Use the external function to build the system prompt
                systemPromptContext = buildSystemPrompt(topChunks);
            }
        }

        // --- PROMPT ASSEMBLY ---
        const finalMessagesForGroq = [];

        if (systemPromptContext) {
            finalMessagesForGroq.push({ role: "system", content: systemPromptContext });
        }

        finalMessagesForGroq.push(...sanitizedMessages);

        // --- LLM GENERATION ---
        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: finalMessagesForGroq,
            temperature: 0.7,
        });

        const result = completion.choices?.[0]?.message?.content;
        if (!result) throw new AppError("Empty AI response", 500);

        return result.trim();

    } catch (err) {
        console.error("AI Generation Error:", err.message);
        if (err instanceof BadRequestError || err instanceof AppError) throw err;
        throw new AppError("AI Generation Error: " + (err.message || "Unknown error"), 500);
    }
}

module.exports = {
    PromptAI
};