import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { sendPrompt } from "../api/AI"

export const useAIPrompt = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (prompt) => sendPrompt(prompt),
    onSuccess: (response) => {
        queryClient.invalidateQueries({queryKey: ["AI"]})
    },
    onError: (err) => { //hayda is global error handling can be removed later if not used
        console.error(err?.message ?? "Failed to send prompt.");
    }
    })
}