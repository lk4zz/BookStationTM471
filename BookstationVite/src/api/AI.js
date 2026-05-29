import { privateApi } from "./axios";

export const sendPrompt = async (promptData) => {
    // promptData should be an object: { messages: [context], chapterId: "123" }
    const context = { 
        messages: promptData.messages,
        chapterId: promptData.chapterId 
    };
    
    const res = await privateApi.post("/AI/prompt", context);
    return res.data;
}