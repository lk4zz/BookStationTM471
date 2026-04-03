import { privateApi } from "./axios";

export const sendPrompt = async (prompt) => {
    console.log(prompt.messages)
    const res = await privateApi.post("/AI/prompt", { messages: prompt.messages });
    return res.data;

}