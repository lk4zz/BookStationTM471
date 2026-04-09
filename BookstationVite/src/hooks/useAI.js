import { useMutation } from "@tanstack/react-query"
import { sendPrompt } from "../api/AI"

export const useAIPrompt = () => {
    return useMutation({
        mutationFn: (prompt) => sendPrompt(prompt),
    onError: (err) => { //hayda is global error handling can be removed later if not used
        console.error(err?.message ?? "Failed to send prompt.");
    }
    })
}