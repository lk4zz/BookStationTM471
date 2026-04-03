import { privateApi } from "./axios";

export const sendPrompt = async (promptData) => {
    // promptData should now be an object: { messages: [...], chapterId: "123" }
    const context = { 
        messages: promptData.messages,
        chapterId: promptData.chapterId 
    };
    
    const res = await privateApi.post("/AI/prompt", context);
    return res.data;
}