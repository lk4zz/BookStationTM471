import { useAIPrompt } from "../useAI";
import { useState } from "react"

export function useAIPrompting() {

    const [promptInput, setPromptInput] = useState("")
    const [AIResponse, setAIResponse] = useState("")
    const [messages, setMessages] = useState([])
    const uid = () => crypto.randomUUID();

    const { mutate: sendPrompt } = useAIPrompt();

    const handlePromptInput = (prompt) => {
        setPromptInput(prompt)
    }

    const handleSendPrompt = () => {
        if (!promptInput) return;
        const userMessage = { id: uid(), role: "user", content: promptInput.trim() }
        const pendingId = uid();
        const pendingAIResponse = { id: pendingId, role: "assistant", content: "", status: "pending" }
        const chatContext = [...messages, userMessage]
            .filter(msg =>
                (msg.role === "user" || msg.role === "assistant") &&
                typeof msg.content === "string" &&
                msg.content.trim().length > 0
            )
            .map(msg => ({ role: msg.role, content: msg.content }))

        setAIResponse("")
        setPromptInput("")
        setMessages(messages => [...messages, userMessage, pendingAIResponse]);

        sendPrompt({ messages: chatContext }, {
            onSuccess: (response) => {
                setMessages(prevMsgs =>
                    prevMsgs.map(msg => msg.id === pendingId ?
                        { ...msg, content: response.text, status: "done" } : msg)
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
        AIResponse,
        messages,
        handlePromptInput,
        handleSendPrompt
    }

}

