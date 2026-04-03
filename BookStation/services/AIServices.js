const { GoogleGenerativeAI } = require("@google/generative-ai")
const BadRequestError = require("../errors/BadRequestError")
const AppError = require("../errors/AppError")
const APIKey = process.env.GROQ_API_KEY
const OpenAI = require("openai");


//initialize AI gemini
// const AI = new GoogleGenerativeAI(APIKey)

const client = new OpenAI({
    apiKey: APIKey,
    baseURL: "https://api.groq.com/openai/v1",
});

const PromptAI = async (prompt) => {
    try {
        let messages = null;

        if (Array.isArray(prompt?.messages)) {
            messages = prompt.messages;
        } else if (typeof prompt?.prompt === "string") {
            messages = [{ role: "user", content: prompt.prompt }];
        } else if (typeof prompt === "string") {
            messages = [{ role: "user", content: prompt }];
        }

        if (!Array.isArray(messages) || messages.length === 0) {
            throw new BadRequestError("Please provide messages");
        }

        const transcript = messages
            .filter(m => typeof m?.content === "string" && m.content.trim().length > 0)
            .map(m => `${m.role === "user" ? "User" : "assistant"}: ${m.content}`)
            .join("\n");

        if (!transcript) {
            throw new BadRequestError("Please provide non-empty message content");
        }

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant", // Groq model
            messages,
        });

        const result = completion.choices?.[0]?.message?.content;
        if (!result) {
            throw new AppError("Empty AI response", 500);
        }
        // const model = AI.getGenerativeModel({ model: "gemini-2.5-flash" });
        // const generateContent = await model.generateContent(transcript);
        // const result = generateContent.response.text();

        return result.trim()
    } catch (err) {
        console.error("AI Generation Error:", err);
        if (err instanceof BadRequestError) throw err;
        if (err instanceof AppError) throw err;
        throw new AppError("AI Generation Error", 500);
    }
}


module.exports = {
    PromptAI
}