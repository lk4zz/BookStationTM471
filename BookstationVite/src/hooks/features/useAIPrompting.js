import { useAIPrompt } from "../useAI";
import { useState } from "react"

export function useAIPrompting(chapterId = null) {

    // input state and message history for context state
    const [promptInput, setPromptInput] = useState("")
    const [messages, setMessages] = useState([])
    //role ids
    const uid = () => crypto.randomUUID();

    //send the prompt to AI
    const { mutate: sendPrompt } = useAIPrompt();

    //update prompt state
    const handlePromptInput = (prompt) => {
        setPromptInput(prompt)
    }

    //send the prompt
    const handleSendPrompt = () => {
        if (!promptInput) return;
        //store user messages
        const userMessage = { id: uid(), role: "user", content: promptInput.trim() }
        const pendingId = uid();
        //store pending AI response
        const pendingAIResponse = { id: pendingId, role: "assistant", content: "", status: "pending" }
        const chatContext = [...messages, userMessage]
        //filter messages by UID to determine whos user and whos assistant 
            .filter(msg =>
                (msg.role === "user" || msg.role === "assistant") &&
                typeof msg.content === "string" &&
                msg.content.trim().length > 0
            )
            //map out the messages for the prompt
            .map(msg => ({ role: msg.role, content: msg.content }))

        setPromptInput("")
        setMessages(messages => [...messages, userMessage, pendingAIResponse]);

        //send the prompt with messages and chapter ID
        sendPrompt({ messages: chatContext, chapterId }, {
            onSuccess: (response) => {
                const assistantText = response?.response ?? response?.text ?? "No response from AI.";
                setMessages(prevMsgs =>
                    prevMsgs.map(msg => msg.id === pendingId ?
                        { ...msg, content: assistantText, status: "done" } : msg)
                )
            },
            onError: (err) => {
                setMessages(prevMsgs =>
                    prevMsgs.map(msg => msg.id === pendingId ?
                        { ...msg, content: "AI request failed.", status: "error" } : msg)
                )
                console.error(err?.message ?? "Failed to send prompt.");
            }
        })
    };

    return {
        promptInput,
        messages,
        handlePromptInput,
        handleSendPrompt
    }

}

